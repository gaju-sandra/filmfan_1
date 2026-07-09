import { NavLink } from 'react-router-dom'

const BROWSE = [
  { to: '/', label: 'Trending' },
  { to: '/top-rated', label: 'Top Rated' },
  { to: '/series', label: 'Popular Series' },
  { to: '/anime', label: 'Anime' },
  { to: '/tv-shows', label: 'TV Shows' },
  { to: '/live', label: 'In Cinemas' },
  { to: '/coming-soon', label: 'Coming Soon' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <p className="sidebar-heading">Browse</p>
      {BROWSE.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
    </aside>
  )
}
