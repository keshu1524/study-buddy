import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { todayStr } from '../utils'
import { CHAPTERS } from './Progress'

// ---- helpers ----
function shuffle(a) {
  const b = a.slice()
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}
function pickN(arr, n) { return shuffle(arr).slice(0, n) }
// MCQ ke options shuffle — bank me answer:index-0 pattern chhupane ke liye
function shuffleOpts(m) {
  const order = shuffle(m.options.map((_, i) => i))
  return { ...m, options: order.map(i => m.options[i]), answer: order.indexOf(m.answer) }
}

// quiz bank ids ke prefix se subject match
function subjectOf(quiz) {
  if (quiz.id.startsWith('pol-')) return 'Pol. Science 11th'
  if (quiz.id.startsWith('eng-')) return 'English 11th'
  if (quiz.id.startsWith('geo-')) return 'Geography 11th'
  return null
}

// mind-map nodes se MCQ (MindMaps स्वयं-टेस्ट wala idea); lang se question-text localize
function mcqFromMap(map, size, lang = 'hi') {
  const all = []
  const pairs = []
  const collect = n => { all.push(n.label); (n.children || []).forEach(c => { pairs.push({ branch: n.label, answer: c.label }); collect(c) }) }
  collect(map.root)
  return pickN(pairs, size).map(p => {
    const others = all.filter(l => l && l !== p.answer && l !== p.branch)
    const opts = shuffle([p.answer, ...pickN(others, 3)]).slice(0, 4)
    const q = lang === 'hi' ? `«${p.branch}» ke अंतर्गत?` : `Under «${p.branch}»?`
    return { q, options: opts, answer: opts.indexOf(p.answer) }
  }).filter(m => m.options.length > 2)
}

function loadLog() {
  try { return JSON.parse(localStorage.getItem('sb_mocklog') || '[]') } catch { return [] }
}
function saveLog(l) { localStorage.setItem('sb_mocklog', JSON.stringify(l.slice(0, 50))) }

