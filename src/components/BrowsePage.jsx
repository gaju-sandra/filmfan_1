import { useEffect, useState, useCallback } from 'react'
import MovieCard from './MovieCard.jsx'
import SkeletonCard from './SkeletonCard.jsx'

const PER_PAGE = 8
const MAX_PAGES = 4

export default function BrowsePage({ title, fetchFn }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetchFn(page)
      .then((d) => setMovies(d.results || []))
      .finally(() => setLoading(false))
  }, [page, title])

  const handlePage = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <h2 className="page-title">{title}</h2>
      {loading ? (
        <div className="grid">
          {Array.from({ length: PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid">
          {movies.slice(0, PER_PAGE).map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
      <div className="pagination">
        {Array.from({ length: MAX_PAGES }).map((_, i) => (
          <button
            key={i}
            className={`page-btn${page === i + 1 ? ' active' : ''}`}
            onClick={() => handlePage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
