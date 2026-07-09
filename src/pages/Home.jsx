import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import tmdb from '../services/tmdb.js'
import MovieCard from '../components/MovieCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    tmdb
      .getTrending()
      .then((data) => setTrending(data.results || []))
      .catch(() => setTrending([]))
      .finally(() => setLoading(false))
  }, [])

  const heroes = trending.slice(0, 5)

  useEffect(() => {
    if (!heroes.length) return
    const t = setInterval(() => setSlide((s) => (s + 1) % heroes.length), 4000)
    return () => clearInterval(t)
  }, [heroes.length])

  const featured = trending.slice(0, 4)

  return (
    <div className="space-y-8">
      <section className="carousel">
        {loading || !heroes.length ? (
          <div className="carousel-slide" style={{ background: '#6366f1' }} />
        ) : (
          heroes.map((m, i) => (
            <Link
              key={m.id}
              to={`/movie/${m.id}`}
              className={`carousel-slide${i === slide ? ' active' : ''}`}
              style={{
                backgroundImage: m.backdrop_path
                  ? `url(https://image.tmdb.org/t/p/w1280${m.backdrop_path})`
                  : undefined,
              }}
            >
              <div className="carousel-overlay">
                <h2>{m.title}</h2>
                <p>{m.overview?.slice(0, 120)}{m.overview?.length > 120 ? '…' : ''}</p>
              </div>
            </Link>
          ))
        )}
        <div className="carousel-dots">
          {heroes.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === slide ? ' active' : ''}`}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      <section>
        <h3 className="page-title">High rated</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featured.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>

      <section>
        <h3 className="page-title">Trending This Week</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {trending.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        )}
      </section>
    </div>
  )
}
