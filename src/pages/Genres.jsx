import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import tmdb from '../services/tmdb.js'
import MovieCard from '../components/MovieCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'

const GENRES = [
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 16, name: 'Animation' },
]

export default function Genres() {
  const [selected, setSelected] = useState(GENRES[0])
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    tmdb.getByGenre(selected.id)
      .then((data) => setMovies(data.results || []))
      .finally(() => setLoading(false))
  }, [selected])

  return (
    <div>
      <h2 className="page-title">Genres</h2>
      <div className="genre-pills">
        {GENRES.map((g) => (
          <button
            key={g.id}
            className={`genre-pill${selected.id === g.id ? ' active' : ''}`}
            onClick={() => setSelected(g)}
          >
            {g.name}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid" style={{ marginTop: '24px' }}>
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid" style={{ marginTop: '24px' }}>
          {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </div>
  )
}
