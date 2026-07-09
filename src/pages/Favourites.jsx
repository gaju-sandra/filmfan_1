import { Link } from 'react-router-dom'
import { useFavourites } from '../context/FavouritesContext.jsx'
import MovieCard from '../components/MovieCard.jsx'

export default function Favourites() {
  const { favourites } = useFavourites()

  return (
    <div>
      <h2 className="page-title">My Favourites</h2>
      {favourites.length === 0 ? (
        <div className="message-box">
          <p>You haven't added any favourites yet.</p>
          <Link to="/" className="dp-btn dp-btn-primary" style={{ marginTop: '12px', display: 'inline-flex' }}>
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid">
          {favourites.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </div>
  )
}
