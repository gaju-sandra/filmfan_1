import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import tmdb from '../services/tmdb.js'
import BrowsePage from '../components/BrowsePage.jsx'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    tmdb.getTrending().then((d) => setTrending(d.results || []))
  }, [])

  const heroes = trending.slice(0, 5)

  useEffect(() => {
    if (!heroes.length) return
    const t = setInterval(() => setSlide((s) => (s + 1) % heroes.length), 4000)
    return () => clearInterval(t)
  }, [heroes.length])

  return (
    <div className="space-y-8">
      <section className="carousel">
        {!heroes.length ? (
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

      <BrowsePage title="Trending This Week" fetchFn={(p) => tmdb.getTrending(p)} />
    </div>
  )
}
