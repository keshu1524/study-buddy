import { useState } from 'react'
import { useStore } from '../store'

// 📘 लंबे उत्तर संग्रह (Long Answer Bank) — topic-wise FULL board-style long answers
// स्रोत: sb_longs [{id, subject, chapter, topic, points[]}] — 18 topics
// नियम: English chapters → English; Pol/Geo → Hindi; format भूमिका → विस्तृत बिंदु → निष्कर्ष + परीक्षा-नुस्खा
// view: sirf reading — pun/score nahi; setup (subject select → topic list) → padho view (⬅➡ prev/next)

const SUBJECTS = ['English 11th', 'Pol. Science 11th', 'Geography 11th']
const ICONS = { 'English 11th': '🇬🇧', 'Pol. Science 11th': '🏛', 'Geography 11th': '🌍' }

// point ka leading label jatao (INTRODUCTION:, भूमिका:, परीक्षा नुस्खा: ...) — pehla "word से पहले:"
function labelOf(p) {
  const i = p.indexOf(':')
  return i > 0 && i < 30 ? p.slice(0, i) : ''
}
function bodyOf(p) {
  const i = p.indexOf(':')
  return i > 0 && i < 30 ? p.slice(i + 1).trim() : p
}

export default function Longs() {
  const { lang, longs } = useStore()
  const [view, setView] = useState('setup') // setup | read
  const [subject, setSubject] = useState('')
  const [idx, setIdx] = useState(0)

  const H = (hi, en) => (lang === 'hi' ? hi : en)
  const items = (longs || []).filter(x => !subject || x.subject === subject)
  const groups = SUBJECTS.map(s => ({ s, list: (longs || []).filter(x => x.subject === s) })).filter(g => g.list.length)
  const cur = items[idx] || null

  function open(s) { setSubject(s); setIdx(0); setView('read') }

  // ---- SETUP ----
  if (view === 'setup') {
    return (
      <div className="page">
        <h1>📘 {H('लंबे उत्तर संग्रह', 'Long Answer Bank')}</h1>
        <div className="panel">
          <h3>📖 {H('विषय चुनो', 'Pick a subject')}</h3>
          <p className="muted">
            {H('Har chapter ke full board-style long answers — भूमिका से निष्कर्ष तक, परीक्षा-नुस्खा के साथ। पढ़ो, दोहराओ, exam se pehle revise karo।',
              'Full board-style long answers for each chapter — from introduction to conclusion, with an exam tip. Read, repeat, revise before the exam.')}
          </p>
          <div className="mist-list" style={{ marginTop: 10 }}>
            {groups.map(g => (
              <div className="mist-row" key={g.s} style={{ justifyContent: 'space-between' }}>
                <span className="rev-name">{ICONS[g.s]} <b>{g.s}</b> · {g.list.length} {H('topics', 'topics')}</span>
                <button className="btn small" onClick={() => open(g.s)}>📖 {H('पढ़ें', 'Read')}</button>
              </div>
            ))}
            {groups.length === 0 && <p className="muted">{H('अभी कोई long answer नहीं — data load hone de।', 'No long answers yet — wait for data to load.')}</p>}
          </div>
        </div>
      </div>
    )
  }

  // ---- READ ----
  if (!cur) {
    setView('setup')
    return null
  }

  function next() { setIdx(i => Math.min(items.length - 1, i + 1)) }
  function prev() { setIdx(i => Math.max(0, i - 1)) }

  // points ke andar: pehla wale INTRO points, exam-tip point ko highlight
  return (
    <div className="page">
      <h1>📘 {H(subject, 'Long Answers')}</h1>
      <div className="panel">
        <div className="page-head">
          <h3>{cur.topic}</h3>
          <span className="muted" style={{ whiteSpace: 'nowrap' }}>{idx + 1}/{items.length}</span>
        </div>
        <div style={{ marginTop: 10 }}>
          {cur.points.map((p, i) => {
            const lab = labelOf(p)
            const isTip = /परीक्षा नुस्खा|exam tip/i.test(lab)
            if (lab && isTip) {
              return (
                <p key={i} className="muted" style={{ marginTop: 12 }}>
                  ⭐ <b>{lab}:</b> {bodyOf(p)}
                </p>
              )
            }
            return (
              <p key={i} style={{ marginTop: i === 0 ? 0 : 10 }}>
                {lab ? <>{lab} — </> : null}
                {lab ? bodyOf(p) : p}
              </p>
            )
          })}
        </div>
        <div className="row" style={{ marginTop: 14, gap: 10 }}>
          <button className="btn" disabled={idx === 0} onClick={prev}>⬅ {H('पिछला topic', 'Previous')}</button>
          <button className="btn" onClick={() => setView('setup')}>📜 {H('विषय-सूची', 'Topic list')}</button>
          <select className="input grow" value={cur.id} onChange={e => setIdx(items.findIndex(x => x.id === e.target.value))}>
            {items.map(x => <option key={x.id} value={x.id}>{x.topic.replace(/^लंबा उत्तर: |^Long Answer: /, '').slice(0, 64)}</option>)}
          </select>
          <button className="btn primary" disabled={idx === items.length - 1} onClick={next}>{H('अगला topic', 'Next')} ➡</button>
        </div>
      </div>
    </div>
  )
}
