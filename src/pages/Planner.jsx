import { useState } from 'react'
import { useStore } from '../store'
import { uid, todayStr, dateStr } from '../utils'

export default function Planner() {
  const { t, plans, setPlans } = useStore()
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [subjects, setSubjects] = useState('')
  const [err, setErr] = useState(false)

  function make() {
    const subs = subjects.split(',').map(s => s.trim()).filter(Boolean)
    if (!name.trim() || !date || subs.length === 0) return
    if (date <= todayStr()) {
      setErr(true)
      return
    }
    setErr(false)

    // Aaj se exam ki raat tak ke din, aur har din round-robin tasks
    const dates = []
    for (let x = new Date(todayStr() + 'T00:00:00'); x < new Date(date + 'T00:00:00'); x.setDate(x.getDate() + 1)) {
      dates.push(dateStr(x))
    }
    const capped = dates.slice(0, 60) // bahut lambi list ho to cap
    const days = capped.map((ds, i) => ({
      date: ds,
      tasks: [
        { id: uid(), subject: subs[i % subs.length], kind: 'study', done: false },
        ...(i > 0 && capped.length > subs.length
          ? [{ id: uid(), subject: subs[(i - 1) % subs.length], kind: 'revise', done: false }]
          : []),
      ],
    }))

    const plan = { id: uid(), name: name.trim(), examDate: date, days }
    setPlans(ps => [...ps, plan])
    setName('')
    setDate('')
    setSubjects('')
  }

  function updTask(planId, dayDate, taskId, checked) {
    setPlans(ps => ps.map(p => p.id !== planId ? p : {
      ...p,
      days: p.days.map(d => d.date !== dayDate ? d : {
        ...d,
        tasks: d.tasks.map(tk => (tk.id === taskId ? { ...tk, done: checked } : tk)),
      }),
    }))
  }

  const sorted = [...plans].sort((a, b) => a.examDate.localeCompare(b.examDate))

  return (
    <div className="page">
      <h1>📅 {t('nav.planner')}</h1>

      <div className="panel">
        <h3>🎯 {t('planner.make')}</h3>
        <input className="input" placeholder={t('planner.exam')} value={name} onChange={e => setName(e.target.value)} />
        <label className="muted">{t('planner.date')}</label>
        <input className="input" type="date" min={todayStr()} value={date} onChange={e => { setDate(e.target.value); setErr(false) }} />
        <input className="input" placeholder={t('planner.subjects')} value={subjects} onChange={e => setSubjects(e.target.value)} />
        {err && <p className="bad">{t('planner.future')}</p>}
        <button className="btn primary" onClick={make}>{t('planner.make')}</button>
      </div>

      {sorted.length === 0 && (
        <div className="panel empty-center"><p className="muted">{t('planner.empty')}</p></div>
      )}

      {sorted.map(p => {
        const tasks = p.days.flatMap(d => d.tasks)
        const done = tasks.filter(x => x.done).length
        const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0
        const left = Math.ceil((new Date(p.examDate + 'T00:00:00') - new Date(todayStr() + 'T00:00:00')) / 86400000)
        return (
          <div className="panel" key={p.id}>
            <div className="page-head">
              <h3>🎯 {p.name}</h3>
              <button className="btn danger small" onClick={() => setPlans(ps => ps.filter(x => x.id !== p.id))}>{t('planner.delete')}</button>
            </div>
            <p>📅 {p.examDate} · ⏳ <b>{t('planner.daysLeft', { n: left })}</b></p>
            <div className="progress"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
            <p className="muted">{t('planner.tasksDone', { d: done, n: tasks.length })} ({pct}%)</p>
            <div className="plan-days">
              {p.days.map(d => (
                <details key={d.date} className="plan-day">
                  <summary>📅 {d.date}</summary>
                  <div className="task-list">
                    {d.tasks.map(tk => (
                      <label key={tk.id} className="task-row">
                        <input type="checkbox" checked={tk.done} onChange={e => updTask(p.id, d.date, tk.id, e.target.checked)} />
                        <span className={tk.done ? 'strike' : ''}>{t(tk.kind === 'revise' ? 'planner.revise' : 'planner.study', { s: tk.subject })}</span>
                      </label>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
