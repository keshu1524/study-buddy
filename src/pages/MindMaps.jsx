// 🗺️ Mind Maps — advanced: revise tracking ✅, zoom/focus, self-test quiz
import { useMemo, useState } from 'react'
import { useStore } from '../store'

// ---------- helpers ----------
function leafCount(node) {
  if (!node.children || node.children.length === 0) return 1
  return node.children.reduce((s, c) => s + leafCount(c), 0)
}

function buildQuiz(map, size = 8) {
  // questions: "X branch में कौन नहीं?" nahi — simple: "«branch» में कौन-सा topic?"
  const all = []
  const collect = n => { all.push(n.label); (n.children || []).forEach(collect) }
  collect(map.root)
  const qs = []
  const walk = n => {
    const kids = n.children || []
    kids.forEach(k => qs.push({ branch: n.label, answer: k.label }))
    kids.forEach(walk)
  }
  walk(map.root)
  const sampled = []
  const pool = qs.slice()
  while (sampled.length < size && pool.length > 0) {
    sampled.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  }
  return sampled.map(q => {
    const opts = [q.answer]
    const others = all.filter(l => l !== q.answer)
    while (opts.length < Math.min(4, others.length + 1)) {
      const p = others[Math.floor(Math.random() * others.length)]
      if (!opts.includes(p)) opts.push(p)
    }
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp
    }
    return { ...q, opts }
  })
}

