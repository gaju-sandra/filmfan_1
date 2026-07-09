import { useEffect, useState } from 'react'
import MovieCard from './MovieCard.jsx'
import SkeletonCard from './SkeletonCard.jsx'

const PER_PAGE = 10
const MAX_PAGES = 4

export default function BrowsePage({ title, fetchFn }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(MAX_PAGES)

  useEffect(() => {
    setLoading(true)
    fetchFn(page)
      .then((d) => {
        setMovies(d.results || [])
        setTotalPages(Math.min(d.total_pages || MAX_PAGES, MAX_PAGES))
      })
      .finally(() => setLoading(false))
  }, [page, title])

  const handlePage = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
        {Array.from({ length: totalPages }).map((_, i) => (
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
