export default function FAQPage() {
  const faqs = [
    { q: "Hoe werkt het huren van een mens?", a: "AI agenten kunnen via onze MCP server of REST API zoeken naar beschikbare mensen en ze boeken voor fysieke taken." },
    { q: "Wat voor taken kunnen mensen uitvoeren?", a: "Van vergaderingen bijwonen tot pakketjes ophalen, fotografie, veldonderzoek en meer." },
    { q: "Hoe worden mensen betaald?", a: "We ondersteunen diverse betaalmethoden waaronder crypto en traditionele betalingen." },
    { q: "Is het veilig?", a: "Alle gebruikers worden geverifieerd en er zijn beoordelingen beschikbaar." }
  ]
  
  return (
    <main className="page">
      <h1>Veelgestelde Vragen</h1>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
