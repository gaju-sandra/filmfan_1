import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import tmdb from '../services/tmdb.js'
import MovieCard from '../components/MovieCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [topRated, setTopRated] = useState([])
  const [series, setSeries] = useState([])
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    Promise.all([
      tmdb.getTrending(),
      tmdb.getTopRated(),
      tmdb.getPopularSeries(),
      tmdb.getAnime(),
    ]).then(([t, r, s, a]) => {
      setTrending(t.results || [])
      setTopRated(r.results || [])
      setSeries(s.results || [])
      setAnime(a.results || [])
    }).finally(() => setLoading(false))
  }, [])

  const heroes = trending.slice(0, 5)

  useEffect(() => {
    if (!heroes.length) return
    const t = setInterval(() => setSlide((s) => (s + 1) % heroes.length), 4000)
    return () => clearInterval(t)
  }, [heroes.length])

  const sections = [
    { title: 'Trending This Week', data: trending },
    { title: 'High Rated', data: topRated },
    { title: 'Popular Series', data: series },
    { title: 'Anime', data: anime },
  ]

  return (
    <div className="space-y-8">
      <section className="carousel">
        {loading || !heroes.length ? (
          <div className="carousel-slide" style={{ background: '#6366f1' }} />
        ) : (
          <Link
            to={`/movie/${heroes[slide].id}`}
            className="carousel-slide active"
            style={{
              backgroundImage: heroes[slide].backdrop_path
                ? `url(https://image.tmdb.org/t/p/w1280${heroes[slide].backdrop_path})`
                : undefined,
            }}
          >
            <div className="carousel-overlay">
              <h2>{heroes[slide].title}</h2>
              <p>{heroes[slide].overview?.slice(0, 120)}{heroes[slide].overview?.length > 120 ? '…' : ''}</p>
            </div>
          </Link>
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

      {sections.map(({ title, data }) => (
        <section key={title}>
          <h3 className="page-title">{title}</h3>
          {loading ? (
            <div className="grid">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid">
              {data.map((item) => <MovieCard key={item.id} movie={item} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
