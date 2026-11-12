import { useState } from 'react'
import { useStore } from '../store'

// Har subject ke chapters (IDs = note IDs, taaki note khol sako)
export const CHAPTERS = {
  'English 11th': [
    { id: 'eng-h1', hi: 'Hornbill 1 — The Portrait of a Lady', en: 'Hornbill 1 — The Portrait of a Lady' },
    { id: 'eng-h2', hi: "Hornbill 2 — We're Not Afraid to Die", en: "Hornbill 2 — We're Not Afraid to Die" },
    { id: 'eng-h3', hi: 'Hornbill 3 — Discovering Tut', en: 'Hornbill 3 — Discovering Tut' },
    { id: 'eng-h4', hi: 'Hornbill 4 — The Ailing Planet', en: 'Hornbill 4 — The Ailing Planet' },
    { id: 'eng-h5', hi: 'Hornbill 5 — The Adventure', en: 'Hornbill 5 — The Adventure' },
    { id: 'eng-h6', hi: 'Hornbill 6 — Silk Road', en: 'Hornbill 6 — Silk Road' },
    { id: 'eng-p1', hi: 'Poem 1 — A Photograph', en: 'Poem 1 — A Photograph' },
    { id: 'eng-p2', hi: 'Poem 2 — The Laburnum Top', en: 'Poem 2 — The Laburnum Top' },
    { id: 'eng-p3', hi: 'Poem 3 — The Voice of the Rain', en: 'Poem 3 — The Voice of the Rain' },
    { id: 'eng-p4', hi: 'Poem 4 — Childhood', en: 'Poem 4 — Childhood' },
    { id: 'eng-p5', hi: 'Poem 5 — Father to Son', en: 'Poem 5 — Father to Son' },
    { id: 'eng-s1', hi: 'Snapshot 1 — The White Horse', en: 'Snapshot 1 — The White Horse' },
    { id: 'eng-s2', hi: 'Snapshot 2 — The Address', en: 'Snapshot 2 — The Address' },
    { id: 'eng-s5', hi: "Snapshot 5 — Mother's Day", en: "Snapshot 5 — Mother's Day" },
    { id: 'eng-s7', hi: 'Snapshot 7 — Birth', en: 'Snapshot 7 — Birth' },
    { id: 'eng-s8', hi: 'Snapshot 8 — The Tale of Melon City', en: 'Snapshot 8 — The Tale of Melon City' },
  ],
  'Pol. Science 11th': [
    { id: 'pol-a1', hi: 'राजनीतिक सिद्धांत — परिचय', en: 'Political Theory — Intro' },
    { id: 'pol-a2', hi: 'लोकतंत्र (स्वतंत्रता)', en: 'Liberty' },
    { id: 'pol-a3', hi: 'समानता', en: 'Equality' },
    { id: 'pol-a4', hi: 'सामाजिक न्याय', en: 'Social Justice' },
    { id: 'pol-a5', hi: 'अधिकार ⭐8 अंक', en: 'Rights ⭐8 marks' },
    { id: 'pol-a6', hi: 'नागरिकता ⭐7 अंक', en: 'Citizenship ⭐7 marks' },
    { id: 'pol-a7', hi: 'राष्ट्रवाद ⭐6 अंक', en: 'Nationalism ⭐6 marks' },
    { id: 'pol-a8', hi: 'धर्मनिरपेक्षता', en: 'Secularism' },
    { id: 'pol-b1', hi: 'संविधान क्यों और कैसे', en: 'Constitution: Why & How' },
    { id: 'pol-b2', hi: 'संविधान में अधिकार', en: 'Rights in Constitution' },
    { id: 'pol-b3', hi: 'चुनाव-प्रतिनिधित्व ⭐6', en: 'Elections ⭐6' },
    { id: 'pol-b4', hi: 'कार्यपालिका ⭐6', en: 'Executive ⭐6' },
    { id: 'pol-b5', hi: 'विधायिका', en: 'Legislature' },
    { id: 'pol-b6', hi: 'न्यायपालिका', en: 'Judiciary' },
    { id: 'pol-b7', hi: 'संघवाद', en: 'Federalism' },
    { id: 'pol-b8', hi: 'स्थानीय शासन', en: 'Local Government' },
    { id: 'pol-b9', hi: 'जीवंत दस्तावेज', en: 'Living Document' },
    { id: 'pol-b10', hi: 'संविधान का दर्शन', en: 'Political Philosophy' },
  ],
  'Geography 11th': [
    { id: 'geo-p1', hi: 'भूगोल: एक विषय के रूप में ⭐3 अंक', en: 'Geography as a Discipline ⭐3' },
    { id: 'geo-p2', hi: 'पृथ्वी की उत्पत्ति एवं विकास', en: 'Origin & Evolution of Earth' },
    { id: 'geo-p3', hi: 'पृथ्वी की आंतरिक संरचना', en: 'Interior of the Earth' },
    { id: 'geo-p4', hi: 'महासागरों-महाद्वीपों का वितरण', en: 'Distribution of Oceans & Continents' },
    { id: 'geo-p5', hi: 'भू-आकृतिक प्रक्रियाएँ', en: 'Geomorphic Processes' },
    { id: 'geo-p6', hi: 'भू-आकृतियाँ व उनका विकास ⭐9 अंक', en: 'Landforms ⭐9 marks' },
    { id: 'geo-p7', hi: 'वायुमंडल का संघटन व संरचना', en: 'Atmosphere: Composition & Structure' },
    { id: 'geo-p8', hi: 'सौर विकिरण, ऊष्मा संतुलन व तापमान', en: 'Solar Radiation & Temperature' },
    { id: 'geo-p9', hi: 'वायुमंडलीय परिसंचरण व मौसम प्रणालियाँ', en: 'Circulation & Weather Systems' },
    { id: 'geo-p10', hi: 'वायुमंडल में जल', en: 'Water in the Atmosphere' },
    { id: 'geo-p11', hi: 'विश्व जलवायु व जलवायु परिवर्तन', en: 'World Climate & Change' },
    { id: 'geo-p12', hi: 'महासागरीय जल', en: 'Water (Oceans)' },
    { id: 'geo-p13', hi: 'महासागरीय जल संचलन 📅 नवंबर', en: 'Movements of Ocean Water 📅 Nov' },
    { id: 'geo-p14', hi: 'जैव विविधता एवं संरक्षण 📅 नवंबर', en: 'Biodiversity & Conservation 📅 Nov' },
    { id: 'geo-i1', hi: 'भारत: स्थिति ⭐4 अंक', en: 'India: Location ⭐4' },
    { id: 'geo-i2', hi: 'संरचना व भू-आकृति विज्ञान ⭐8 अंक', en: 'Structure & Physiography ⭐8' },
    { id: 'geo-i3', hi: 'अपवाह तंत्र 📅 दिसंबर', en: 'Drainage System 📅 Dec' },
    { id: 'geo-i4', hi: 'भारत: जलवायु', en: 'India: Climate' },
    { id: 'geo-i5', hi: 'प्राकृतिक वनस्पति', en: 'Natural Vegetation' },
    { id: 'geo-i6', hi: 'प्राकृतिक संकट एवं आपदाएँ', en: 'Natural Hazards & Disasters' },
  ],
}

