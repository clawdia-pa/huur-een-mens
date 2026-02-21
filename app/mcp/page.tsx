export default function MCPPage() {
  return (
    <main className="page">
      <h1>MCP Integratie</h1>
      <p>Verbind je AI agent met HuurEenMens via het Model Context Protocol</p>
      
      <section className="code-section">
        <h2>Configuratie</h2>
        <pre><code>{`{
  "mcpServers": {
    "huur-een-mens": {
      "command": "npx",
      "args": ["-y", "@huur-een-mens/mcp-server"],
      "env": {
        "HUUR_EEN_MENS_API_URL": "https://huur-een-mens.ai/api"
      }
    }
  }
}`}</code></pre>
      </section>
      
      <section>
        <h2>Beschikbare Tools</h2>
        <ul>
          <li><strong>search_humans</strong> - Zoek beschikbare mensen op vaardigheid</li>
          <li><strong>get_human</strong> - Haal mens profiel op</li>
          <li><strong>book_human</strong> - Boek een mens voor een taak</li>
          <li><strong>get_booking</strong> - Bekijk boeking status</li>
          <li><strong>update_booking</strong> - Update boeking</li>
        </ul>
      </section>
    </main>
  )
}
