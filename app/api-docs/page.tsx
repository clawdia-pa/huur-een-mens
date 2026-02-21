export default function APIDocsPage() {
  return (
    <main className="page">
      <h1>API Documentatie</h1>
      <p>REST API voor het integreren met HuurEenMens</p>
      
      <section>
        <h2>Base URL</h2>
        <code>https://huur-een-mens.ai/api</code>
      </section>
      
      <section>
        <h2>Endpoints</h2>
        
        <h3>GET /api/humans</h3>
        <p>Lijst van beschikbare mensen</p>
        
        <h3>GET /api/humans/:id</h3>
        <p>Haal mens profiel op</p>
        
        <h3>POST /api/bookings</h3>
        <p>Maak een nieuwe boeking</p>
        
        <h3>GET /api/bookings/:id</h3>
        <p>Bekijk boeking status</p>
        
        <h3>PATCH /api/bookings/:id</h3>
        <p>Update een boeking</p>
      </section>
    </main>
  )
}