export default function Progress({ go }) {
  const { t, lang, progress, setProgress } = useStore()
  const [subject, setSubject] = useState('English 11th')
  const H = (hi, en) => (lang === 'hi' ? hi : en)
  const list = CHAPTERS[subject] || []
  const map = progress[subject] || {}
  const doneCount = list.filter(c => map[c.id] === 2).length

  // ---- 📈 Mock score trend (sb_mocklog direct read) ----
  const mockLog = (() => { try { return JSON.parse(localStorage.getItem('sb_mocklog') || '[]') } catch { return [] } })()
  const trend = mockLog.slice(0, 12)
  const avgPct = trend.length ? Math.round(trend.reduce((s, r) => s + (r.mcqPct || 0), 0) / trend.length) : null

  function cycle(chId) {
    setProgress(p => {
      const m = { ...(p[subject] || {}) }
      const cur = m[chId] || 0
      m[chId] = (cur + 1) % 3 // 0 बाकी → 1 पढ़ा → 2 दोहराया → 0 बाकी
      return { ...p, [subject]: m }
    })
  }

  const label = c => (subject.startsWith('English') ? c.en : lang === 'hi' ? c.hi : c.en)
  const badge = st => (st === 2 ? { icon: '✅', txt: t('prog.revised'), cls: 'ok' } : st === 1 ? { icon: '📖', txt: t('prog.read'), cls: '' } : { icon: '⬜', txt: t('prog.pending'), cls: 'muted' })

  return (
    <div className="page">
      <h1>📊 {t('nav.progress')}</h1>

      <div className="row wrap" style={{ gap: 8 }}>
        {Object.keys(CHAPTERS).map(s => {
          const pm = progress[s] || {}
          const ch = CHAPTERS[s]
          const d = ch.filter(c => pm[c.id] === 2).length
          const r = ch.filter(c => pm[c.id] === 1).length
          const p = ch.length - d - r
          return (
            <button key={s} className={'btn sum-chips' + (s === subject ? ' primary' : '')} onClick={() => setSubject(s)}>
              🗂 {s.replace(' 11th', '')} <span className="chips-mini">✅{d} 📖{r} ⬜{p}</span>
            </button>
          )
        })}
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>{t('prog.summary', { d: doneCount, n: list.length })} — {subject}</h3>
          <div className="row">
            <b className="prog-pct">{Math.round((doneCount / Math.max(1, list.length)) * 100)}%</b>
            <button className="btn small" onClick={() => go('notes')}>📝 {t('nav.notes')}</button>
          </div>
        </div>
        <div className="prog-bar">
          <div className="prog-bar-fill" style={{ width: Math.round((doneCount / Math.max(1, list.length)) * 100) + '%' }} />
        </div>
        <p className="muted">{t('prog.hint')}</p>

        <div className="prog-list">
          {list.map(c => {
            const b = badge(map[c.id] || 0)
            return (
              <button key={c.id} className={'prog-row' + (map[c.id] === 2 ? ' done' : '')} onClick={() => cycle(c.id)}>
                <span className="prog-badge">{b.icon}</span>
                <span className="prog-name">{label(c)}</span>
                <span className={'prog-status ' + b.cls}>{b.txt}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>📈 {H('Mock Score Trend', 'Mock Score Trend')}</h3>
          {avgPct !== null && <b className="prog-pct">{avgPct}% {H('औसत', 'avg')}</b>}
        </div>
        {trend.length === 0 ? (
          <p className="muted">
            💡 {H('Mock Test पेज पर पहला पेपर दो — यहाँ MCQ-% के bars से improvement साफ दिखेगा।', 'Take your first paper on Mock Test — bars here will show your MCQ-% progress.')}
          </p>
        ) : (
          <>
            <div className="trend">
              {trend.slice().reverse().map((r, i) => (
                <div className="trend-col" key={i} title={`${r.day} · ${r.subject.replace(' 11th', '')}${r.chapter === 'full' ? '' : ' · ' + r.chapter} · ${r.mcq}`}>
                  <b className="trend-val">{r.mcqPct}%</b>
                  <div className="trend-track">
                    <div className="trend-bar" style={{ height: Math.max(4, Math.min(100, r.mcqPct || 0)) + '%' }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 6 }}>
              {H('हर bar एक attempt (नया → बाएँ) · MCQ-%', 'Each bar = one attempt (newest → left) · MCQ-%')}
              {' · '}
              {mockLog.length > trend.length
                && H(`कुल ${mockLog.length} attempts, last 12 दिख रहे हैं`, `${mockLog.length} total attempts, showing last 12`)}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
