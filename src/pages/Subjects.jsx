import { useState } from 'react'
import { useStore } from '../store'

export default function Subjects() {
  const { t, subjects, setSubjects, notes, cards } = useStore()
  const [name, setName] = useState('')

  function add() {
    const n = name.trim()
    if (!n) return
    setSubjects(ss => (ss.includes(n) ? ss : [...ss, n]))
    setName('')
  }

  function del(s) {
    setSubjects(ss => ss.filter(x => x !== s))
  }

  const nCount = s => notes.filter(n => n.subject === s).length
  const cCount = s => cards.filter(c => c.subject === s).length

  return (
    <div className="page">
      <h1>🗂 {t('nav.subjects')}</h1>

      <div className="panel">
        <div className="row">
          <input
            className="input grow"
            placeholder={t('subjects.new')}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add() }}
          />
          <button className="btn primary" onClick={add}>+ {t('subjects.add')}</button>
        </div>
        <p className="muted">{t('subjects.hint')}</p>
      </div>

      <div className="panel">
        {subjects.map(s => (
          <div className="q-item" key={s}>
            <div>
              <b>{s}</b>
              <div className="muted">{t('subjects.notesCount', { n: nCount(s) })} · {t('subjects.cardsCount', { n: cCount(s) })}</div>
            </div>
            <button className="btn danger small" onClick={() => del(s)}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  )
}
