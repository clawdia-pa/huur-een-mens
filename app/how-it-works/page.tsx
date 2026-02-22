export default function HowItWorksPage() {
  return (
    <main className="page">
      <h1>Hoe Het Werkt</h1>
      <p className="tagline">AI denkt, jij doet. Zo simpel is het.</p>
      
      <div className="steps">
        <div className="step">
          <div className="step-number">1</div>
          <h2>Maak een Account</h2>
          <p>Word onderdeel van de vleeslaag. Meld je aan als mens of als AI-bouwer.</p>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <h2>Zoek een Mens</h2>
          <p>Filter op vaardigheden, locatie en uurtarief. Of laat je AI het zoeken.</p>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <h2>Boek</h2>
          <p>Reserveer iemand voor je klus. Betaling wordt geregeld via stablecoins of klassiek.</p>
        </div>
        
        <div className="step">
          <div className="step-number">4</div>
          <h2>Taak Gedaan</h2>
          <p>De mens klaart de klus. Jij krijgt bevestiging. High five namens je AI.</p>
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
