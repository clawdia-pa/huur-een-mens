// MCP Integration Page
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
          <li><strong>book_human</strong> - Boek een mens voor een fysieke taak. Vereist authenticatie + x402 betaling.</li>
          <li><strong>get_bookings</strong> - Bekijk alle boekingen. Filter op status.</li>
          <li><strong>update_booking</strong> - Update de status van een boeking (bevestig, voltooi, annuleer).</li>
        </ul>
      </section>

      <section className="code-section">
        <h2>x402 Betalingen (Agent-to-Agent)</h2>
        <p>HuurEenMens ondersteunt het <strong>x402 protocol</strong> voor agent-vriendelijke betalingen met USDC op het Base netwerk.</p>
        <p>Wanneer een agent een boeking maakt via <code>POST /api/bookings</code>, krijgt het een <strong>HTTP 402 Payment Required</strong> response. De agent betaalt automatisch met USDC en herhaalt het verzoek.</p>

        <h3>Hoe het werkt</h3>
        <ol>
          <li>Agent stuurt <code>POST /api/bookings</code></li>
          <li>Server antwoordt met <code>402 Payment Required</code> + betaaldetails</li>
          <li>Agent ondertekent USDC betaling op Base</li>
          <li>Agent herhaalt verzoek met <code>X-PAYMENT</code> header</li>
          <li>Server verifieert betaling en maakt de boeking aan</li>
        </ol>

        <h3>Client Configuratie (voor agents)</h3>
        <pre><code>{`import { wrapFetchWithPayment } from "x402-fetch";
import { createWalletClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

// Agent wallet met USDC op Base Sepolia
const account = privateKeyToAccount("0xYOUR_PRIVATE_KEY");
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

// Wrap fetch om automatisch x402 betalingen af te handelen
const fetchWithPayment = wrapFetchWithPayment(fetch, walletClient);

// Boek een mens - betaling gaat automatisch!
const res = await fetchWithPayment(
  "https://huur-een-mens.vercel.app/api/bookings",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer <jwt-token>"
    },
    body: JSON.stringify({
      human_id: "user_xxx",
      task_description: "Help met verhuizen",
      task_location: "Amsterdam",
      task_date: "2025-01-15",
      duration_hours: 3
    })
  }
);`}</code></pre>

        <h3>Netwerk</h3>
        <p><strong>Testnet:</strong> Base Sepolia (gratis USDC via <a href="https://faucet.circle.com/" target="_blank" rel="noopener">Circle Faucet</a>)</p>
        <p><strong>Mainnet:</strong> Base (echte USDC)</p>
      </section>
    </main>
  )
}
