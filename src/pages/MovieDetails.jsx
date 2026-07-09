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

      {/* Hero / Trailer */}
      <div className="dp-hero">
        {trailer ? (
          <iframe
            className="dp-trailer"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`}
            title="trailer"
            allowFullScreen
            allow="autoplay"
          />
        ) : (
          <div
            className="dp-trailer dp-no-trailer"
            style={{
              backgroundImage: movie.backdrop_path
                ? `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`
                : undefined,
            }}
          />
        )}
        <div className="dp-hero-overlay">
          <div className="dp-hero-content">
            <h1 className="dp-title">{movie.title}</h1>
            <div className="dp-meta">
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
              {country && <span>{country}</span>}
              {movie.genres?.map((g) => <span key={g.id}>{g.name}</span>)}
            </div>
            <p className="dp-overview">{movie.overview?.slice(0, 200)}{movie.overview?.length > 200 ? '…' : ''}</p>
            <div className="dp-actions">
              <a
                href={`https://www.youtube.com/watch?v=${trailer?.key}`}
                target="_blank"
                rel="noreferrer"
                className="dp-btn dp-btn-primary"
              >
                ▶ Watch Trailer
              </a>
              <button
                className={`dp-btn${isFav(movie.id) ? ' dp-btn-fav-active' : ' dp-btn-outline'}`}
                onClick={() => toggle(movie)}
              >
                {isFav(movie.id) ? '❤️ Saved' : '🤍 Watchlist'}
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=Check out ${encodeURIComponent(movie.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="dp-btn dp-btn-outline"
              >
                𝕏 Share
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="dp-btn dp-btn-outline"
              >
                Share
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rating + Info Bar */}
      <div className="dp-infobar">
        <div className="dp-rating-block">
          <span className="dp-avg-rating">⭐ {movie.vote_average?.toFixed(1)}</span>
          <span className="dp-vote-count">{movie.vote_count?.toLocaleString()} ratings</span>
        </div>
        <div className="dp-user-rating">
          <span>Your rating:</span>
          <div className="stars">
            {Array.from({ length: 10 }).map((_, i) => (
              <button
                key={i}
                className={`star${i < (hovered || userRating) ? ' active' : ''}`}
                onMouseEnter={() => setHovered(i + 1)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => handleRate(i + 1)}
              >★</button>
            ))}
          </div>
          {ratingMsg && <span className="rating-msg">{ratingMsg}</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="dp-tabs">
        {['cast', 'related'].map((tab) => (
          <button
            key={tab}
            className={`dp-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'cast' ? 'Cast' : 'Related Movies'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="dp-tab-content">
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
        {activeTab === 'related' && (
          <div className="grid">
            {recommendations.length === 0
              ? <p>No recommendations found.</p>
              : recommendations.map((m) => <MovieCard key={m.id} movie={m} />)
            }
          </div>
        )}
      </div>
    </div>
  )
}
