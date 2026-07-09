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
  getNowPlaying: (page = 1) => client.get('/movie/now_playing', { params: { page } }).then((r) => r.data),
  getTrending: (page = 1) => client.get('/trending/movie/week', { params: { page } }).then((r) => r.data),
  getTopRated: (page = 1) => client.get('/movie/top_rated', { params: { page } }).then((r) => r.data),
  getPopularSeries: (page = 1) => client.get('/trending/tv/week', { params: { page } }).then((r) => r.data),
  getAnime: (page = 1) => client.get('/discover/movie', { params: { with_genres: 16, with_origin_country: 'JP', page } }).then((r) => r.data),
  getTvShows: (page = 1) => client.get('/tv/popular', { params: { page } }).then((r) => r.data),
  getUpcoming: async (page = 1) => {
    const today = new Date().toISOString().slice(0, 10)
    // fetch two API pages to ensure we have enough after filtering
    const [r1, r2] = await Promise.all([
      client.get('/movie/upcoming', { params: { page: page * 2 - 1 } }),
      client.get('/movie/upcoming', { params: { page: page * 2 } }),
    ])
    const combined = [...(r1.data.results || []), ...(r2.data.results || [])]
    const filtered = combined
      .filter((m) => m.release_date > today)
      .sort((a, b) => a.release_date.localeCompare(b.release_date))
    const start = 0
    return { ...r1.data, results: filtered.slice(start, 10), total_pages: 4 }
  },
  getByGenre: (genreId) => client.get('/discover/movie', { params: { with_genres: genreId, sort_by: 'popularity.desc' } }).then((r) => r.data),
  searchMovies: (q) => client.get('/search/movie', { params: { query: q } }).then((r) => r.data),
  getMovieDetails: (id) => client.get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } }).then((r) => r.data),
  getRecommendations: (id) => client.get(`/movie/${id}/recommendations`).then((r) => r.data),
  createGuestSession: () => client.get('/authentication/guest_session/new').then((r) => r.data),
  rateMovie: (id, rating, guestSessionId) => client.post(`/movie/${id}/rating`, { value: rating }, { params: { guest_session_id: guestSessionId } }).then((r) => r.data),
}
