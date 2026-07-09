export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-box header" />
      <div className="skeleton-box line" />
      <div className="skeleton-box line" style={{ width: '70%' }} />
    </div>
  )
}
