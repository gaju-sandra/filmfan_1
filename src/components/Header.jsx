import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import tmdb from '../services/tmdb.js'
import { useFavourites } from '../context/FavouritesContext.jsx'

export default function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showFavs, setShowFavs] = useState(false)
  const debounceRef = useRef(null)
  const { favourites, toggle } = useFavourites()

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
        <Link to="/" className="brand">
          Film Fan
        </Link>
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
          <div className="fav-wrap">
            <button className="theme-button" onClick={() => setShowFavs((v) => !v)}>
              ❤️ {favourites.length > 0 && <span className="fav-count">{favourites.length}</span>}
            </button>
            {showFavs && (
              <div className="search-dropdown fav-dropdown">
                {favourites.length === 0 ? (
                  <div className="search-drop-item">No favourites yet</div>
                ) : (
                  favourites.map((m) => (
                    <Link
                      key={m.id}
                      to={`/movie/${m.id}`}
                      className="search-drop-link"
                      onClick={() => setShowFavs(false)}
                    >
                      <img
                        src={m.poster_path
                          ? `https://image.tmdb.org/t/p/w92${m.poster_path}`
                          : 'https://placehold.co/46x68?text=N/A'}
                        alt={m.title || m.name}
                        className="search-drop-poster"
                      />
                      <span>
                        <strong>{m.title || m.name}</strong>
                        <button
                          className="fav-remove"
                          onClick={(e) => { e.preventDefault(); toggle(m) }}
                        >Remove</button>
                      </span>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
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
