import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          Film Fan
        </Link>
        <div className="header-actions">
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="theme-button"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
