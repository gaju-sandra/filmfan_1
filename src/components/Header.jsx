import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const onSearch = (e) => {
    e.preventDefault()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setQ('')
  }

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="brand">
          Film Fan
        </Link>
        <div className="header-actions">
          <form onSubmit={onSearch} className="header-search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search movies..."
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
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
