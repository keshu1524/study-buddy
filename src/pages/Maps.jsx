import { useState } from 'react'
import { useStore } from '../store'
import { VB, xy, PATHS } from '../india'
// outline v3: अब साफ single-mainland + द्वीप (~43 polys), सीधी रेखाएँ नहीं

// 🌏 नक्शा अभ्यास — board Q26-style India map tasks
// स्रोत: sb_maps [{id, topic, q, dots: [{name, lat, lon}], sol: [names], tip?, arrows?: [{name, fa:[lat,lon], ta:[lat,lon]}]}]
// विधि: सवाल दिखे → उम्मीदवार बिंदु numbered → दिखाओ (पूरा या tap-by-tap) → सही हरे, बाकी लाल — self-check, score नहीं
// मोड: 📝 सूची से (list) | 🧠 याद-मोड (बिना सूची, दिमाग में गिनो) · setup में topic filter + 🎲 रैंडम
// outline: EXACT India border — 36 SOI-accurate state polygons ka union (src/india.js, auto-generated), dots lat/lon se project hote hain

export default function Maps() {
  const { lang, maps } = useStore()
  const [view, setView] = useState('setup') // setup | quiz
  const [topic, setTopic] = useState('') // '' = सब
  const [idx, setIdx] = useState(0)
  const [shownSet, setShownSet] = useState(() => new Set()) // tap-by-tap reveal
  const [shownAll, setShownAll] = useState(false)
  const [mode, setMode] = useState('list') // list | recall
  const [listShownMid, setListShownMid] = useState(false) // याद-मोड के बीच सूची दिखाना (सिर्फ उस task के लिए)

  const H = (hi, en) => (lang === 'hi' ? hi : en)
  const all = maps || []
  const topics = [...new Set(all.map(m => m.topic || 'आम'))]
  const items = topic ? all.filter(m => (m.topic || 'आम') === topic) : all
  const cur = items[idx] || null

  function open(i) {
    setIdx(i)
    setShownSet(new Set())
    setShownAll(false)
    setListShownMid(false)
    setView('quiz')
  }
  function next() { open(Math.min(items.length - 1, idx + 1)) }
  function prev() { open(Math.max(0, idx - 1)) }
  function tearDownListBtn() { setView('setup') }

  const isSol = n => cur && cur.sol.includes(n)
  const shownAllNow = shownAll
  const recallNow = mode === 'recall' && !listShownMid // derived — stale-closure bug se bachne ke liye

  // ---- SETUP ----
  if (view === 'setup') {
    return (
      <div className="page">
        <h1>🌏 {H('नक्शा अभ्यास', 'Map Practice')}</h1>
        <div className="panel">
          <h3>🗺 {H('नक्शा-काम चुनो', 'Pick a map task')}</h3>
          <p className="muted">
            {H('Board paper ka Q26 — India naksha par bhauteek/rachnatmak tattu ginne ke abhyas. Pehle khud batao, phir 🔁 दिखाओ — हरा = सही, लाल = बाकी। Dot पर tap = एक-एक self-check. 🧠 याद-मोड में सूची छिपी रहती है — दिमाग से नाम गिनो!',
              'Board-style Q26 — practise locating India\u2019s features on the map. Answer first, then 🔁 reveal (green = correct). Tap a dot for one-by-one self-check. 🧠 Recall mode hides the list — name the dots from memory!')}
          </p>
          <div className="row" style={{ marginTop: 8, gap: 8, flexWrap: 'wrap' }}>
            {[H('सब', 'All'), ...topics].map(tp => (
              <button
                key={tp}
                className={'btn small' + (topic === tp || (topic === '' && tp === H('सब', 'All')) ? ' primary' : '')}
                onClick={() => { setTopic(tp === H('सब', 'All') ? '' : tp); setIdx(0) }}
              >
                {tp}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: 10, gap: 10 }}>
            <button className={'btn small' + (mode === 'list' ? ' primary' : '')} onClick={() => setMode('list')}>📝 {H('सूची से पहचानो', 'With list')}</button>
            <button className={'btn small' + (mode === 'recall' ? ' primary' : '')} onClick={() => setMode('recall')}>🧠 {H('याद-मोड (बिना सूची)', 'Recall (no list)')}</button>
            <button
              className="btn small"
              onClick={() => items.length ? open(Math.floor(Math.random() * items.length)) : null}
            >🎲 {H('रैंडम task', 'Random task')}</button>
          </div>
          <div className="mist-list" style={{ marginTop: 10 }}>
            {items.map((m, i) => (
              <div className="mist-row" key={m.id} style={{ justifyContent: 'space-between' }}>
                <span className="rev-name"><b>{i + 1}</b> · {m.topic ? '🏷 ' + m.topic + ' · ' : ''}{m.q.slice(0, 40)}{m.q.length > 40 ? '…' : ''} · {m.sol.length}/{m.dots.length}</span>
                <button className="btn small" onClick={() => open(i)}>▶ {H('खोलो', 'Open')}</button>
              </div>
            ))}
            {items.length === 0 && <p className="muted">{H('इस topic में अभी कोई task नहीं — filter बदलो।', 'No tasks under this topic — change the filter.')}</p>}
          </div>
          {all.length > 0 && (
            <p className="muted" style={{ marginTop: 8 }}>
              🧮 {H('कुल', 'Total')}: <b>{all.length}</b> {H('tasks', 'tasks')} · <b>{topics.length}</b> {H('topics', 'topics')} — {H('self-check है, score नहीं — आँख मज़बूत करो! 👁', 'self-check, no score — sharpen your eye! 👁')}
            </p>
          )}
        </div>
      </div>
    )
  }

  // ---- QUIZ ----
  if (!cur) {
    setView('setup')
    return null
  }
  const revealCount = shownAllNow ? cur.dots.length : shownSet.size
  return (
    <div className="page">
      <h1>🌏 {H('नक्शा अभ्यास', 'Map Practice')}</h1>
      <div className="panel">
        <div className="page-head">
          <h3>🗺 {H('प्रश्न', 'Question')} {idx + 1}/{items.length}{cur.topic ? ' · 🏷 ' + cur.topic : ''}</h3>
          <span className="muted">{H('दिखे', 'revealed')}: {revealCount}/{cur.dots.length} ({cur.sol.length} {H('सही', 'correct')})</span>
        </div>
        <p className="q-q">{cur.q}</p>
        {cur.tip && <p className="muted">⭐ <b>{H('परीक्षा नुस्खा', 'Exam tip')}:</b> {cur.tip}</p>}
        <p className="muted" style={{ marginTop: 8 }}>
          {recallNow
            ? H('🧠 याद-मोड: सूची नहीं दिखेगी — नक्शे के बिंदु देखो, जगह दिमाग में नामों को फिट करो। रुक जाओ तब दिखाओ।',
              '🧠 Recall: list is hidden — name the dots from memory, then reveal.')
            : H('ऊपर लिखे बिंदु नक्शे पर numbered हैं — पहले खुद बताओ कौन-सा नंबर किस जगह, फिर दिखाओ। Dot पर tap = उसी एक का self-check।',
              'Numbered dots on the map — answer first, then reveal. Tap a dot to self-check just that one.')}
        </p>

        {!recallNow && (
          <ol className="mm-pts">
            {cur.dots.map((d, i) => {
              const seenRow = shownAllNow || shownSet.has(d.name)
              return (
                <li key={d.name}>
                  <b>{i + 1}. {d.name}</b>
                  {seenRow && <span className="muted"> — {isSol(d.name) ? '✅ ' + H('सही', 'correct') : '❌ ' + H('नहीं', 'no')}</span>}
                </li>
              )
            })}
          </ol>
        )}

        <div style={{ textAlign: 'center', marginTop: 10, overflow: 'auto' }}>
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} width="100%" style={{ maxWidth: 420, minWidth: 340 }} role="img" aria-label="India map">
            <defs>
              <marker id="sb-arrh" markerWidth="12" markerHeight="10" refX="9" refY="4" orient="auto">
                <path d="M0,0 L0,8 L9,4 z" fill="#455a64" />
              </marker>
            </defs>
            {PATHS.map((poly, i) => (
              <polygon
                key={i}
                points={poly.map(pt => pt.join(',')).join(' ')}
                fill="#dcedc8"
                stroke="#558b2f"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            ))}
            {(cur.arrows || []).map(a => {
              const [x1, y1] = xy(a.fa[0], a.fa[1])
              const [x2, y2] = xy(a.ta[0], a.ta[1])
              return (
                <g key={a.name}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#455a64" strokeWidth="4" markerEnd="url(#sb-arrh)" opacity="0.8" />
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#37474f"
                    stroke="#fff"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    {a.name}
                  </text>
                </g>
              )
            })}
            {cur.dots.map((d, i) => {
              const [dx, dy] = xy(d.lat, d.lon)
              const opened = shownAllNow || shownSet.has(d.name)
              const solved = opened && isSol(d.name)
              const missed = opened && !isSol(d.name)
              return (
                <g
                  key={d.name}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShownSet(prev => {
                    const s = new Set(prev)
                    s.has(d.name) ? s.delete(d.name) : s.add(d.name)
                    return s
                  })}
                >
                  <circle
                    cx={dx}
                    cy={dy}
                    r="11"
                    fill={solved ? '#2e7d32' : missed ? '#c62828' : '#5c6bc0'}
                    stroke={!opened ? '#fff' : '#1b5e20'}
                    strokeWidth="2"
                    opacity={missed ? 0.55 : 1}
                  />
                  <text x={dx} y={dy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" style={{ pointerEvents: 'none' }}>
                    {i + 1}
                  </text>
                  {opened && (
                    <text
                      x={dx}
                      y={dy - 15}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill={solved ? '#1b5e20' : '#b71c1c'}
                      stroke="#fff"
                      strokeWidth="3"
                      paintOrder="stroke"
                      style={{ pointerEvents: 'none' }}
                    >
                      {d.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
        <div className="row" style={{ marginTop: 12, gap: 10, flexWrap: 'wrap' }}>
          {recallNow && <button className="btn" onClick={() => setListShownMid(true)}>📝 {H('सूची दिखाओ', 'Show list')}</button>}
          <button className="btn primary" onClick={() => setShownAll(true)}>🔁 {H('सब दिखाओ', 'Reveal all')}</button>
          <button className="btn" onClick={() => { setShownSet(new Set()); setShownAll(false) }}>↻ {H('दोबारा (से शुरू)', 'Again (from start)')}</button>
        </div>
        <div className="row" style={{ marginTop: 12, gap: 10 }}>
          <button className="btn" disabled={idx === 0} onClick={prev}>⬅ {H('पिछला', 'Previous')}</button>
          <button className="btn" onClick={tearDownListBtn}>📜 {H('सूची', 'List')}</button>
          <select
            className="input grow"
            value={cur.id}
            onChange={e => open(items.findIndex(x => x.id === e.target.value))}
          >
            {items.map((m, i) => <option key={m.id} value={m.id}>{i + 1}. {(m.topic || '') + ' · '}{m.q.slice(0, 34)}…</option>)}
          </select>
          <button className="btn primary" disabled={idx === items.length - 1} onClick={next}>{H('अगला', 'Next')} ➡</button>
        </div>
      </div>
    </div>
  )
}
