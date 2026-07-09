import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import tmdb from '../services/tmdb.js'

const NAV_LINKS = [
  { to: '/', label: 'Discover', icon: null },
  { to: '/genres', label: 'Genres', icon: null },
  { to: '/favourites', label: 'Favourites', icon: null },
]

export default function Header({ onMenuClick }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleSearch = (e) => {
    const val = e.target.value
    setQ(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setResults([]); return }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await tmdb.searchMovies(val)
        setResults(data.results?.slice(0, 6) || [])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-wrap">
          <button className="menu-btn" onClick={onMenuClick}>☰</button>
          <Link to="/" className="brand">Film Fan</Link>
        </div>

        <nav className="header-nav">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-pill${isActive ? ' nav-pill-active' : ''}`}
            >
              {icon && <span>{icon}</span>}{label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <div className="header-search-wrap">
            <input
              value={q}
              onChange={handleSearch}
              placeholder="Search movies..."
              className="search-input"
            />
            {q.trim() && (
              <div className="search-dropdown">
                {searching && <div className="search-drop-item">Searching...</div>}
                {!searching && results.length === 0 && <div className="search-drop-item">No results</div>}
                {results.map((m) => (
                  <Link
                    key={m.id}
                    to={`/movie/${m.id}`}
                    className="search-drop-link"
                    onClick={() => { setQ(''); setResults([]) }}
                  >
                    <img
                      src={m.poster_path
                        ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                        : 'https://placehold.co/46x68?text=N/A'}
                      alt={m.title}
                      className="search-drop-poster"
                    />
                    <span>
                      <strong>{m.title}</strong>
                      {m.release_date && <small>{m.release_date.slice(0, 4)}</small>}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="theme-button"
          >
            {theme === 'dark' ? '☀️  dark ' : '🌙 light'}
          </button>
        </div>
      </div>
    </header>
  )
}
