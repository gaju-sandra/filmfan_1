import { useState } from 'react'
import tmdb from '../services/tmdb.js'
import MovieCard from '../components/MovieCard.jsx'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const onSearch = async (e) => {
    e.preventDefault()
    if (!query) return
    setLoading(true)

    try {
      const data = await tmdb.searchMovies(query)
      setResults(data.results || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Search Movies</h1>
      <form onSubmit={onSearch} className="mb-4">
        <input
          className="search-input"
          placeholder="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {loading ? (
        <div className="message-box">Searching...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
