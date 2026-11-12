// Central data store: browser localStorage + language + streak stats.
// Sab data user ke apne browser me hi save hota hai (koi server nahi).
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { makeT } from './i18n'
import { seeds } from './seeds'
import { dateStr, todayStr } from './utils'
// 💾 बंद पकेट default data (network के बिना ही साथ) — phone/स newly-visited पर instant सामान
import DEF from './default-data.json'

// खाली ना हो तो device data, खाली/missing तो bundled default लौट दो
function loadOrDef(key, defKey) {
  try {
    const raw = localStorage.getItem('sb_' + key)
    const v = raw ? JSON.parse(raw) : undefined
    if (v && Array.isArray(v) && v.length) return v
  } catch {}
  return DEF[defKey] || []
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem('sb_' + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const Ctx = createContext(null)
export function useStore() {
  return useContext(Ctx)
}

export function StoreProvider({ children }) {
  // Browser me pehle se data hai ya nahi? (capture BEFORE effects likhte hain)
  // storage बंद हो तो भी app ना मरे
  const hadStorage = useRef(
    (() => { try { return Object.keys(localStorage).some(k => k.startsWith('sb_') && k !== 'sb_lang') } catch { return false } })()
  )
  // Pehli baar disk-check poora hone tak koi bhi sync disk me na likhe
  const restoreDone = useRef(false)

  const [lang, setLang] = useState(() => load('lang', 'hi'))
  // पहले seeds → अब bundled defaults उपयोग; लेकिन device data सबसे ऊपर
  const [notes, setNotes] = useState(() => loadOrDef('notes', 'notes'))
  const [quizzes, setQuizzes] = useState(() => loadOrDef('quizzes', 'quizzes'))
  const [cards, setCards] = useState(() => loadOrDef('cards', 'cards'))
  const [subjects, setSubjects] = useState(() => loadOrDef('subjects', 'subjects'))
  const [plans, setPlans] = useState(() => load('plans', []))
  const [mindmaps, setMindmaps] = useState(() => loadOrDef('mindmaps', 'mindmaps'))
  const [mmRevise, setMMRevise] = useState(() => load('mmrevise', {}))
  const [qna, setQna] = useState(() => loadOrDef('qna', 'qna'))
  // 📘 Long Answer Bank: topic-wise full board-style long answers
  const [longs, setLongs] = useState(() => loadOrDef('longs', 'longs'))
  // 🌏 Naksha abhyas: board Q26-style India map tasks
  const [maps, setMaps] = useState(() => loadOrDef('maps', 'maps'))
  const [reviews, setReviews] = useState(() => load('reviews', {}))
  const [mistakes, setMistakes] = useState(() => load('mistakes', []))
  const [examdate, setExamdate] = useState(() => load('examdate', '2027-03-15'))
  const [progress, setProgress] = useState(() => load('progress', {}))
  const [stats, setStats] = useState(() => load('stats', { streak: 0, lastDay: null, focus: {}, sessions: [] }))
  // 🃏 Flashcard SRS (Leitner boxes): {cardId: {box: 0..4, next: 'YYYY-MM-DD'}}
  const [cardSched, setCardSched] = useState(() => load('cardsched', {}))
  // 🎯 Aaj ka Mission: {day: 'YYYY-MM-DD', done: {rev, chap, mock}}
  const [mission, setMission] = useState(() => load('mission', null))
  const [synced, setSynced] = useState(false)

  // ---- Disk sync helper ----
  function syncNow() {
    const payload = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('sb_')) payload[k] = localStorage.getItem(k)
    }
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => { if (r.ok) setSynced(true) }).catch(() => {})
  }
  let syncTimer = null
  function queueSync() {
    if (!restoreDone.current) return
    clearTimeout(syncTimer)
    syncTimer = setTimeout(syncNow, 800)
  }

  // App start par disk file se data wapas laao (agar browser storage fresh hai)
  useEffect(() => {
    let timer = null
    fetch('/api/data')
      .then(r => r.ok ? r.json() : {})
      .then(data => {
        try {
          const keys = Object.keys(data || {}).filter(k => k.startsWith('sb_'))
          if (!hadStorage.current && keys.length) {
            // Fresh browser — disk file se sab rc restore karo
            Object.keys(data).forEach(k => { if (k.startsWith('sb_')) try { localStorage.setItem(k, data[k]) } catch {} })
            if (data.sb_lang) { try { const v = JSON.parse(data.sb_lang); if (v) setLang(v) } catch {} }
            if (data.sb_notes) { try { const v = JSON.parse(data.sb_notes); if (v) setNotes(v) } catch {} }
            if (data.sb_quizzes) { try { const v = JSON.parse(data.sb_quizzes); if (v) setQuizzes(v) } catch {} }
            if (data.sb_cards) { try { const v = JSON.parse(data.sb_cards); if (v) setCards(v) } catch {} }
            if (data.sb_subjects) { try { const v = JSON.parse(data.sb_subjects); if (v) setSubjects(v) } catch {} }
            if (data.sb_plans) { try { const v = JSON.parse(data.sb_plans); if (v) setPlans(v) } catch {} }
            if (data.sb_mindmaps) { try { const v = JSON.parse(data.sb_mindmaps); if (v) setMindmaps(v) } catch {} }
            if (data.sb_mmrevise) { try { const v = JSON.parse(data.sb_mmrevise); if (v) setMMRevise(v) } catch {} }
            if (data.sb_qna) { try { const v = JSON.parse(data.sb_qna); if (v) setQna(v) } catch {} }
            if (data.sb_longs) { try { const v = JSON.parse(data.sb_longs); if (v) setLongs(v) } catch {} }
            if (data.sb_maps) { try { const v = JSON.parse(data.sb_maps); if (v) setMaps(v) } catch {} }
            if (data.sb_reviews) { try { const v = JSON.parse(data.sb_reviews); if (v) setReviews(v) } catch {} }
            if (data.sb_mistakes) { try { const v = JSON.parse(data.sb_mistakes); if (v) setMistakes(v) } catch {} }
            if (data.sb_examdate) { try { const v = JSON.parse(data.sb_examdate); if (v) setExamdate(v) } catch {} }
            if (data.sb_progress) { try { const v = JSON.parse(data.sb_progress); if (v) setProgress(v) } catch {} }
            if (data.sb_stats) { try { const v = JSON.parse(data.sb_stats); if (v) setStats(v) } catch {} }
            if (data.sb_cardsched) { try { const v = JSON.parse(data.sb_cardsched); if (v) setCardSched(v) } catch {} }
            if (data.sb_mission) { try { const v = JSON.parse(data.sb_mission); if (v) setMission(v) } catch {} }
          }
          // ☁️ self-heal (dev और hosted दोनों) — लेकिन अब **बिना network**: bundled defaults
          // जो content-keys missing या EMPTY रह गईं उन्हें भर दो; non-empty device-data नहीं छेड़ेंगे
          try {
            const fillMap = [
              { key: 'sb_longs', setF: setLongs, arr: DEF.longs },
              { key: 'sb_qna', setF: setQna, arr: DEF.qna },
              { key: 'sb_maps', setF: setMaps, arr: DEF.maps },
              { key: 'sb_subjects', setF: setSubjects, arr: DEF.subjects },
              { key: 'sb_cards', setF: setCards, arr: DEF.cards },
              { key: 'sb_notes', setF: setNotes, arr: DEF.notes },
              { key: 'sb_quizzes', setF: setQuizzes, arr: DEF.quizzes },
              { key: 'sb_mindmaps', setF: setMindmaps, arr: DEF.mindmaps },
            ]
            for (const { key, setF, arr } of fillMap) {
              if (!arr || !arr.length) continue
              try {
                let cur = []
                try { cur = JSON.parse(localStorage.getItem(key) || '[]') || [] }
                catch { cur = [] }
                if (cur.length) continue
                localStorage.setItem(key, JSON.stringify(arr))
                setF(arr)
              } catch {}
            }
          } catch {}
        } catch {}
        restoreDone.current = true
        // Pehli dafa: disk file empty hai (ya thoda der pehle) to current data save karo
        timer = setTimeout(syncNow, 1200)
      })
      .catch(() => { restoreDone.current = true })
    return () => { if (timer) clearTimeout(timer) }
  }, [])

  // Har change par localStorage me save (surakshit — private-mode/quota fail पर bhi app ना मरे) + disk me sync
  function save(key, val) {
    try { localStorage.setItem('sb_' + key, JSON.stringify(val)) } catch (e) {}
  }
  useEffect(() => { save('lang', lang); queueSync() }, [lang])
  useEffect(() => { save('notes', notes); queueSync() }, [notes])
  useEffect(() => { save('quizzes', quizzes); queueSync() }, [quizzes])
  useEffect(() => { save('cards', cards); queueSync() }, [cards])
  useEffect(() => { save('subjects', subjects); queueSync() }, [subjects])
  useEffect(() => { save('plans', plans); queueSync() }, [plans])
  useEffect(() => { save('mindmaps', mindmaps); queueSync() }, [mindmaps])
  useEffect(() => { save('mmrevise', mmRevise); queueSync() }, [mmRevise])
  useEffect(() => { save('qna', qna); queueSync() }, [qna])
  useEffect(() => { save('longs', longs); queueSync() }, [longs])
  useEffect(() => { save('maps', maps); queueSync() }, [maps])
  useEffect(() => { save('reviews', reviews); queueSync() }, [reviews])
  useEffect(() => { save('mistakes', mistakes); queueSync() }, [mistakes])
  useEffect(() => { save('examdate', examdate); queueSync() }, [examdate])
  useEffect(() => { save('progress', progress); queueSync() }, [progress])
  useEffect(() => { save('stats', stats); queueSync() }, [stats])
  useEffect(() => { save('cardsched', cardSched); queueSync() }, [cardSched])
  useEffect(() => { save('mission', mission); queueSync() }, [mission])

  // Focus session complete hone par: minutes jama karo + streak update
  // subj (Time-split chart ke liye) — purane rows me subj nahi hai, wo theek chalte hain
  function registerFocus(minutes, subj) {
    setStats(s => {
      const day = todayStr()
      let streak = s.streak
      if (s.lastDay !== day) {
        const y = new Date()
        y.setDate(y.getDate() - 1)
        streak = s.lastDay === dateStr(y) ? s.streak + 1 : 1
      }
      return {
        streak,
        lastDay: day,
        focus: { ...s.focus, [day]: (s.focus[day] || 0) + minutes },
        sessions: [...(s.sessions || []).slice(-99), { day, at: Date.now(), min: minutes, subj: subj || '' }],
      }
    })
  }

  // Naya subject add karo (agar pehle se nahi hai) — notes/flashcards me type karte hi list me aa jayega
  function addSubject(name) {
    const n = (name || '').trim()
    if (!n) return false
    setSubjects(ss => (ss.includes(n) ? ss : [...ss, n]))
    return true
  }

  const value = {
    lang, setLang, t: makeT(lang),
    notes, setNotes,
    quizzes, setQuizzes,
    cards, setCards,
    subjects, setSubjects, addSubject,
    plans, setPlans,
    mindmaps, setMindmaps,
    mmRevise, setMMRevise,
    qna, setQna,
    longs, setLongs,
    maps, setMaps,
    reviews, setReviews,
    mistakes, setMistakes,
    examdate, setExamdate,
    progress, setProgress,
    stats, setStats,
    cardSched, setCardSched,
    mission, setMission,
    registerFocus,
    synced, syncNow,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
