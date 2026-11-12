import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { todayStr, dateStr } from '../utils'
import { CHAPTERS } from './Progress'

// Spaced revision: ✅ के बाद 1 → 3 → 7 → 21 दिन पर रिवीज़न
const REVS = [1, 3, 7, 21]

function addDays(ds, n) {
  const d = new Date(ds + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return dateStr(d)
}

export default function Dashboard({ go }) {
  const { t, lang, notes, cards, plans, stats, quizzes, progress, reviews, setReviews, mistakes, setMistakes, examdate, setExamdate, mission, setMission, qna } = useStore()
  const [showMistakes, setShowMistakes] = useState(false)
  const [ansOpen, setAnsOpen] = useState(false)
  const fileRef = useRef(null)

  // Backup: sab sb_* data ek JSON file me download
  function exportData() {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('sb_')) data[k] = localStorage.getItem(k)
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'study-buddy-backup-' + todayStr() + '.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  // Restore: JSON file se sab data wapas
  function onImport(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        Object.keys(data).forEach(k => { if (k.startsWith('sb_')) localStorage.setItem(k, data[k]) })
        location.reload()
      } catch {
        alert('Invalid backup file!')
      }
    }
    reader.readAsText(f)
  }

  const today = todayStr()
  const mins = stats.focus[today] || 0
  const upcoming = plans
    .filter(p => p.examDate >= today)
    .sort((a, b) => a.examDate.localeCompare(b.examDate))[0]
  const left = upcoming
    ? Math.ceil((new Date(upcoming.examDate + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000)
    : null

  // ---- ⏳ Board exam countdown (editable date) ----
  const examLeft = Math.max(0, Math.round((new Date(examdate + 'T00:00:00') - new Date(today + 'T00:00:00')) / 86400000))
  const subjPct = Object.keys(CHAPTERS).map(s => {
    const pm = progress[s] || {}
    const list = CHAPTERS[s]
    const done = list.filter(c => pm[c.id] === 2).length
    return { s, pct: Math.round(done / list.length * 100), done, total: list.length }
  })

  // ---- ❓ Aaj ka sawal (date-hash se deterministic — din badne par naya) ----
  const hi = lang === 'hi'
  const qotd = (qna || []).length
    ? qna[Math.floor((new Date(today + 'T00:00:00') - new Date('2024-01-01T00:00:00')) / 86400000) % qna.length]
    : null
  const qotdCh = (() => {
    if (!qotd) return ''
    for (const s of Object.keys(CHAPTERS)) {
      const c = (CHAPTERS[s] || []).find(x => x.id === qotd.id)
      if (c) return s.startsWith('English') ? c.en : c.hi
    }
    return qotd.id
  })()

  // ---- 🏆 Uplabddhiyan (badges) — existing data se derived, koi naya storage nahi ----
  const mockLog = (() => { try { return JSON.parse(localStorage.getItem('sb_mocklog') || '[]') } catch { return [] } })()
  const qaLog = (() => { try { return JSON.parse(localStorage.getItem('sb_qnalog') || '[]') } catch { return [] } })()
  const focusDays = Object.keys(stats.focus || {}).length
  const totalFocusMin = Object.values(stats.focus || {}).reduce((a, b) => a + b, 0)
  const bestPct = Math.max(0, ...subjPct.map(s => s.pct))
  const BADGES = [
    { i: '🌱', n: hi ? 'पहला फोकस सेशन' : 'First focus session', ok: (stats.sessions || []).length >= 1 },
    { i: '🔥', n: '3 ' + (hi ? 'दिन स्ट्रीक' : 'day streak'), ok: stats.streak >= 3 },
    { i: '⚡', n: '7 ' + (hi ? 'दिन स्ट्रीक' : 'day streak'), ok: stats.streak >= 7 },
    { i: '🏆', n: '14 ' + (hi ? 'दिन स्ट्रीक' : 'day streak'), ok: stats.streak >= 14 },
    { i: '👑', n: '30 ' + (hi ? 'दिन स्ट्रीक' : 'day streak'), ok: stats.streak >= 30 },
    { i: '📄', n: hi ? 'पहला mock दिया' : 'First mock done', ok: mockLog.length >= 1 },
    { i: '✍️', n: 'QnA ×5', ok: qaLog.length >= 5 },
    { i: '🧠', n: 'QnA ×20', ok: qaLog.length >= 20 },
    { i: '📖', n: hi ? '25% अध्याय ✅' : '25% chapters ✅', ok: bestPct >= 25 },
    { i: '🏅', n: hi ? '50% अध्याय ✅' : '50% chapters ✅', ok: bestPct >= 50 },
    { i: '🚀', n: hi ? '75% अध्याय ✅' : '75% chapters ✅', ok: bestPct >= 75 },
    { i: '👑', n: hi ? '100% अध्याय ✅' : '100% chapters ✅', ok: bestPct >= 100 },
    { i: '⏳', n: '180 ' + (hi ? ' मिनट फोकस' : ' min focus'), ok: totalFocusMin >= 180 },
    { i: '🎯', n: '7 ' + (hi ? 'पढ़ाई-दिन' : 'study days'), ok: focusDays >= 7 },
  ]

  // ---- 📈 Time-split (pichhle 7 din, subject-wise) ----
  const SB_SUBJ = ['English 11th', 'Pol. Science 11th', 'Geography 11th']
  const SB_ICONS = { 'English 11th': '🇬🇧', 'Pol. Science 11th': '🏛', 'Geography 11th': '🌍' }
  const DAYS7 = Array.from({ length: 7 }, (_, i) => dateStr(new Date(new Date(today + 'T00:00:00').getTime() - (6 - i) * 86400000)))
  const splitMap = {}
  DAYS7.forEach(d => { splitMap[d] = {} })
  ;(stats.sessions || []).forEach(s => {
    if (!s || !splitMap[s.day]) return
    if (!s.subj) return
    splitMap[s.day][s.subj] = (splitMap[s.day][s.subj] || 0) + (s.min || 0)
  })
  const totalBySubj = {}
  SB_SUBJ.forEach(s => { totalBySubj[s] = DAYS7.reduce((a, d) => a + (splitMap[d][s] || 0), 0) })
  const otherBySubj = {}
  DAYS7.forEach(d => Object.keys(splitMap[d]).forEach(k => { if (!SB_SUBJ.includes(k)) otherBySubj[k] = (otherBySubj[k] || 0) + splitMap[d][k] }))
  const splitList = SB_SUBJ.map(s => ({ k: (SB_ICONS[s] || '') + ' ' + s.replace(' 11th', ''), min: totalBySubj[s] }))
    .concat(Object.keys(otherBySubj).map(k => ({ k, min: otherBySubj[k] })))
    .filter(r => r.min > 0)
  const maxMin = Math.max(0, ...splitList.map(r => r.min))
  const dayTotals = {}
  DAYS7.forEach(d => { dayTotals[d] = Object.values(splitMap[d]).reduce((a, b) => a + b, 0) })

  // ---- 🔁 Daily revision (spaced 1/3/7/21) ----
  // नए ✅ chapters अपने-आप seed हो जाते हैं
  useEffect(() => {
    setReviews(prev => {
      const next = { ...prev }
      let changed = false
      Object.keys(CHAPTERS).forEach(sub => {
        const pm = progress[sub] || {}
        CHAPTERS[sub].forEach(c => {
          if (pm[c.id] === 2 && !next[c.id]) {
            next[c.id] = { stage: 0, when: todayStr() }
            changed = true
          }
        })
      })
      return changed ? next : prev
    })
  }, [progress])

  const revAll = []
  Object.keys(CHAPTERS).forEach(sub => {
    const pm = progress[sub] || {}
    CHAPTERS[sub].forEach(c => {
      if (pm[c.id] === 2) {
        const r = reviews[c.id] || { stage: 0, when: todayStr() }
        revAll.push({
          id: c.id,
          title: sub.startsWith('English') ? c.en : c.hi,
          stage: r.stage, when: r.when,
        })
      }
    })
  })
  const due = revAll.filter(x => today >= addDays(x.when, REVS[Math.min(x.stage, REVS.length - 1)]))
  function markRevised(id) {
    setReviews(p => {
      const r = p[id] || { stage: 0, when: todayStr() }
      return { ...p, [id]: { stage: Math.min(REVS.length, r.stage + 1), when: todayStr() } }
    })
  }

  // ---- 🎯 Aaj ka Mission ----
  // din badalne par mission reset — [mission?.day] dep isliye taki disk-restore
  // (purana din wala) load hone ke baad bhi reset dobara chale
  useEffect(() => {
    setMission(m => (!m || m.day !== today) ? { day: today, done: {} } : m)
  }, [today, mission && mission.day])
  const mDone = mission && mission.day === today ? mission.done : {}
  const revDone = revAll.length > 0 && due.length === 0
  const mockDone = (() => { try { return JSON.parse(localStorage.getItem('sb_mocklog') || '[]').some(r => r.day === today) } catch { return false } })()
  // aaj ka chapter — November focus list se pehla jo abhi ✅ nahi
  const FOCUS = ['eng-p5', 'pol-b7', 'pol-b8', 'geo-p13', 'geo-p14']
  const dChapter = FOCUS.map(id => {
    for (const s of Object.keys(CHAPTERS)) {
      const c = (CHAPTERS[s] || []).find(x => x.id === id)
      if (c) return { ...c, subject: s }
    }
    return null
  }).find(c => c && ((progress[c.subject] || {})[c.id] || 0) !== 2) || null
  const chapDone = !dChapter || mDone.chap === dChapter.id || ((progress[dChapter.subject] || {})[dChapter.id] || 0) === 2
  function tickChapter() {
    if (!dChapter) return
    setMission(m => ({ day: today, done: { ...(m && m.day === today ? m.done : {}), chap: mDone.chap === dChapter.id ? undefined : dChapter.id } }))
  }

  return (
    <div className="page">
      <h1>{t('dash.greeting')}</h1>

      <div className="stat-grid">
        <div className="panel stat">🔥 <b>{stats.streak}</b><span>{t('dash.streakDays', { n: stats.streak })}</span></div>
        <div className="panel stat">⏱️ <b>{mins}</b><span>{t('dash.minutes')}</span></div>
        <div className="panel stat">📝 <b>{notes.length}</b><span>{t('dash.notes')}</span></div>
        <div className="panel stat">🃏 <b>{cards.length}</b><span>{t('dash.cards')}</span></div>
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>❓ {hi ? 'आज का सवाल' : 'Today\u2019s question'}</h3>
          {qotd && <span className="muted">{qotdCh}</span>}
        </div>
        {qotd ? (
          <>
            <p className="q-q" style={{ marginTop: 0 }}>{qotd.q}</p>
            {ansOpen && (
              <ol className="mm-pts" style={{ marginTop: 8 }}>
                {qotd.points.map((p, i) => <li key={i}>{p}</li>)}
              </ol>
            )}
            <div className="row" style={{ marginTop: 10, gap: 10, flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => setAnsOpen(o => !o)}>{ansOpen ? '🙈 ' + (hi ? 'उत्तर छिपाओ' : 'Hide answer') : '👁 ' + (hi ? 'उत्तर दिखाओ' : 'Show answer')}</button>
              <button className="btn primary" onClick={() => go('qna')}>✍️ {hi ? 'अभ्यास — Q&A' : 'Practice — Q&A'}</button>
            </div>
          </>
        ) : (
          <p className="muted">{hi ? 'Q&A data load होने का इंतज़ार…' : 'Waiting for Q&A data…'}</p>
        )}
      </div>

      <div className="panel mission-panel">
        <div className="page-head">
          <h3>🎯 {lang === 'hi' ? 'Aaj ka Mission' : 'Today\u2019s Mission'}</h3>
          <span className="muted">{today}</span>
        </div>
        <div className="mission-row">
          <span className={'mission-tick' + (revDone ? ' ok' : '')}>{revDone ? '✅' : '⬜'}</span>
          <div className="grow">
            <b>🔁 {lang === 'hi' ? 'Spaced revision' : 'Spaced revision'}</b>
            <div className="muted">
              {revAll.length === 0
                ? (lang === 'hi' ? 'Pehle Progress Tracker mein koi chapter ✅ karo' : 'First mark a chapter ✅ in Progress Tracker')
                : revDone
                  ? (lang === 'hi' ? 'Aaj ke saare due revise ✅' : 'All due revised ✅')
                  : (lang === 'hi' ? `${due.length} chapter due — neeche ✓ revise dabao` : `${due.length} due — tap ✓ revise below`)}
            </div>
          </div>
        </div>
        <div className="mission-row">
          <span className={'mission-tick' + (chapDone ? ' ok' : '')}>{chapDone ? '✅' : '⬜'}</span>
          <div className="grow">
            <b>📖 {lang === 'hi' ? 'Aaj ka chapter' : 'Today\u2019s chapter'}</b>
            <div className="muted">
              {dChapter
                ? (dChapter.subject.startsWith('English') ? dChapter.en : dChapter.hi) + ' · ' + dChapter.subject.replace(' 11th', '')
                : (lang === 'hi' ? 'November focus list complete 🎉' : 'November focus list complete 🎉')}
            </div>
          </div>
          {dChapter && !chapDone && (
            <div className="row">
              <button className="btn small primary" onClick={tickChapter}>{lang === 'hi' ? '✓ ho gaya' : '✓ done'}</button>
              <button className="btn small" onClick={() => go('progress')}>{lang === 'hi' ? 'padho' : 'study'}</button>
            </div>
          )}
        </div>
        <div className="mission-row">
          <span className={'mission-tick' + (mockDone ? ' ok' : '')}>{mockDone ? '✅' : '⬜'}</span>
          <div className="grow">
            <b>📄 {lang === 'hi' ? '1 mock / chapter test' : '1 mock / chapter test'}</b>
            <div className="muted">{mockDone ? (lang === 'hi' ? 'Aaj ka mock diya ✅' : 'Today\u2019s mock done ✅') : (lang === 'hi' ? 'Aaj ka mock baaki hai' : 'Today\u2019s mock is pending')}</div>
          </div>
          {!mockDone && <button className="btn small primary" onClick={() => go('mock')}>{lang === 'hi' ? '📄 mock do' : '📄 take mock'}</button>}
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          💡 {lang === 'hi' ? '3/3 ✅ = aaj ka target complete!' : '3/3 ✅ = today\u2019s target done!'}
        </p>
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>🏆 {hi ? 'उपलब्धियाँ' : 'Achievements'} ({BADGES.filter(b => b.ok).length}/{BADGES.length})</h3>
        </div>
        <div className="row wrap" style={{ gap: 8 }}>
          {BADGES.map((b, i) => (
            <span key={i} className="chip" style={{ opacity: b.ok ? 1 : 0.4 }} title={b.ok ? (hi ? 'प्राप्त!' : 'Earned!') : (hi ? 'अभी बाकी' : 'Locked')}>
              {b.i} {b.n}{b.ok ? ' ✓' : ''}
            </span>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>⏳ Board exam countdown</h3>
          <label className="exam-date">
            📅 <input type="date" value={examdate} onChange={e => e.target.value && setExamdate(e.target.value)} />
          </label>
        </div>
        <div className="exam-count">{examLeft} <span>{lang === 'hi' ? 'दिन बाकी' : 'days left'}</span></div>
        <div className="exam-bars">
          {subjPct.map(s => (
            <div className="exam-bar" key={s.s}>
              <span className="muted exam-bar-name">{s.s}</span>
              <span className="mm-prog-bar grow"><span style={{ width: s.pct + '%' }} /></span>
              <b className="exam-bar-pct">{s.pct}%</b>
            </div>
          ))}
        </div>
        <p className="muted" style={{ marginTop: 8 }}>{t('dash.nextExam')}: {upcoming ? `${upcoming.name} · ${upcoming.examDate} · ${t('dash.daysLeft', { n: left })}` : '—'}</p>
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>📈 {hi ? 'पिछले 7 दिन — विषय-वार फोकस' : 'Last 7 days — focus by subject'}</h3>
        </div>
        {maxMin === 0 ? (
          <p className="muted">{hi ? 'अभी विषय-वार रिकॉर्ड नहीं — फोकस टाइमर चलाओ और विषय चुनो! 🍅' : 'No by-subject record yet — run a focus timer and pick a subject! 🍅'}</p>
        ) : (
          <>
            <div className="exam-bars">
              {splitList.map(r => (
                <div className="exam-bar" key={r.k}>
                  <span className="muted exam-bar-name">{r.k}</span>
                  <span className="mm-prog-bar grow"><span style={{ width: Math.round(r.min / maxMin * 100) + '%' }} /></span>
                  <b className="exam-bar-pct">{r.min}m</b>
                </div>
              ))}
            </div>
            <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
              {DAYS7.map(d => (
                <span key={d} className="chip" style={{ opacity: d === today ? 1 : 0.7 }}>{d.slice(5)} · {dayTotals[d] || 0}m</span>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 8 }}>{hi ? 'पुराने सेशन (बिना-विषय) इस chart में नहीं — नया focus सेशन चुने विषय के साथ गिना जाएगा ⏱️।' : 'Old sessions (no subject) aren\u2019t counted here — new focus sessions will be logged with their subject ⏱️.'}</p>
          </>
        )}
      </div>

      <div className="panel">
        <h3>🔁 आज का revision ({due.length} due)</h3>
        {revAll.length === 0 ? (
          <p className="muted">Progress Tracker में chapter ✅ करो — 1/3/7/21 दिन का revise plan यहाँ खुद बनेगा।</p>
        ) : due.length === 0 ? (
          <p className="muted">खाली ✅ अभी कुछ due नहीं — next: {revAll.sort((a, b) => a.when.localeCompare(b.when))[0].when} के बाद।</p>
        ) : (
          <div className="rev-list">
            {due.map(x => (
              <div className="rev-row" key={x.id}>
                <span className="rev-name">{x.title} <span className="muted">(stage {x.stage + 1}{REVS[x.stage] ? ' · +' + REVS[x.stage] + ' दिन' : ' · ✅ मज़बूत'})</span></span>
                <button className="btn small primary" onClick={() => markRevised(x.id)}>{x.stage >= REVS.length ? '🏆' : '✓ revise'}</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <div className="page-head">
          <h3>❌ गलती notebook ({mistakes.length})</h3>
          <div className="row">
            {mistakes.length > 0 && <button className="btn small danger" onClick={() => { if (confirm('सारी गलतियाँ मिटा दें?')) setMistakes([]) }}>🧹 सब साफ़</button>}
            {mistakes.length > 5 && <button className="btn small" onClick={() => setShowMistakes(s => !s)}>{showMistakes ? 'छोटा करो' : 'सब देखो'}</button>}
          </div>
        </div>
        {mistakes.length === 0 ? (
          <p className="muted">Quiz खेलो — जो उत्तर गलत होंगे वो यहाँ exam-sweat-sheet बनकर जमा होंगे।</p>
        ) : (
          <>
            <div className="mist-list">
              {mistakes.slice(0, showMistakes ? mistakes.length : 5).map(m => (
                <div className="mist-row" key={m.key}>
                  <div>
                    <b>{m.q}</b>
                    <div className="muted">✔ {m.correct} · ✗ {m.chosen || '—'} · {m.quiz} · {m.day}</div>
                  </div>
                  <button className="btn small danger" onClick={() => setMistakes(ms => ms.filter(x => x.key !== m.key))}>🗑</button>
                </div>
              ))}
            </div>
            <p className="muted" style={{ marginTop: 8 }}>💡 Board से पहले सिर्फ इन्हीं rows का री-रिवीज़न — time बचेगा।</p>
          </>
        )}
      </div>

      <div className="panel">
        <h3>{t('dash.quick')}</h3>
        <div className="row wrap">
          <button className="btn primary" onClick={() => go('timer')}>⏱️ {t('nav.timer')}</button>
          <button className="btn" onClick={() => go('notes')}>📝 {t('nav.notes')}</button>
          <button className="btn" onClick={() => go('quiz')}>🧠 {t('nav.quiz')}</button>
          <button className="btn" onClick={() => go('planner')}>📅 {t('nav.planner')}</button>
          <button className="btn" onClick={() => go('progress')}>📊 {t('nav.progress')}</button>
        </div>
        <p className="muted" style={{ marginTop: 10 }}>{t('dash.tip')}</p>
      </div>

      <div className="panel">
        <h3>{t('dash.backup')}</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          {t('dash.fileSync', { n: notes.length, c: cards.length, q: quizzes ? quizzes.length : 0 })}
        </p>
        <div className="row wrap">
          <button className="btn" onClick={exportData}>{t('dash.export')}</button>
          <button className="btn" onClick={() => fileRef.current && fileRef.current.click()}>{t('dash.import')}</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={onImport}
          />
        </div>
        <p className="muted" style={{ marginTop: 10 }}>{t('dash.backupHint')}</p>
      </div>
    </div>
  )
}
