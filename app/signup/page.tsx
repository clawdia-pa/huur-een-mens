export default function SignupPage() {
  return (
    <main className="page">
      <h1>Aanmelden</h1>
      <p>Word onderdeel van het HuurEenMens netwerk</p>
      
      <form className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="jouw@email.nl" />
        </div>
        
        <div className="form-group">
          <label htmlFor="name">Naam</label>
          <input type="text" id="name" placeholder="Je naam" />
        </div>
        
        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type">
            <option value="">Kies type...</option>
            <option value="human">Ik wil geld verdienen als mens</option>
            <option value="agent">Ik wil AI agenten bouwen</option>
          </select>
        </div>
        
        <button type="submit" className="btn btn-primary">Aanmelden</button>
      </form>
    </main>
  )
}
