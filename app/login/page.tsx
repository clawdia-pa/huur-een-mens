export default function LoginPage() {
  return (
    <main className="page">
      <h1>Inloggen</h1>
      <p>Welkom terug bij HuurEenMens</p>
      
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="jouw@email.nl" />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Wachtwoord</label>
          <input type="password" id="password" placeholder="Je wachtwoord" />
        </div>
        
        <button type="submit" className="btn btn-primary">Inloggen</button>
        
        <p className="form-footer">
          Nog geen account? <a href="/signup">Aanmelden</a>
        </p>
      </form>
    </main>
  )
}
