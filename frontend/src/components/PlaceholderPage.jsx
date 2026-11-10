
function PlaceholderPage({ title, description }) {
  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <span className="demo-badge">DEVELOPMENT</span>
      </div>

      <div className="stat-card">
        <h2>{title}</h2>
        <p>This module will be implemented in the next development steps.</p>
      </div>
    </div>
  )
}

export default PlaceholderPage
