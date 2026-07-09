import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import tmdb from '../services/tmdb.js'
import MovieCard from '../components/MovieCard.jsx'
import { useFavourites } from '../context/FavouritesContext.jsx'

export default function MovieDetails() {
  const { id } = useParams()
  const { toggle, isFav } = useFavourites()
  const [movie, setMovie] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [ratingMsg, setRatingMsg] = useState('')
  const [activeTab, setActiveTab] = useState('cast')

  const getGuestSession = async () => {
    let sid = localStorage.getItem('guest_session_id')
    if (!sid) {
      const data = await tmdb.createGuestSession()
      sid = data.guest_session_id
      localStorage.setItem('guest_session_id', sid)
    }
    return sid
  }

  const handleRate = async (star) => {
    setUserRating(star)
    try {
      const sid = await getGuestSession()
      await tmdb.rateMovie(id, star, sid)
      setRatingMsg('Rating submitted!')
    } catch {
      setRatingMsg('Failed to submit rating.')
    }
    setTimeout(() => setRatingMsg(''), 3000)
  }

  useEffect(() => {
    setLoading(true)
    setUserRating(0)
    setActiveTab('cast')
    Promise.all([
      tmdb.getMovieDetails(id),
      tmdb.getRecommendations(id),
    ]).then(([m, r]) => {
      setMovie(m)
      setRecommendations(r.results?.slice(0, 8) || [])
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="message-box">Loading...</div>
  if (!movie) return <div className="message-box">Movie not found</div>

  const trailer = movie.videos?.results?.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null
  const year = movie.release_date?.slice(0, 4)
  const country = movie.production_countries?.[0]?.name
  const shareUrl = window.location.href

  return (
    <div className="dp-page">

      {/* Trailer + Info side by side */}
      <div className="dp-top-row">

        {/* Smaller trailer box */}
        <div className="dp-hero">
          {trailer ? (
            <iframe
              className="dp-hero-iframe"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1&modestbranding=1&rel=0`}
              title="trailer"
              allowFullScreen
              allow="autoplay"
            />
          ) : (
            <div
              className="dp-hero-iframe dp-no-trailer"
              style={{
                backgroundImage: movie.backdrop_path
                  ? `url(https://image.tmdb.org/t/p/w780${movie.backdrop_path})`
                  : undefined,
              }}
            />
          )}
        </div>

        {/* Movie info */}
        <div className="dp-info">
          <h1 className="dp-title">{movie.title}</h1>

          <div className="dp-meta">
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
            {country && <span>{country}</span>}
            {movie.genres?.map((g) => <span key={g.id}>{g.name}</span>)}
          </div>

          <p className="dp-overview">{movie.overview}</p>

          <div className="dp-ratings-row">
            <div className="dp-avg-block">
              <span className="dp-avg-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              <span className="dp-vote-count">{movie.vote_count?.toLocaleString()} ratings</span>
            </div>
            <div className="dp-user-rating">
              <span className="dp-rate-label">Rate:</span>
              <div className="dp-stars">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i}
                    className={`dp-star${i < (hovered || userRating) ? ' active' : ''}`}
                    onMouseEnter={() => setHovered(i + 1)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => handleRate(i + 1)}
                  >★</button>
                ))}
              </div>
              {ratingMsg && <span className="dp-rating-msg">{ratingMsg}</span>}
            </div>
          </div>

          <div className="dp-actions">
            <a
              href={`https://www.youtube.com/watch?v=${trailer?.key}`}
              target="_blank"
              rel="noreferrer"
              className="dp-btn dp-btn-primary"
            >
              ▶ Watch on youtube
            </a>
            <button
              className={`dp-btn${isFav(movie.id) ? ' dp-btn-fav-active' : ' dp-btn-outline-solid'}`}
              onClick={() => toggle(movie)}
            >
              {isFav(movie.id) ? '❤️ Favourites' : '🤍 Favourites'}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(movie.title)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="dp-btn dp-btn-outline-solid"
            >
              𝕏 Share
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="dp-btn dp-btn-outline-solid"
            >
              Share
            </a>
          </div>
        </div>
      </div>

      {/* Tabbed: Cast / Recommended */}
      <div className="dp-section">
        <div className="dp-tabs">
          <button
            className={`dp-tab${activeTab === 'cast' ? ' active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Cast
          </button>
          <button
            className={`dp-tab${activeTab === 'recommended' ? ' active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended
          </button>
        </div>

        {activeTab === 'cast' && (
          <div className="cast-grid">
            {movie.credits?.cast?.slice(0, 12).map((actor) => (
              <div key={actor.id} className="cast-card">
                <img
                  src={actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://placehold.co/100x150?text=N/A'}
                  alt={actor.name}
                  className="cast-photo"
                />
                <div className="cast-info">
                  <strong>{actor.name}</strong>
                  <span>{actor.character}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommended' && (
          recommendations.length === 0
            ? <p>No recommendations found.</p>
            : <div className="grid">{recommendations.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
        )}
      </div>
    </div>
  )
}
