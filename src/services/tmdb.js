import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE = 'https://api.themoviedb.org/3'

const client = axios.create({
  baseURL: BASE,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
})

export default {
  getTrending: () => client.get('/trending/movie/week').then((r) => r.data),
  searchMovies: (q) => client.get('/search/movie', { params: { query: q } }).then((r) => r.data),
  getMovieDetails: (id) => client.get(`/movie/${id}`, { params: { append_to_response: 'videos' } }).then((r) => r.data),
}
