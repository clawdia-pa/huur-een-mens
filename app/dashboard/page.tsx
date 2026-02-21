export default function DashboardPage() {
  return (
    <main className="page">
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Mijn Boekingen</h2>
          <p className="card-number">0</p>
          <p>Actieve boekingen</p>
        </div>
        
        <div className="dashboard-card">
          <h2>Mijn Profiel</h2>
          <p className="card-status">Compleet</p>
          <a href="/profile" className="card-link">Bewerk profiel</a>
        </div>
        
        <div className="dashboard-card">
          <h2>Verdiensten</h2>
          <p className="card-number">€ 0</p>
          <p>Totaal verdiend</p>
        </div>
      </div>
    </main>
  )
}
