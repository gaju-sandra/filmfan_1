import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Header from './components/Header.jsx'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