// ---------- page ----------
export default function MockTest() {
  const { lang, quizzes, mindmaps, qna } = useStore()
  const [view, setView] = useState('setup') // setup | paper | result
  const [subject, setSubject] = useState('Pol. Science 11th')
  const [chapterId, setChapterId] = useState('') // '' = पूरा पेपर
  const [paper, setPaper] = useState(null)
  const [picks, setPicks] = useState({})   // MCQ {i: optIdx}
  const [open, setOpen] = useState({})     // subjective {i: true} मॉडल देखो
  const [selfMarks, setSelfMarks] = useState({}) // {i: true}
  const [secs, setSecs] = useState(0)
  const [log, setLog] = useState(loadLog)

  // timer
  useEffect(() => {
    if (view !== 'paper') return undefined
    const it = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(it)
  }, [view])

  const chapters = CHAPTERS[subject] || []
  const H = (hi, en) => (lang === 'hi' ? hi : en)

  function generate() {
    let MCQ = []
    let shorts = []
    let longs = []
    if (chapterId) {
      // ---------- chapter test ----------
      // sabse pehle extract-based per-chapter bank (id = chapterId + '-mcq')
      const ownBank = (quizzes || []).find(q => q.id === chapterId + '-mcq')
      if (ownBank && ownBank.questions.length) MCQ = pickN(ownBank.questions, Math.min(8, ownBank.questions.length))
      const map = (mindmaps || []).find(m => m.id === chapterId + '-map')
      if (MCQ.length < 8 && map) MCQ = [...MCQ, ...mcqFromMap(map, 8 - MCQ.length, lang)]
      const bank = (quizzes || []).filter(q => subjectOf(q) === subject).flatMap(q => q.questions)
      if (MCQ.length < 8 && bank.length) {
        MCQ = [...MCQ, ...pickN(bank, Math.min(8 - MCQ.length, bank.length))]
      }
      const own = (qna || []).find(x => x.id === chapterId)
      if (own) { shorts = [own]; longs = [] }
      // थोड़ा extra: usi chapter ke aur points se ek short
      const more = (qna || []).filter(x => x.id !== chapterId && x.id.startsWith('pol-') === chapterId.startsWith('pol-') && x.id.startsWith('geo-') === chapterId.startsWith('geo-'))
      if (more.length && shorts.length < 2) shorts = [...shorts, ...pickN(more, 1)]
    } else {
      // ---------- पूरा पेपर (weekly mock) ----------
      // extract-based chapter-banks pehle (deep NCERT-style), phir baki banks se top-up
      const deep = (quizzes || []).filter(q => subjectOf(q) === subject && q.id.endsWith('-mcq')).flatMap(q => q.questions)
      const rest = (quizzes || []).filter(q => subjectOf(q) === subject && !q.id.endsWith('-mcq')).flatMap(q => q.questions)
      MCQ = [...pickN(deep, 7), ...pickN(rest, 5)]
      const maps = (mindmaps || []).filter(m => m.subject === subject && m.kind !== 'important')
      pickN(maps, 2).forEach(m => { MCQ = [...MCQ, ...mcqFromMap(m, 2, lang)] })
      MCQ = shuffle(MCQ).slice(0, 10)
      const pool = shuffle((qna || []).filter(x => x.id.startsWith(subject.startsWith('English') ? 'eng-' : subject.startsWith('Pol') ? 'pol-' : 'geo-')))
      shorts = pool.slice(0, 3)
      longs = pool.slice(3, 5)
    }
    MCQ = MCQ.map(shuffleOpts)
    if (!MCQ.length && !shorts.length && !longs.length) return
    setPaper({ mcqs: MCQ, shorts, longs, subject, chapterId })
    setPicks({}); setOpen({}); setSelfMarks({}); setSecs(0)
    setView('paper')
  }

  function submit() {
    const mcqTotal = paper.mcqs.length
    const mcqScore = paper.mcqs.filter((m, i) => picks[i] === m.answer).length
    const subjTotal = paper.shorts.length * 3 + paper.longs.length * 5
    const subjScore = Object.keys(selfMarks).filter(k => selfMarks[k]).length * 2 // roughly per-point
    const l = loadLog()
    l.unshift({
      day: todayStr(), subject: paper.subject, chapter: paper.chapterId || 'full',
      mcq: mcqScore + '/' + mcqTotal, mcqPct: Math.round(mcqScore / Math.max(1, mcqTotal) * 100),
      subj: subjScore + '/' + subjTotal, mins: Math.round(secs / 60),
    })
    saveLog(l); setLog(l)
    setPaper(prev => ({ ...prev, mcqScore, mcqTotal, subjScore, subjTotal }))
    setView('result')
  }

  function clearLog() {
    if (confirm(lang === 'hi' ? 'सारा mock-test record मिटा दें?' : 'Delete the entire mock-test record?')) { saveLog([]); setLog([]) }
  }
  function delLog(i) { const l = loadLog(); l.splice(i, 1); saveLog(l); setLog(l) }

  // ---- SETUP ----
  if (view === 'setup') {
    return (
      <div className="page">
        <h1>📄 {lang === 'hi' ? 'मॉक टेस्ट' : 'Mock Test'}</h1>
        <div className="panel">
          <h3>🎯 {H('पेपर बनाओ', 'Build your paper')}</h3>
          <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
            <select className="input" value={subject} onChange={e => { setSubject(e.target.value); setChapterId('') }}>
              {Object.keys(CHAPTERS).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="input grow" value={chapterId} onChange={e => setChapterId(e.target.value)}>
              <option value="">{lang === 'hi' ? '📄 पूरा पेपर (weekly mock)' : '📄 Full paper (weekly mock)'}</option>
              {chapters.map(c => <option key={c.id} value={c.id}>{lang === 'hi' ? c.hi : c.en}</option>)}
            </select>
            <button className="btn primary" onClick={generate}>🚀 {H('पेपर शुरू', 'Start paper')}</button>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            {chapterId
              ? H('एक chapter का focus-test — 8 MCQ + 2 short answers (3 अंक तक self-check)', 'One-chapter focus test — 8 MCQ + 2 short answers (3-mark self-check)')
              : H('पूरा पेपर — 10 MCQ + 3 short answers + 2 × 5-अंक, board-style. घड़ी चालू।', 'Full paper — 10 MCQ + 3 short answers + 2 × 5-mark, board-style. Timer running.')}
          </p>
        </div>
        <div className="panel">
          <div className="page-head">
            <h3>🗂 {H('पिछले tests', 'Past tests')} ({log.length})</h3>
            {log.length > 0 && <button className="btn small danger" onClick={clearLog}>🧹 {H('सब साफ़', 'Clear all')}</button>}
          </div>
          {log.length === 0 ? (
            <p className="muted">{H('अभी कोई mock नहीं — पहला पेपर दो! 💪', 'No mock yet — take your first paper! 💪')}</p>
          ) : (
            <div className="mist-list">
              {log.map((r, i) => (
                <div className="mist-row" key={i}>
                  <span className="rev-name">{r.day} · {r.subject.replace(' 11th', '')} · {(() => {
                    if (r.chapter === 'full') return H('📄 पूरा', '📄 Full')
                    const c = (CHAPTERS[r.subject] || []).find(x => x.id === r.chapter)
                    const nm = c ? (lang === 'hi' ? c.hi : c.en) : r.chapter
                    return nm.length > 22 ? nm.slice(0, 22) + '…' : nm
                  })()} · <b>{r.mcq}</b> MCQ · {r.subj} self · {r.mins} min</span>
                  <button className="btn small danger" onClick={() => delLog(i)}>🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ---- RESULT ----
  if (view === 'result') {
    const mcqPct = Math.round(paper.mcqScore / Math.max(1, paper.mcqTotal) * 100)
    return (
      <div className="page">
        <h1>📊 Result — {paper.subject.replace(' 11th', '')}</h1>
        <div className="panel">
          <h3>✅ {H('अंक-पत्र', 'Mark-sheet')}</h3>
          <p>
            Objective (MCQ): <b>{paper.mcqScore}/{paper.mcqTotal}</b> ({mcqPct}%) — {'🌟'.repeat(Math.min(5, Math.round(mcqPct / 20) + 1))}
          </p>
          <p>{lang === 'hi' ? 'Subjective (self-check):' : 'Subjective (self-check):'} <b>{paper.subjScore}/{paper.subjTotal}</b> approx</p>
          <p>{H('समय:', 'Time:')} <b>{Math.floor(secs / 60)} min {secs % 60}s</b></p>
          {mcqPct >= 80 && <p className="muted">🔥 {H('जबरदस्त! Board pattern में पकड़ बन रही है।', 'Great! Board-pattern grip is building up.')}</p>}
          {mcqPct >= 40 && mcqPct < 80 && <p className="muted">👍 {H('ठीक-ठाक — गलत प्रश्न दोबारा फेरो।', 'Okay-ok — revise the missed questions.')}</p>}
          {mcqPct < 40 && <p className="muted">💪 {H('चलो पनपे — नोट और mind map दोबारा एक round।', 'Let\u2019s grow — one more round of notes & mind maps.')}</p>}
          <button className="btn" onClick={() => setView('setup')}>⬅ {H('नया पेपर', 'New paper')}</button>
        </div>
      </div>
    )
  }

  // ---- PAPER ----
  const chRow = (CHAPTERS[paper.subject] || []).find(c => c.id === paper.chapterId)
  const title = paper.chapterId
    ? (lang === 'hi' ? chRow?.hi : chRow?.en) || paper.chapterId
    : H('पूरा पेपर (Weekly Mock)', 'Full paper (Weekly Mock)')
  return (
    <div className="page">
      <div className="q-paper">
        <div className="q-head">
          <h2>Class 11 — {paper.subject}</h2>
          <p className="muted">{title} · {lang === 'hi' ? 'अभ्यास प्रश्न-पत्र' : 'Practice Question Paper'}</p>
          <p className="muted">⏱ {Math.floor(secs / 60)} min {secs % 60}s · <button className="btn small primary" onClick={submit}>✔ {H('पेपर जमा करो', 'Submit paper')}</button></p>
        </div>

        <div className="q-sec">
          <h3>{H(`खंड A — वस्तुनिष्ठ प्रश्न (${paper.mcqs.length} × 1 अंक)`, `Section A — Objective (${paper.mcqs.length} × 1 mark)`)}</h3>
          {paper.mcqs.map((m, i) => (
            <div className="q-item" key={i}>
              <div className="q-q">{i + 1}. {m.q}</div>
              <div className="q-opts">
                {m.options.map((o, oi) => (
                  <button
                    key={oi}
                    className={'q-opt' + (picks[i] === oi ? ' picked' : '')}
                    onClick={() => setPicks(p => ({ ...p, [i]: oi }))}
                  >{o}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="q-sec">
          <h3>{H(`खंड B — लघु उत्तरीय (${paper.shorts.length} × 3 अंक)`, `Section B — Short answers (${paper.shorts.length} × 3 marks)`)}</h3>
          {paper.shorts.map((s, i) => {
            const key = 's' + i
            return (
              <div className="q-item" key={i}>
                <div className="q-q">{i + 1}. {s.q} <span className="muted">{H('(3 अंक)', '(3 marks)')}</span></div>
                <textarea className="q-ans input" rows="3" placeholder={H('यहाँ अपना उत्तर लिखो…', 'Write your answer here…')} />
                <button className="btn small" onClick={() => setOpen(o => ({ ...o, [key]: !o[key] }))}>
                  {open[key] ? H('🙈 छुपाओ', '🙈 Hide') : H('👁 मॉडल उत्तर देखो', '👁 Show model answer')}
                </button>
                {open[key] && (
                  <ol className="mm-pts">
                    {s.points.slice(0, 5).map((p, j) => (
                      <li key={j}>
                        {p}{' '}
                        <input
                          type="checkbox"
                          checked={!!selfMarks[key + ':' + j]}
                          onChange={e => setSelfMarks(s2 => ({ ...s2, [key + ':' + j]: e.target.checked }))}
                        /> <span className="muted">{H('मिलता है?', 'matches?')}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )
          })}
        </div>

        <div className="q-sec">
          <h3>{H(`खंड C — दीर्घ उत्तरीय (${paper.longs.length} × 5 अंक)`, `Section C — Long answers (${paper.longs.length} × 5 marks)`)}</h3>
          {paper.longs.map((s, i) => {
            const key = 'l' + i
            return (
              <div className="q-item" key={i}>
                <div className="q-q">{i + 1}. {s.q} <span className="muted">{H('(5 अंक)', '(5 marks)')}</span></div>
                <textarea className="q-ans input" rows="6" placeholder={H('यहाँ विस्तार से उत्तर लिखो…', 'Write your detailed answer here…')} />
                <button className="btn small" onClick={() => setOpen(o => ({ ...o, [key]: !o[key] }))}>
                  {open[key] ? H('🙈 छुपाओ', '🙈 Hide') : H('👁 मॉडल उत्तर देखो', '👁 Show model answer')}
                </button>
                {open[key] && (
                  <ol className="mm-pts">
                    {s.points.map((p, j) => (
                      <li key={j}>
                        {p}{' '}
                        <input
                          type="checkbox"
                          checked={!!selfMarks[key + ':' + j]}
                          onChange={e => setSelfMarks(s2 => ({ ...s2, [key + ':' + j]: e.target.checked }))}
                        /> <span className="muted">{H('मिलता है?', 'matches?')}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )
          })}
        </div>

        <p className="muted">💡 {H('हर point ✔ करने पर self-अंक मिलेगा — बस, पेपर जमा करो!', 'Every ✔ point counts toward self-marks — now submit the paper!')}</p>
      </div>
    </div>
  )
}
