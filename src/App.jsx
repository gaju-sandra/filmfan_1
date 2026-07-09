import './App.css'
import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Favourites from './pages/Favourites.jsx'
import Genres from './pages/Genres.jsx'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import BrowsePage from './components/BrowsePage.jsx'
import NotFound from './pages/NotFound.jsx'
import tmdb from './services/tmdb.js'

const BROWSE_ROUTES = [
  { path: '/top-rated',    title: 'Top Rated',       fetchFn: (p) => tmdb.getTopRated(p) },
  { path: '/series',       title: 'Popular Series',  fetchFn: (p) => tmdb.getPopularSeries(p) },
  { path: '/anime',        title: 'Anime',           fetchFn: (p) => tmdb.getAnime(p) },
  { path: '/tv-shows',     title: 'TV Shows',        fetchFn: (p) => tmdb.getTvShows(p) },
  { path: '/live', title: 'In Cinemas', fetchFn: (p) => tmdb.getNowPlaying(p) },
  { path: '/coming-soon',  title: 'Coming Soon',     fetchFn: (p) => tmdb.getUpcoming(p) },
]

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-body">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            {BROWSE_ROUTES.map(({ path, title, fetchFn }) => (
              <Route
                key={path}
                path={path}
                element={<BrowsePage title={title} fetchFn={fetchFn} />}
              />
            ))}
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
