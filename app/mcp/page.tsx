export default function MCPPage() {
  return (
    <main className="page">
      <h1>MCP Integratie</h1>
      <p>Verbind je AI agent met HuurEenMens via het Model Context Protocol</p>

      <section className="code-section">
        <h2>Configuratie</h2>
        <p>Voeg het volgende toe aan je MCP client configuratie (bijv. Claude Desktop):</p>
        <pre><code>{`{
  "mcpServers": {
    "huur-een-mens": {
      "command": "node",
      "args": ["/pad/naar/huur-een-mens/mcp-server/build/index.js"],
      "env": {
        "HUUR_EEN_MENS_API_URL": "https://huur-een-mens.vercel.app",
        "HUUR_EEN_MENS_API_TOKEN": "<jouw-jwt-token>"
      }
    }
  }
}`}</code></pre>
      </section>

      <section className="code-section">
        <h2>Installatie</h2>
        <pre><code>{`cd mcp-server
npm install
npm run build`}</code></pre>
        <p>Genereer een JWT token door in te loggen via de API:</p>
        <pre><code>{`curl -X POST https://huur-een-mens.vercel.app/api/auth \\
  -H "Content-Type: application/json" \\
  -d '{"action":"login","email":"je@email.nl","password":"wachtwoord"}'`}</code></pre>
      </section>

      <section>
        <h2>Beschikbare Tools (6)</h2>
        <ul>
          <li><strong>search_humans</strong> - Zoek beschikbare mensen. Filter op vaardigheid, stad, of uurtarief.</li>
          <li><strong>get_human</strong> - Bekijk het volledige profiel van een mens op basis van ID.</li>
          <li><strong>list_skills</strong> - Bekijk alle beschikbare vaardigheden en categorieën.</li>
          <li><strong>book_human</strong> - Boek een mens voor een fysieke taak. Vereist authenticatie.</li>
          <li><strong>get_bookings</strong> - Bekijk alle boekingen. Filter op status.</li>
          <li><strong>update_booking</strong> - Update de status van een boeking (bevestig, voltooi, annuleer).</li>
        </ul>
      </section>
    </main>
  )
}
