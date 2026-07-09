import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb from '../services/tmdb.js'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tmdb
      .getMovieDetails(id)
      .then((data) => setMovie(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="message-box">Loading...</div>
  if (!movie) return <div className="message-box">Movie not found</div>

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube',
  )

  return (
    <div className="details-page">
      <div className="details-grid">
        <div className="details-card">
          <h1>{movie.title}</h1>
          <p>{movie.overview}</p>
          <p>
            <strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(', ')}
          </p>
          <p>
            <strong>Release:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average} ({movie.vote_count}{' '}
            votes)
          </p>
        </div>
        <div className="poster-card">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
      </div>

      {trailer && (
        <div className="details-card trailer-wrapper">
          <h2>Trailer</h2>
          <iframe
            title="trailer"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
