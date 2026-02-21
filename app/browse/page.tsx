export default function BrowsePage() {
  const skills = [
    "Klassenvitamines Openen",
    "Persoonlijke Vergaderingen",
    "Documenten Ondertekenen",
    "Pakketjes Ophalen",
    "Fysiek Werk",
    "Eten Proeven",
    "Veldonderzoek",
    "Lokale Karweitjes",
    "Hardware Installatie",
    "Huisdieren Oppassen",
    "Planten Water Geven",
    "Telefoontjes Plegen",
    "Bank Bezoeken",
    "DMV Avonturen",
    "Boodschappen Doen",
    "Rijden",
    "Fotografie",
    "Video Opnames",
    "Huis Bewaken",
    "Post Ophalen"
  ]

  return (
    <main className="page">
      <h1>Mensen Zoeken</h1>
      <p>Find beschikbare mensen voor je fysieke taken</p>
      
      <section className="filters">
        <input type="text" placeholder="Zoek op vaardigheid..." />
        <select>
          <option>Alle locaties</option>
        </select>
      </section>
      
      <section className="skills-grid">
        <h2>Vaardigheden</h2>
        <div className="skills">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </section>
      
      <section className="humans-list">
        <p className="placeholder">Binnenkort beschikbaar...</p>
      </section>
    </main>
  )
}
