import { useState } from 'react'
import { useStore } from '../store'
import { uid, todayStr } from '../utils'

export default function Quiz() {
  const { t, quizzes, setQuizzes } = useStore()
  const [view, setView] = useState('list') // list | build | take
  const [activeId, setActiveId] = useState(null)
  const [name, setName] = useState('')

  const active = quizzes.find(q => q.id === activeId)

  function create() {
    if (!name.trim()) return
    const q = { id: uid(), name: name.trim(), questions: [] }
    setQuizzes(qs => [q, ...qs])
    setName('')
    setActiveId(q.id)
    setView('build')
  }

  function delQuiz(id) {
    setQuizzes(qs => qs.filter(q => q.id !== id))
  }

  return (
    <div className="page">
      <h1>🧠 {t('nav.quiz')}</h1>

      {view === 'list' && (
        <>
          <div className="panel">
            <h3>➕ {t('nav.quiz')}</h3>
            <div className="row">
              <input className="input grow" placeholder={t('quiz.name')} value={name} onChange={e => setName(e.target.value)} />
              <button className="btn primary" onClick={create}>{t('quiz.create')}</button>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <div className="panel empty-center"><p className="muted">{t('quiz.empty')}</p></div>
          ) : (
            <div className="quiz-grid">
              {quizzes.map(q => (
                <div className="panel quiz-tile" key={q.id}>
                  <h3>{q.name}</h3>
                  <p className="muted">{q.questions.length} {t('quiz.questionsWord')}</p>
                  <div className="row">
                    <button className="btn primary" disabled={q.questions.length === 0} onClick={() => { setActiveId(q.id); setView('take') }}>{t('quiz.take')}</button>
                    <button className="btn" onClick={() => { setActiveId(q.id); setView('build') }}>{t('quiz.manage')}</button>
                    <button className="btn danger small" onClick={() => delQuiz(q.id)}>{t('quiz.delete')}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === 'build' && active && <BuildQuiz quiz={active} setQuizzes={setQuizzes} t={t} back={() => setView('list')} />}
      {view === 'take' && active && <TakeQuiz quiz={active} t={t} back={() => setView('list')} />}
    </div>
  )
}

function BuildQuiz({ quiz, setQuizzes, t, back }) {
  const [draft, setDraft] = useState({ q: '', o: ['', '', '', ''], correct: 0 })

  function add() {
    if (!draft.q.trim() || draft.o.some(o => !o.trim())) return
    const question = { q: draft.q.trim(), options: draft.o.map(o => o.trim()), answer: draft.correct }
    setQuizzes(qs => qs.map(x => (x.id === quiz.id ? { ...x, questions: [...x.questions, question] } : x)))
    setDraft({ q: '', o: ['', '', '', ''], correct: 0 })
  }

  function delQ(i) {
    setQuizzes(qs => qs.map(x => (x.id === quiz.id ? { ...x, questions: x.questions.filter((_, j) => j !== i) } : x)))
  }

  return (
    <div>
      <div className="page-head">
        <h2>🛠 {quiz.name}</h2>
        <button className="btn" onClick={back}>{t('quiz.back')}</button>
      </div>

      <div className="panel">
        <h3>{t('quiz.addQuestion')}</h3>
        <input className="input" placeholder={t('quiz.question')} value={draft.q} onChange={e => setDraft(d => ({ ...d, q: e.target.value }))} />
        {[0, 1, 2, 3].map(i => (
          <label key={i} className="opt-row">
            <input type="radio" name="correct-opt" checked={draft.correct === i} onChange={() => setDraft(d => ({ ...d, correct: i }))} />
            <input
              className="input"
              placeholder={t('quiz.option', { n: i + 1 })}
              value={draft.o[i]}
              onChange={e => setDraft(d => { const o = [...d.o]; o[i] = e.target.value; return { ...d, o } })}
            />
          </label>
        ))}
        <div className="muted" style={{ marginBottom: 10 }}>{t('quiz.correct')}</div>
        <button className="btn primary" onClick={add}>+ {t('quiz.add')}</button>
      </div>

      <div className="panel">
        <h3>{quiz.questions.length} {t('quiz.questionsWord')}</h3>
        {quiz.questions.length === 0 && <p className="muted">{t('quiz.noQ')}</p>}
        {quiz.questions.map((q, i) => (
          <div className="q-item" key={i}>
            <div>
              <b>{i + 1}. {q.q}</b>
              <div className="muted">✔ {q.options[q.answer]}</div>
            </div>
            <button className="btn danger small" onClick={() => delQ(i)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function TakeQuiz({ quiz, t, back }) {
  const { setMistakes } = useStore()
  const [qi, setQi] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const qs = quiz.questions

  if (qs.length === 0) {
    return (
      <div className="panel empty-center">
        <p className="muted">{t('quiz.noQ')}</p>
        <button className="btn" onClick={back}>{t('quiz.back')}</button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="panel quiz-card center">
        <h2>🏆 {t('quiz.score')}</h2>
        <div className="score-big">{score} / {qs.length}</div>
        <div className="row center">
          <button className="btn primary" onClick={() => { setQi(0); setPicked(null); setScore(0); setFinished(false) }}>{t('quiz.restart')}</button>
          <button className="btn" onClick={back}>{t('quiz.back')}</button>
        </div>
      </div>
    )
  }

  const cur = qs[qi]

  function pick(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === cur.answer) setScore(s => s + 1)
    else {
      // ❌ गलती notebook में जमा करो — exam से पहले सिर्फ इन्हीं का रिवीज़न
      const correct = cur.options[cur.answer]
      const chosen = cur.options[i]
      const key = (quiz.id || quiz.name) + '|' + (cur.q || '') + '|' + (correct || '')
      setMistakes(m => m.some(x => x.key === key) ? m
        : [{ key, q: cur.q, correct, chosen, quiz: quiz.name, day: todayStr() }, ...m].slice(0, 120))
    }
  }
  function next() {
    if (qi + 1 < qs.length) { setQi(qi + 1); setPicked(null) } else setFinished(true)
  }

  return (
    <div className="panel quiz-card">
      <div className="quiz-progress">{qi + 1} / {qs.length}</div>
      <h2>{cur.q}</h2>
      <div className="opt-list">
        {cur.options.map((o, i) => (
          <button
            key={i}
            className={'opt' + (picked !== null ? (i === cur.answer ? ' right' : (i === picked ? ' wrong' : ' dim')) : '')}
            onClick={() => pick(i)}
          >
            {String.fromCharCode(65 + i)}. {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div>
          <p className={picked === cur.answer ? 'ok' : 'bad'}>
            {picked === cur.answer ? t('quiz.right') : t('quiz.wrong')}
          </p>
          <button className="btn primary" onClick={next}>
            {qi + 1 < qs.length ? t('quiz.next') : t('quiz.finish')}
          </button>
        </div>
      )}
    </div>
  )
}
