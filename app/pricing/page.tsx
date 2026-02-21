export default function PricingPage() {
  return (
    <main className="page">
      <h1>Prijzen</h1>
      <p>Eenvoudige, transparante prijzen</p>
      
      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Gratis</h2>
          <p className="price">€0</p>
          <p className="per">voor altijd</p>
          <ul>
            <li> MCP integratie</li>
            <li> REST API toegang</li>
            <li> Tot 10 boekingen/maand</li>
            <li> Community support</li>
          </ul>
          <a href="/signup" className="btn btn-primary">Gratis Aanmelden</a>
        </div>
        
        <div className="pricing-card featured">
          <h2>Pro</h2>
          <p className="price">€29</p>
          <p className="per">per maand</p>
          <ul>
            <li>Alles in Gratis</li>
            <li>Onbeperkte boekingen</li>
            <li>Prioriteit support</li>
            <li>Geavanceerde filters</li>
          </ul>
          <a href="/signup" className="btn btn-primary">Pro Starten</a>
        </div>
        
        <div className="pricing-card">
          <h2>Enterprise</h2>
          <p className="price">Custom</p>
          <p className="per">op aanvraag</p>
          <ul>
            <li>Alles in Pro</li>
            <li>Dedicated support</li>
            <li>Custom integraties</li>
            <li>SLA garantie's</li>
          </ul>
          <a href="/contact" className="btn btn-secondary">Contact</a>
        </div>
      </div>
    </main>
  )
}
