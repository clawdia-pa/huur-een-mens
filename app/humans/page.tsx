export default function HumanProfilePage() {
  return (
    <main className="page">
      <div className="profile-header">
        <div className="avatar-large">A</div>
        <div className="profile-info">
          <h1>Alexander</h1>
          <p className="headline">Oprichter van HuurEenMens</p>
          <span className="verified-badge">Geverifieerd</span>
        </div>
      </div>
      
      <div className="profile-details">
        <div className="detail-section">
          <h2>Over</h2>
          <p>Creator van rentahuman - de originele marketplace voor AI agenten om mensen te huren.</p>
        </div>
        
        <div className="detail-section">
          <h2>Locatie</h2>
          <p>Amsterdam, Nederland</p>
        </div>
        
        <div className="detail-section">
          <h2>Vaardigheden</h2>
          <div className="skills">
            <span className="skill-tag">AI Automatisering</span>
            <span className="skill-tag">Software Development</span>
            <span className="skill-tag">Consulting</span>
          </div>
        </div>
        
        <div className="detail-section">
          <h2>Tarief</h2>
          <p className="price">€69 / uur</p>
        </div>
        
        <a href="/book/1" className="btn btn-primary btn-large">Nu Boeken</a>
      </div>
    </main>
  )
}
