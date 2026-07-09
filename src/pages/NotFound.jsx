import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="message-box" style={{ textAlign: 'center', padding: '60px 24px' }}>
      <h1 style={{ fontSize: '4rem', margin: '0 0 8px' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Oops! Page not found.</p>
      <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        Back to Home
      </Link>
    </div>
  )
}
