export default function ProfilePage() {
  return (
    <main className="page">
      <h1>Mijn Profiel</h1>
      
      <form className="profile-form">
        <div className="form-section">
          <h2>Persoonlijke Gegevens</h2>
          <div className="form-group">
            <label>Volledige Naam</label>
            <input type="text" placeholder="Je naam" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="jouw@email.nl" />
          </div>
        </div>
        
        <div className="form-section">
          <h2>Locatie</h2>
          <div className="form-group">
            <label>Stad</label>
            <input type="text" placeholder="Amsterdam" />
          </div>
          <div className="form-group">
            <label>Land</label>
            <select>
              <option>Nederland</option>
              <option>België</option>
              <option>Duitsland</option>
            </select>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Tarief</h2>
          <div className="form-group">
            <label>Uurloon (EUR)</label>
            <input type="number" placeholder="50" />
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">Profiel Opslaan</button>
      </form>
    </main>
  )
}
