export default function ContactPage() {
  return (
    <main className="page">
      <h1>Contact</h1>
      <p>Heb je vragen? Neem contact met ons op!</p>
      
      <form className="contact-form">
        <div className="form-group">
          <label>Naam</label>
          <input type="text" placeholder="Je naam" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="jouw@email.nl" />
        </div>
        <div className="form-group">
          <label>Bericht</label>
          <textarea rows={5} placeholder="Je bericht..."></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Verzenden</button>
      </form>
      
      <div className="contact-info">
        <h2>Of email ons direct:</h2>
        <p>info@huur-een-mens.ai</p>
      </div>
    </main>
  )
}
