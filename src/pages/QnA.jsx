import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { todayStr } from '../utils'
import { CHAPTERS } from './Progress'

// ✍️ 5-अंक Q&A practice — Mock Test ka bhai, sirf दीर्घ प्रश्नों ke liye
// स्रोत: sb_qna (54 chapters) — q में "(HBSE Feb-2024...)" marker वाले asli board प्रश्न भी
// नियम: pehle khud likho → फिर बिंदु-दर-बिंदु self-check ✔ → अंक-पत्र X/5
// record: sb_qnalog (cap 30) — manual 🗑/🧹 से ही data jata hai

function loadLog() {
  try { return JSON.parse(localStorage.getItem('sb_qnalog') || '[]') } catch { return [] }
}
function saveLog(l) { localStorage.setItem('sb_qnalog', JSON.stringify(l.slice(0, 30))) }

// qna id prefix → subject key (CHAPTERS ke keys se match)
function subjectOf(id) {
  if (id.startsWith('eng-')) return 'English 11th'
  if (id.startsWith('pol-')) return 'Pol. Science 11th'
  if (id.startsWith('geo-')) return 'Geography 11th'
  return null
}
const SUBJECTS = ['English 11th', 'Pol. Science 11th', 'Geography 11th']

export default function QnA() {
  const { lang, qna } = useStore()
  const [view, setView] = useState('setup') // setup | qa | result
  const [mode, setMode] = useState('practice') // practice | recall
  const [subject, setSubject] = useState('Pol. Science 11th')
  const [qaId, setQaId] = useState('') // '' = रैंडम
  const [qa, setQa] = useState(null)
  const [open, setOpen] = useState(false) // practice: मॉडल उत्तर दिखा?
  const [revN, setRevN] = useState(0) // recall: kitne बिंदु reveal ho चुके
  const [checks, setChecks] = useState({})
  const [secs, setSecs] = useState(0)
  const [score, setScore] = useState(0)
  const [log, setLog] = useState(loadLog)

  useEffect(() => {
    if (view !== 'qa') return undefined
    const it = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(it)
  }, [view])

  const H = (hi, en) => (lang === 'hi' ? hi : en)
  const pool = (qna || []).filter(x => subjectOf(x.id) === subject)

  function pick() {
    let next = null
    if (qaId) next = (qna || []).find(x => x.id === qaId)
    if (!next) {
      // random — last-used dobara na de (thoda variety)
      const used = log.slice(0, 3).map(r => r.qaId)
      const fresh = pool.filter(x => !used.includes(x.id))
      const arr = fresh.length ? fresh : pool
      next = arr[Math.floor(Math.random() * arr.length)] || null
    }
    if (!next) return
    setQa(next); setOpen(false); setChecks({}); setSecs(0); setScore(0); setRevN(0)
    setView('qa')
  }

  function submit() {
    const cnt = qa.points.filter((_, j) => checks['p' + j]).length
    const sc = Math.max(0, Math.min(5, Math.round(cnt / Math.max(1, qa.points.length) * 5)))
    setScore(sc)
    const l = loadLog()
    l.unshift({ day: todayStr(), subject, qaId: qa.id, score: sc + '/5', mins: Math.round(secs / 60) })
    saveLog(l); setLog(l)
    setView('result')
  }

  function clearLog() {
    if (confirm(lang === 'hi' ? 'सारा 5-अंक Q&A record मिटा दें?' : 'Delete the entire Q&A practice record?')) { saveLog([]); setLog([]) }
  }
  function delLog(i) { const l = loadLog(); l.splice(i, 1); saveLog(l); setLog(l) }

  function chapterName(id) {
    const c = (CHAPTERS[subject] || []).find(x => x.id === id)
    if (c) return lang === 'hi' ? c.hi : c.en
    return id
  }

  // ---- SETUP ----
  if (view === 'setup') {
    return (
      <div className="page">
        <h1>✍️ {H('5-अंक Q&A Practice', '5-Mark Q&A Practice')}</h1>
        <div className="panel">
          <h3>🎯 {H('प्रश्न चुनो', 'Pick a question')}</h3>
          <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
            <select className="input" value={subject} onChange={e => { setSubject(e.target.value); setQaId('') }}>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="input grow" value={qaId} onChange={e => setQaId(e.target.value)}>
              <option value="">{H('🎲 रैंडम प्रश्न (recommended)', '🎲 Random question (recommended)')}</option>
              {pool.map(x => <option key={x.id} value={x.id}>{(x.q || '').slice(0, 60)}…</option>)}
            </select>
            <button className="btn primary" onClick={() => { setMode('practice'); pick() }}>🚀 {H('अभ्यास (लिखो+गिनो)', 'Practice (write+score)')}</button>
            <button className="btn" onClick={() => { setMode('recall'); pick() }}>🧠 {H('याद-मोड', 'Recall mode')}</button>
          </div>
          <p className="muted" style={{ marginTop: 8 }}>
            <b>🚀 {H('अभ्यास', 'Practice')}:</b> {H('पहले खुद लिखो', 'write yourself first')}
            {' '}→ {' '}<b>👁 {H('मॉडल उत्तर', 'model answer')}</b>
            {' '}→ {' '}<b>✔ {H('बिंदु-दर-बिंदु self-check', 'point-by-point self-check')}</b>
            {' '}→ {' '}<b>📊 {H('अंक-पत्र /5', 'mark-sheet /5')}</b>
          </p>
          <p className="muted">
            <b>🧠 {H('याद-मोड', 'Recall mode')}:</b> {H('सिर्फ प्रश्न देखो → उत्तर दिमाग में दोहराओ → बिंदु-एक-एक-कर-के दिखेंगे (🔁 खोए बिंदु फेरो) — स्कोर नहीं, शुद्ध याद-drill।',
              'Just the question → recall the answer in your head → points reveal one-by-one (🔁 re-run missed ones) — no score, pure recall drill.')}
          </p>
          <p className="muted">🧾 {H('asli board sawal:', 'real board questions:')} (HBSE Feb-2024) {H('निशान वाले प्रश्न — पिछली परीक्षा में इसी रूप में आए!', 'marked questions — came exactly like this in the last exam!')}</p>
        </div>
        <div className="panel">
          <div className="page-head">
            <h3>🗂 {H('पिछली practice', 'Past practice')} ({log.length})</h3>
            {log.length > 0 && <button className="btn small danger" onClick={clearLog}>🧹 {H('सब साफ़', 'Clear all')}</button>}
          </div>
          {log.length === 0 ? (
            <p className="muted">{H('अभी कोई practice नहीं — पहला प्रश्न दो! 💪', 'No practice yet — take your first question! 💪')}</p>
          ) : (
            <div className="mist-list">
              {log.map((r, i) => (
                <div className="mist-row" key={i}>
                  <span className="rev-name">{r.day} · {r.subject.replace(' 11th', '')} · {chapterName(r.qaId).slice(0, 22)} · <b>{r.score}</b> · {r.mins} min</span>
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
    const pct = score / 5 * 100
    return (
      <div className="page">
        <h1>📊 {H('अंक-पत्र', 'Mark-sheet')} — {chapterName(qa.id).slice(0, 24)}</h1>
        <div className="panel">
          <h3>✅ {score}/5 {'🌟'.repeat(Math.max(1, Math.min(5, Math.round(pct / 20) + (score >= 1 ? 0 : -1) + 1)))}</h3>
          <p className="muted">{H('समय:', 'Time:')} <b>{Math.floor(secs / 60)} min {secs % 60}s</b></p>
          <p className="q-q">{qa.q}</p>
          <p className="muted">{H('जो बिंदु ✔ नहीं मिले, वही दोबारा फेरो — Mind Maps के उस branch को देखो।',
            'Re-read the points you missed — check that branch in the mind map.')}</p>
          {pct >= 80 && <p className="muted">🔥 {H('जबरदस्त — board-pattern पकड़ मजबूत!', 'Superb — board-pattern grip is solid!')}</p>}
          {pct >= 40 && pct < 80 && <p className="muted">👍 {H('ठीक-ठाक — 2 मिनट revision aur ek dobara।', 'Okay-ok — a 2-minute revision, once more.')}</p>}
          {pct < 40 && <p className="muted">💪 {H('चलो पनपे — नोट/Mind Map पहले, practice बाद।', 'Let\u2019s grow — notes/mind map first, practice after.')}</p>}
          <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
            <button className="btn" onClick={() => setView('setup')}>⬅ {H('नया प्रश्न', 'New question')}</button>
            <button className="btn primary" onClick={pick}>🔁 {H('अगला प्रश्न', 'Next question')}</button>
          </div>
        </div>
      </div>
    )
  }

  // ---- QA ----
  const chRow = (CHAPTERS[subject] || []).find(c => c.id === qa.id)
  const recall = mode === 'recall'
  const done = qa.points.filter((_, j) => checks['p' + j]).length
  const shown = recall ? qa.points.slice(0, revN) : qa.points
  const allShown = !recall || revN >= qa.points.length
  return (
    <div className="page">
      <div className="q-paper">
        <div className="q-head">
          <h2>{recall ? '🧠 याद-मोड' : '✍️ 5 अंक'} — {subject.replace(' 11th', '')}</h2>
          <p className="muted">{lang === 'hi' ? chRow?.hi : chRow?.en} · {recall ? H('याद drill', 'recall drill') : H('दीर्घ उत्तरीय (board-style)', 'Long answer (board-style)')}</p>
          <p className="muted">⏱ {Math.floor(secs / 60)} min {secs % 60}s</p>
        </div>
        <div className="q-sec">
          <div className="q-item">
            <div className="q-q">{qa.q} <span className="muted">{recall ? H('(अब याद करो…)', '(recall now…)') : H('(5 अंक)', '(5 marks)')}</span></div>
            {recall ? (
              <>
                {revN === 0 && <p className="muted">🧠 {H('रुको — उत्तर दिमाग में बोलो या लिखो। जब रुक जाओ, तब बिंदु दिखाओ।', 'Hold — say or write the answer in your head/notes. When you stall, reveal points.')}</p>}
                <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
                  {!allShown && <button className="btn primary" onClick={() => setRevN(n => n + 1)}>👁 {H('अगला बिंदु', 'Next point')} ({revN + 1}/{qa.points.length})</button>}
                  {allShown && <span className="muted">✅ {H('पूरा उत्तर दिख गया', 'Full answer revealed')}</span>}
                </div>
                <ol className="mm-pts">
                  {shown.map((p, j) => <li key={j}>{p}</li>)}
                </ol>
                <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
                  <button className="btn" onClick={() => setRevN(0)}>🔁 {H('दोबारा (से शुरू)', 'Again (from start)')}</button>
                  <button className="btn primary" onClick={() => { setMode('recall'); pick() }}>➡ {H('नया प्रश्न', 'New question')}</button>
                </div>
              </>
            ) : (
              <>
                {!open && (
                  <p className="muted">✍️ {H('पहले यहाँ अपना उत्तर लिखो (या कॉपी पर) — फिर उत्तर खोल कर self-check करो।', 'First write your answer here (or on paper) — then open the model and self-check.')}</p>
                )}
                <textarea className="q-ans input" rows="7" placeholder={H('यहाँ विस्तार से उत्तर लिखो…', 'Write your detailed answer here…')} />
                {!open ? (
                  <button className="btn primary" onClick={() => setOpen(true)}>👁 {H('मॉडल उत्तर देखो — self-check शुरू', 'Show model answer — start self-check')}</button>
                ) : (
                  <>
                    <p className="muted">✔ {H('हर बिंदु पर टिक करो जो तुमने (या सोचकर) लिखा — फिर अंक जमा करो।',
                      'Tick every point you wrote (or recalled) — then submit marks.')}</p>
                    <ol className="mm-pts">
                      {qa.points.map((p, j) => (
                        <li key={j}>
                          {p}{' '}
                          <input
                            type="checkbox"
                            checked={!!checks['p' + j]}
                            onChange={e => setChecks(c => ({ ...c, ['p' + j]: e.target.checked }))}
                          /> <span className="muted">{H('मिलता है?', 'matches?')}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="row" style={{ flexWrap: 'wrap', gap: 10 }}>
                      <button className="btn primary" onClick={submit}>✔ {H('अंक जमा करो', 'Submit marks')}</button>
                      <span className="muted">{done}/{qa.points.length} {H('बिंदु मिले', 'points matched')}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
