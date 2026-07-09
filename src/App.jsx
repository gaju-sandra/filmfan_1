import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Favourites from './pages/Favourites.jsx'
import Genres from './pages/Genres.jsx'
import About from './pages/About.jsx'
import Header from './components/Header.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