// ---------- recursive tree node (expand/collapse + done-check) ----------
function Node({ node, depth, path, mapId, revise, toggleDone }) {
  const [open, setOpen] = useState(depth < 1)
  const hasKids = node.children && node.children.length > 0
  const color = ['root', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6'][Math.min(depth, 6)]
  const pk = mapId + '::' + path
  const done = !!revise[pk]
  return (
    <div className="mm-node">
      <div className="mm-row">
        <button
          className={'mm-label mm-' + color + (hasKids ? ' mm-parent' : '')}
          onClick={() => hasKids && setOpen(o => !o)}
          style={{ paddingLeft: 6 + depth * 22 }}
        >
          <span className="mm-caret">{hasKids ? (open ? '▾' : '▸') : '•'}</span>
          <span>{node.label}</span>
        </button>
        <button
          className={'mm-done' + (done ? ' active' : '')}
          title={done ? 'बूझ गया ✓' : 'बूझ गया? दबाओ'}
          onClick={() => toggleDone(pk, !done)}
        >{done ? '✅' : '⬜'}</button>
      </div>
      {hasKids && open && (
        <div className="mm-children">
          {node.children.map((c, i) => (
            <Node key={i} node={c} depth={depth + 1} path={path + '.' + i} mapId={mapId} revise={revise} toggleDone={toggleDone} />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- self-test quiz panel ----------
function Quiz({ map, onClose }) {
  const qs = useMemo(() => buildQuiz(map), [map])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const finished = idx >= qs.length

  if (qs.length === 0) return (
    <div className="mm-quiz">
      <h2>🎯 स्वयं-टेस्ट</h2>
      <p className="muted">इस map में quiz नहीं बन सका।</p>
      <button className="mm-opt" onClick={onClose}>✖ बंद</button>
    </div>
  )

  if (finished) return (
    <div className="mm-quiz">
      <h2>🎯 परिणाम</h2>
      <p className="mm-score">{score} / {qs.length} ✅ ({Math.round(score / qs.length * 100)}%)</p>
      <p className="muted">{score >= qs.length * 0.8 ? 'बढ़िया! topic पक्का हुआ।' : 'फिर से branch देखकर आज़माओ।'}</p>
      <div className="mm-quiz-btns">
        <button className="mm-opt" onClick={() => { setIdx(0); setScore(0); setPicked(null) }}>↺ फिर से</button>
        <button className="mm-opt" onClick={onClose}>✖ बंद</button>
      </div>
    </div>
  )

  const q = qs[idx]
  return (
    <div className="mm-quiz">
      <div className="mm-quiz-head">
        <strong>🎯 Q{idx + 1}/{qs.length}</strong>
        <span className="muted">{q.branch}</span>
      </div>
      <p className="mm-quiz-q">«{q.branch}» में कौन-सा topic आता है?</p>
      <div className="mm-opts">
        {q.opts.map(o => (
          <button
            key={o}
            className={'mm-opt' + (picked ? (o === q.answer ? ' correct' : (o === picked ? ' wrong' : '')) : '')}
            disabled={!!picked}
            onClick={() => {
              setPicked(o)
              if (o === q.answer) setScore(s => s + 1)
              setTimeout(() => { setPicked(null); setIdx(i => i + 1) }, 900)
            }}
          >{o}</button>
        ))}
      </div>
    </div>
  )
}

// ---------- single map card ----------
function MapView({ map, revise, toggleDone, note, qnaItem }) {
  const [zoom, setZoom] = useState(1)
  const [quizOpen, setQuizOpen] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [showQna, setShowQna] = useState(false)
  const total = leafCount(map.root)
  let done = 0
  Object.keys(revise).forEach(k => {
    if (k.startsWith(map.id + '::r.') && revise[k]) done++
  })
  const pct = Math.min(100, Math.round(done / total * 100))
  const mapped = !!note || !!qnaItem

  return (
    <div className="page-inner">
      <div className="mm-head">
        <h2>{map.title}</h2>
        <div className="mm-tools">
          <span className="mm-prog" title="बूझे गए टॉपिक">
            <span className="mm-prog-bar"><span style={{ width: pct + '%' }} /></span>
            <span className="mm-prog-txt">{pct}% ✅</span>
          </span>
          <button className="mm-tool" onClick={() => setZoom(z => Math.max(0.6, z - 0.1))}>➖</button>
          <span className="mm-tool-txt">{Math.round(zoom * 100)}%</span>
          <button className="mm-tool" onClick={() => setZoom(z => Math.min(1.6, z + 0.1))}>➕</button>
          <button className="mm-tool mm-quiz-btn" onClick={() => setQuizOpen(true)}>🎯 स्वयं-टेस्ट</button>
          {note && (
            <button className={'mm-tool' + (showNote ? ' active' : '')} onClick={() => { setShowNote(s => !s); setShowQna(false) }}>
              📝 नोट
            </button>
          )}
          {qnaItem && (
            <button className={'mm-tool' + (showQna ? ' active' : '')} onClick={() => { setShowQna(s => !s); setShowNote(false) }}>
              ✏️ 5-अंक
            </button>
          )}
        </div>
      </div>
      {quizOpen && <Quiz map={map} onClose={() => setQuizOpen(false)} />}
      <div className={(showNote || showQna) && mapped ? 'mm-split' : ''}>
        <div className="mm-tree" style={{ transform: 'scale(' + zoom + ')', transformOrigin: 'top left' }}>
          <Node node={map.root} depth={0} path="r" mapId={map.id} revise={revise} toggleDone={toggleDone} />
        </div>
        {(showNote || showQna) && mapped && (
          <div className="mm-sidecol">
            {showNote && note && (
              <div className="mm-card">
                <h3>📝 {note.title}</h3>
                <div className="mm-note-body">{note.body}</div>
              </div>
            )}
            {showQna && qnaItem && (
              <div className="mm-card">
                <h3>✏️ {qnaItem.q}</h3>
                <ol className="mm-pts">
                  {qnaItem.points.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="muted mm-hint">
        💡 branch पर click = खोलो/बंद · ⬜/✅ = बूझ गया mark · <span lang="en">expand branch · mark topic done</span>
      </p>
    </div>
  )
}

export default function MindMaps() {
  const { lang, mindmaps, mmRevise, setMMRevise, notes, qna, subjects } = useStore()
  const [focus, setFocus] = useState(false)

  // subjects select = store-subjects + map-subjects दोनों का संगम (map सुब्जेक्ट अलग होते हैं)
  const mmSubjects = useMemo(() => [...new Set((mindmaps || []).map(m => m.subject))], [mindmaps])
  const subjectPool = useMemo(
    () => [...new Set([...(subjects || []), ...mmSubjects])],
    [subjects, mmSubjects]
  )

  const [subject, setSubject] = useState('English 11th')
  const effSubject = subjectPool.includes(subject)
    ? subject
    : (mmSubjects[0] || subjectPool[0] || '')
  const [kind, setKind] = useState('chapter') // 'chapter' | 'important'
  const [activeId, setActiveId] = useState(null)

  const list = (mindmaps || []).filter(m => m.subject === effSubject && (kind === 'important' ? m.kind === 'important' : m.kind !== 'important'))
  const active = list.find(m => m.id === activeId) || list[0]
  // chapter id = map id minus '-map' (eng-h1-map → eng-h1) — वही Progress/Notes की id
  const chapterId = active && active.id.endsWith('-map') ? active.id.slice(0, -4) : null
  const note = chapterId ? (notes || []).find(n => n.id === chapterId) : null
  const qnaItem = chapterId ? (qna || []).find(x => x.id === chapterId) : null

  const toggleDone = (pk, val) => {
    setMMRevise(prev => {
      const next = { ...prev }
      if (val) next[pk] = true
      else delete next[pk]
      return next
    })
  }

  if (!mindmaps || mindmaps.length === 0) {
    return (
      <div className="page">
        <h1>🗺️ {lang === 'hi' ? 'माइंड मैप्स' : 'Mind Maps'}</h1>
        <p className="muted">
          {lang === 'hi'
            ? 'कोई mind map load नहीं हुई — कुछ सेकंड में disk से auto-recall होगी। Reload करके देखो।'
            : 'No mind maps loaded yet — they auto-recall from disk in a few seconds. Try reloading.'}
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>🗺️ {lang === 'hi' ? 'माइंड मैप्स' : 'Mind Maps'}</h1>
      <div className="mm-controls">
        <select value={effSubject} onChange={e => { setSubject(e.target.value); setActiveId(null) }}>
          {subjectPool.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="mm-tabs">
          <button className={kind === 'chapter' ? 'active' : ''} onClick={() => { setKind('chapter'); setActiveId(null) }}>
            📖 {lang === 'hi' ? 'सभी chapters' : 'All Chapters'}
          </button>
          <button className={kind === 'important' ? 'active' : ''} onClick={() => { setKind('important'); setActiveId(null) }}>
            ⭐ {lang === 'hi' ? 'Important Topics' : 'Important Topics'}
          </button>
        </div>
        <button
          className={'mm-tool mm-focus' + (focus ? ' active' : '')}
          title={lang === 'hi' ? 'पूरी चौड़ाई (list छिपाओ)' : 'Focus mode (hide list)'}
          onClick={() => setFocus(f => !f)}
        >{focus ? '🎯 Focus ON' : '🎯 Focus'}</button>
      </div>
      <div className={'mm-layout' + (focus ? ' focus' : '')}>
        <div className="mm-list panel">
          {list.map(m => (
            <button
              key={m.id}
              className={'mm-item' + (active && active.id === m.id ? ' active' : '')}
              onClick={() => setActiveId(m.id)}
            >
              <span>{m.title}</span>
            </button>
          ))}
        </div>
        <div className="panel">
          {active ? <MapView map={active} revise={mmRevise} toggleDone={toggleDone} note={note} qnaItem={qnaItem} /> : (
            <p className="muted">{lang === 'hi' ? 'बाईं ओर कोई map चुनो।' : 'Pick a map on the left.'}</p>
          )}
        </div>
      </div>
    </div>
  )
}
