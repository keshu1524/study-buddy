import { useState } from 'react'
import { StoreProvider, useStore } from './store'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'
import Timer from './pages/Timer'
import Quiz from './pages/Quiz'
import Flashcards from './pages/Flashcards'
import Planner from './pages/Planner'
import Progress from './pages/Progress'
import Subjects from './pages/Subjects'
import MindMaps from './pages/MindMaps'
import MockTest from './pages/MockTest'
import QnA from './pages/QnA'
import Longs from './pages/Longs'
import Maps from './pages/Maps'

const NAV = [
  { id: 'dashboard', icon: '🏠', key: 'nav.dashboard' },
  { id: 'notes', icon: '📝', key: 'nav.notes' },
  { id: 'timer', icon: '⏱️', key: 'nav.timer' },
  { id: 'quiz', icon: '🧠', key: 'nav.quiz' },
  { id: 'cards', icon: '🃏', key: 'nav.cards' },
  { id: 'planner', icon: '📅', key: 'nav.planner' },
  { id: 'progress', icon: '📊', key: 'nav.progress' },
  { id: 'mindmaps', icon: '🗺️', key: 'nav.mindmaps' },
  { id: 'mock', icon: '📄', key: 'nav.mock' },
  { id: 'qna', icon: '✍️', key: 'nav.qna' },
  { id: 'longs', icon: '📘', key: 'nav.longs' },
  { id: 'maps', icon: '🌏', key: 'nav.maps' },
  { id: 'subjects', icon: '🗂', key: 'nav.subjects' },
]

const PAGES = {
  dashboard: Dashboard,
  notes: Notes,
  timer: Timer,
  quiz: Quiz,
  cards: Flashcards,
  planner: Planner,
  progress: Progress,
  mindmaps: MindMaps,
  mock: MockTest,
  qna: QnA,
  longs: Longs,
  maps: Maps,
  subjects: Subjects,
}

function Shell() {
  const { t, lang, setLang } = useStore()
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">📚 <span>{t('appName')}</span></div>
        <nav className="nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={'nav-btn' + (page === item.id ? ' active' : '')}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t(item.key)}</span>
            </button>
          ))}
        </nav>
        <div className="lang-toggle">
          <button className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>हिंदी</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
        </div>
      </aside>
      <main className="main">
        <Page go={setPage} />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
