import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  const img = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : ''

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      {img && <img src={img} alt={movie.title} className="movie-poster" />}
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date}</p>
      </div>
    </Link>
  )
}
