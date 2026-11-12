import { useMemo, useState } from 'react'
import { useStore } from '../store'
import { uid } from '../utils'
import { summarize } from '../summarize'

export default function Notes() {
  const { t, notes, setNotes, subjects: subjectList, addSubject } = useStore()
  const [activeId, setActiveId] = useState(notes[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('all')
  const [summary, setSummary] = useState(null)

  const subjects = useMemo(
    () => [...new Set(notes.map(n => n.subject).filter(Boolean))],
    [notes]
  )
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return notes.filter(
      n => (subject === 'all' || n.subject === subject) &&
        (!q || (n.title + ' ' + n.body).toLowerCase().includes(q))
    )
  }, [notes, search, subject])

  const active = notes.find(n => n.id === activeId) ?? null

  function updateActive(patch) {
    setNotes(ns => ns.map(n => (n.id === activeId ? { ...n, ...patch, updatedAt: Date.now() } : n)))
    if (patch.subject && patch.subject.trim()) addSubject(patch.subject.trim())
  }

  function newNote() {
    const n = { id: uid(), subject: '', title: '', body: '', updatedAt: Date.now() }
    setNotes(ns => [n, ...ns])
    setActiveId(n.id)
    setSummary(null)
  }

  function makeSummary() {
    setSummary(summarize(active?.body || '', 5))
  }

  function saveSummary() {
    if (!active) return
    const body = summary.map(s => '• ' + s).join('\n')
    const n = {
      id: uid(),
      subject: active.subject || t('notes.subject'),
      title: (t('notes.summaryOf') + ' ' + (active.title || '')).trim(),
      body,
      updatedAt: Date.now(),
    }
    setNotes(ns => [n, ...ns])
    setActiveId(n.id)
    setSummary(null)
  }

  function del(id) {
    setNotes(ns => ns.filter(n => n.id !== id))
    if (id === activeId) setActiveId(null)
    setSummary(null)
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>📝 {t('nav.notes')}</h1>
        <button className="btn primary" onClick={newNote}>+ {t('notes.new')}</button>
      </div>

      <div className="notes-layout">
        <div className="panel notes-list">
          <input className="input" placeholder={t('notes.search')} value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
            <option value="all">{t('notes.allSubjects')}</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {filtered.length === 0 ? (
            <p className="muted">{t('notes.empty')}</p>
          ) : (
            filtered.map(n => (
              <div
                key={n.id}
                className={'note-item' + (n.id === activeId ? ' active' : '')}
                onClick={() => { setActiveId(n.id); setSummary(null) }}
              >
                <div className="note-item-title">{n.title || t('notes.title')}</div>
                <div className="note-item-sub">{n.subject}</div>
              </div>
            ))
          )}
        </div>

        {active ? (
          <div className="panel notes-editor">
            <input className="input" placeholder={t('notes.title')} value={active.title} onChange={e => updateActive({ title: e.target.value })} />
            <input
              className="input"
              list="sb-subjects"
              placeholder={t('notes.subject')}
              value={active.subject}
              onChange={e => updateActive({ subject: e.target.value })}
            />
            <datalist id="sb-subjects">
              {subjectList.map(s => <option key={s} value={s} />)}
            </datalist>
            <textarea className="input notes-body" placeholder={t('notes.body')} value={active.body} onChange={e => updateActive({ body: e.target.value })} />
            <div className="row wrap">
              <button className="btn" onClick={makeSummary}>✨ {t('notes.summary')}</button>
              <button className="btn danger" onClick={() => del(active.id)}>🗑 {t('notes.delete')}</button>
              <span className="muted">{t('notes.autoSaved')}</span>
            </div>
            {summary && (
              <div className="summary-box">
                <h3>{t('notes.summaryTitle')}</h3>
                {summary.length === 0 ? (
                  <p className="muted">—</p>
                ) : (
                  <ul>{summary.map((s, i) => <li key={i}>{s}</li>)}</ul>
                )}
                {summary.length > 0 && active.title && (
                  <button className="btn" onClick={saveSummary}>💾 {t('notes.saveSummary')}</button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="panel notes-editor empty-center">
            <p className="muted">{t('notes.noSelect')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
