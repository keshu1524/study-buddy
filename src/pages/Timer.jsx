import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { todayStr, fmtClock } from '../utils'

const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 }
const SUBJ = ['English 11th', 'Pol. Science 11th', 'Geography 11th']
const ICONS = { 'English 11th': '🇬🇧', 'Pol. Science 11th': '🏛', 'Geography 11th': '🌍' }

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[880, 1100].forEach((f, i) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.35)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 0.3)
      o.start(ctx.currentTime + i * 0.35)
      o.stop(ctx.currentTime + i * 0.35 + 0.32)
    })
  } catch { /* silent */ }
}

export default function Timer() {
  const { t, lang, stats, registerFocus } = useStore()
  const [mode, setMode] = useState('focus')
  const [left, setLeft] = useState(MODES.focus)
  const [running, setRunning] = useState(false)
  const [justDone, setJustDone] = useState(false)
  // Time-split chart: किस विषय का focus सेशन है — यहाँ चुनो
  const [subj, setSubj] = useState(() => { try { return localStorage.getItem('sb_timersubj') || 'Pol. Science 11th' } catch { return 'Pol. Science 11th' } })
  const total = MODES[mode]

  useEffect(() => {
    if (!running) return
    const iv = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000)
    return () => clearInterval(iv)
  }, [running])

  useEffect(() => {
    if (!running || left !== 0) return
    setRunning(false)
    setJustDone(true)
    beep()
    if (mode === 'focus') registerFocus(MODES.focus / 60, subj)
  }, [left, running, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  function switchMode(m) {
    setMode(m)
    setLeft(MODES[m])
    setRunning(false)
    setJustDone(false)
  }
  function pickSubj(s) {
    setSubj(s)
    try { localStorage.setItem('sb_timersubj', s) } catch { /* ignore */ }
  }
  function reset() {
    setLeft(MODES[mode])
    setRunning(false)
    setJustDone(false)
  }

  const progress = 1 - left / total
  const today = todayStr()
  const sessions = (stats.sessions || []).filter(s => s.day === today)
  const R = 120
  const C = 2 * Math.PI * R

  return (
    <div className="page">
      <h1>⏱️ {t('nav.timer')}</h1>

      <div className="panel timer-panel">
        <div className="mode-row">
          {['focus', 'short', 'long'].map(m => (
            <button key={m} className={'btn' + (mode === m ? ' primary' : '')} onClick={() => switchMode(m)}>
              {t('timer.' + m)}
            </button>
          ))}
        </div>

        <div className="row" style={{ marginTop: 12, gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="muted">📚 {lang === 'hi' ? 'किस विषय का फोकस?' : 'Which subject?'}</span>
          {SUBJ.map(s => (
            <button key={s} className={'btn small' + (subj === s ? ' primary' : '')} onClick={() => pickSubj(s)}>
              {ICONS[s]} {s.replace(' 11th', '')}
            </button>
          ))}
        </div>

        <div className="timer-ring">
          <svg viewBox="0 0 280 280" width="280" height="280">
            <circle cx="140" cy="140" r={R} className="ring-bg" />
            <circle cx="140" cy="140" r={R} className="ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
          </svg>
          <div className="timer-clock">{fmtClock(left)}</div>
        </div>

        <div className="row center">
          {!running ? (
            <button className="btn primary big" onClick={() => { setJustDone(false); setRunning(true) }}>
              {left < total ? t('timer.resume') : t('timer.start')}
            </button>
          ) : (
            <button className="btn big" onClick={() => setRunning(false)}>{t('timer.pause')}</button>
          )}
          <button className="btn big" onClick={reset}>{t('timer.reset')}</button>
        </div>

        {justDone && <p className="success-msg">{t('timer.done')}</p>}
        <p className="muted">{t('timer.streakTip')}</p>
      </div>

      <div className="panel">
        <h3>{t('timer.todaySessions')}</h3>
        {sessions.length === 0 ? (
          <p className="muted">{t('timer.noSessions')}</p>
        ) : (
          <div className="session-list">
            {sessions.map((s, i) => <span key={i} className="chip">🍅 {s.min} {t('dash.minutesUnit')}{s.subj ? ' · ' + (ICONS[s.subj] || '') + s.subj.replace(' 11th', '') : ''}</span>)}
          </div>
        )}
      </div>
    </div>
  )
}
