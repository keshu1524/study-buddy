import { useState } from 'react'
import { useStore } from '../store'
import { uid, todayStr, dateStr } from '../utils'

// Leitner boxes: box move up → agla revise 1/3/7/21 din baad
const SRS_INT = [1, 3, 7, 21, 30]

function addDays(ds, n) {
  const d = new Date(ds + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return dateStr(d)
}

export default function Flashcards() {
  const { t, lang, cards, setCards, subjects: subjectList, addSubject, cardSched, setCardSched } = useStore()
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [subject, setSubject] = useState('')
  const [deckSubject, setDeckSubject] = useState('all')
  const [session, setSession] = useState(null) // {deck, pos, flipped, known, repeat, done}

  const subjects = [...new Set(cards.map(c => c.subject).filter(Boolean))]
  const deck = cards.filter(c => deckSubject === 'all' || c.subject === deckSubject)

  function add() {
    if (!front.trim() || !back.trim()) return
    const subj = subject.trim() || t('cards.defaultSubject')
    addSubject(subj)
    setCards(cs => [{ id: uid(), subject: subj, front: front.trim(), back: back.trim() }, ...cs])
    setFront('')
    setBack('')
  }

  function start() {
    if (deck.length === 0) return
    setSession({ deck: [...deck].sort(() => Math.random() - 0.5), pos: 0, flipped: false, known: 0, repeat: 0, done: false })
  }

  const today = todayStr()
  // due = card jo kabhi schedule nahi hua ya jiska next date aayi
  const isDue = c => !cardSched[c.id] || cardSched[c.id].next <= today
  const dueIds = deck.filter(isDue)
  function startDue() {
    const due = [...deck].filter(isDue)
    if (due.length === 0) return
    setSession({ deck: due.sort(() => Math.random() - 0.5), pos: 0, flipped: false, known: 0, repeat: 0, done: false })
  }

  function grade(g) {
    // SRS schedule update: 👍 box up, 🔁 box 0
    const c = session.deck[session.pos]
    if (c.id) {
      setCardSched(s => {
        const cur = s[c.id] || { box: 0, next: today }
        const next = g === 'known'
          ? { box: Math.min(SRS_INT.length - 1, cur.box + 1), next: addDays(today, SRS_INT[Math.min(SRS_INT.length - 1, cur.box + 1)]) }
          : { box: 0, next: addDays(today, 1) }
        return { ...s, [c.id]: next }
      })
    }
    setSession(s => ({
      ...s,
      pos: s.pos + 1,
      flipped: false,
      known: s.known + (g === 'known' ? 1 : 0),
      repeat: s.repeat + (g === 'repeat' ? 1 : 0),
      done: s.pos + 1 >= s.deck.length,
    }))
  }

  function del(id) {
    setCards(cs => cs.filter(c => c.id !== id))
  }

  return (
    <div className="page">
      <h1>🃏 {t('nav.cards')}</h1>

      {session ? (
        session.done ? (
          <div className="panel center">
            <h2>🎉 {t('cards.sessionDone', { k: session.known, r: session.repeat })}</h2>
            <div className="row center">
              <button className="btn primary" onClick={start}>{t('cards.restart')}</button>
              <button className="btn" onClick={() => setSession(null)}>{t('cards.back')}</button>
            </div>
          </div>
        ) : (
          <div className="panel flash-study">
            <div className="muted">{session.pos + 1} / {session.deck.length}</div>
            <div className={'flash-card' + (session.flipped ? ' flipped' : '')} onClick={() => setSession(s => ({ ...s, flipped: !s.flipped }))}>
              {session.flipped ? session.deck[session.pos].back : session.deck[session.pos].front}
            </div>
            {session.flipped ? (
              <div className="row center">
                <button className="btn good" onClick={() => grade('known')}>👍 {t('cards.known')}</button>
                <button className="btn warn" onClick={() => grade('repeat')}>🔁 {t('cards.repeat')}</button>
              </div>
            ) : (
              <button className="btn primary" onClick={() => setSession(s => ({ ...s, flipped: true }))}>{t('cards.flip')}</button>
            )}
          </div>
        )
      ) : (
        <>
          <div className="panel">
            <h3>➕ {t('cards.new')}</h3>
            <input
              className="input"
              list="sb-card-subjects"
              placeholder={t('cards.subject')}
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
            <datalist id="sb-card-subjects">
              {subjectList.map(s => <option key={s} value={s} />)}
            </datalist>
            <input className="input" placeholder={t('cards.front')} value={front} onChange={e => setFront(e.target.value)} />
            <input className="input" placeholder={t('cards.back')} value={back} onChange={e => setBack(e.target.value)} />
            <button className="btn primary" onClick={add}>{t('cards.add')}</button>
          </div>

          <div className="panel">
            <h3>▶ {t('cards.study')}</h3>
            <div className="row">
              <select className="input grow" value={deckSubject} onChange={e => setDeckSubject(e.target.value)}>
                <option value="all">{t('cards.allSubjects')}</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn primary" disabled={deck.length === 0} onClick={start}>{t('cards.start')} ({deck.length})</button>
            </div>
            <div className="row" style={{ marginTop: 8 }}>
              <button className="btn good" disabled={dueIds.length === 0} onClick={startDue}>
                🔄 {lang === 'hi' ? 'आज के due cards' : 'Due today'} ({dueIds.length})
              </button>
              <span className="muted" style={{ alignSelf: 'center' }}>
                {dueIds.length > 0
                  ? (lang === 'hi' ? 'सिर्फ आज वाले cards — 👍/🔁 दबाने से 1/3/7/21 दिन का schedule बनता है' : 'Only today\u2019s cards — 👍/🔁 builds the 1/3/7/21-day schedule')
                  : (lang === 'hi' ? 'आज का revision पूरा ✅' : 'All caught up ✅')}
              </span>
            </div>
          </div>

          <div className="panel">
            <h3>🗂 {t('nav.cards')} ({cards.length})</h3>
            {cards.length === 0 ? (
              <p className="muted">{t('cards.noCards')}</p>
            ) : (
              cards.map(c => (
                <div className="q-item" key={c.id}>
                  <div>
                    <b>{c.front}</b>
                    <div className="muted">→ {c.back} · {c.subject}{cardSched[c.id] ? (lang === 'hi' ? ' · 📦 box ' : ' · box ') + (cardSched[c.id].box + 1) + ' · next ' + cardSched[c.id].next : ''}</div>
                  </div>
                  <button className="btn danger small" onClick={() => del(c.id)}>🗑</button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
