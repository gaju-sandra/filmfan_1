import { useEffect, useState, useRef } from 'react'
import tmdb from '../services/tmdb.js'
import MovieCard from '../components/MovieCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    tmdb
      .getTrending()
      .then((data) => setTrending(data.results || []))
      .catch(() => setTrending([]))
      .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    const val = e.target.value
    setQuery(val)
    clearTimeout(debounceRef.current)
    if (!val.trim()) { setSearchResults([]); return }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await tmdb.searchMovies(val)
        setSearchResults(data.results || [])
      } finally {
        setSearching(false)
      }
    }, 400)
  }

  const featured = trending.slice(0, 4)

  return (
    <div className="space-y-8">
      <section className="hero-banner">
        <div>
          <h2>Discover Movies in Rwanda</h2>
          <p>Film Fan is your gateway to trending films, curated picks, and detailed movie pages — built for Kigali and beyond.</p>
          <input
            className="search-input"
            placeholder="Search movies..."
            value={query}
            onChange={handleSearch}
            style={{ marginTop: '1rem' }}
          />
        </div>
      </section>

      {query.trim() && (
        <section>
          <h3 className="page-title">Results for "{query}"</h3>
          {searching ? (
            <div className="message-box">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="message-box">No movies found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      )}

      {!query.trim() && (<>
      <section>
        <h3 className="page-title">Featured</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="page-title">Trending This Week</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
      </>)}
    </div>
  )
}
