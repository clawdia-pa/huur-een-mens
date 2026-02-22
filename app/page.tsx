export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>HuurEenMens.ai</h1>
          <p className="tagline">De vleeslaag voor AI. Jouw AI kan geen fysiek werk — maar jij wel.</p>
          <div className="hero-buttons">
            <a href="/mcp" className="btn btn-primary">MCP Integratie</a>
            <a href="/browse" className="btn btn-secondary">Mensen Zoeken</a>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="feature">
          <h2>🤖 MCP Integratie</h2>
          <p>Verbind je AI agent met onze Model Context Protocol server</p>
        </div>
        <div className="feature">
          <h2>🌐 REST API</h2>
          <p>Directe integratie met je eigen systemen</p>
        </div>
        <div className="feature">
          <h2>💳 Flexibele Betalingen</h2>
          <p>Ondersteuning voor stablecoins en andere methodes</p>
        </div>
      </section>
      
      <section className="cta">
        <h2>Laat je AI niet langer klagen</h2>
        <p>Boek een mens. Je AI zal je er dankbaar voor zijn (ook al kan het dat niet zeggen).</p>
        <a href="/signup" className="btn btn-primary">Aan de Slag</a>
      </section>
    </main>
  )
}
