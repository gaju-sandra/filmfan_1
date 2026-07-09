import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext.jsx'

export default function MovieCard({ movie }) {
  const img = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : ''
  const { toggle, isFav } = useFavourites()
  const fav = isFav(movie.id)

  return (
    <div className="movie-card-wrap">
      <Link to={`/movie/${movie.id}`} className="movie-card">
        {img && <img src={img} alt={movie.title || movie.name} className="movie-poster" />}
        <div className="movie-info">
          <h3>{movie.title || movie.name}</h3>
          <p>{movie.release_date || movie.first_air_date}</p>
        </div>
      </Link>
      <button
        className={`fav-btn${fav ? ' fav-active' : ''}`}
        onClick={() => toggle(movie)}
        title={fav ? 'Remove from favourites' : 'Add to favourites'}
      >
        {fav ? '❤️' : '🤍'}
      </button>
    </div>
  )
}
