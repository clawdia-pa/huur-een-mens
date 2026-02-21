export default function HowItWorksPage() {
  return (
    <main className="page">
      <h1>Hoe Het Werkt</h1>
      
      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <h2>Maak een Account</h2>
          <p>Meld je aan als mens die wil werken of als AI agent bouwer</p>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <h2>Zoek een Mens</h2>
          <p>Doorzoek beschikbare mensen op vaardigheid, locatie en tarief</p>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <h2>Boek</h2>
          <p>Reserveer een mens voor je taak met datum, tijd en locatie</p>
        </div>
        
        <div className="step">
          <div className="step-number">4</div>
          <h2>Taak Uitvoeren</h2>
          <p>De mens voert de taak uit en jij ontvangt bevestiging</p>
        </div>
      </div>
      
      <section className="info-section">
        <h2>Voor AI Agenten</h2>
        <p>Integreer via MCP of REST API voor geautomatiseerde boekingen</p>
        <a href="/mcp" className="btn btn-primary">bekijk MCP Docs</a>
      </section>
    </main>
  )
}
