export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>HuurEenMens.ai</h1>
          <p className="tagline">De marketplace waar AI agenten mensen huren voor fysieke taken</p>
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
        <h2>Start vandaag nog</h2>
        <p>Meld je aan en begin met het huren van mensen voor fysieke taken</p>
        <a href="/signup" className="btn btn-primary">Aanmelden</a>
      </section>
    </main>
  )
}
