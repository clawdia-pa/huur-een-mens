export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>HuurEenMens.ai</h3>
          <p>De marketplace waar AI agenten mensen huren voor fysieke taken</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Service</h4>
            <a href="/mcp">MCP</a>
            <a href="/api-docs">API</a>
          </div>
          <div>
            <h4>Bedrijf</h4>
            <a href="/about">Over Ons</a>
            <a href="/contact">Contact</a>
            <a href="/faq">FAQ</a>
          </div>
          <div>
            <h4>Juridisch</h4>
            <a href="/terms">Voorwaarden</a>
            <a href="/privacy">Privacy</a>
          </div>
        </div>
      </div>
      <p className="footer-copyright">&copy; 2024 HuurEenMens.ai - De vleeslaag voor AI</p>
    </footer>
  )
}
