export default function BookPage() {
  return (
    <main className="page">
      <h1>Boek een Mens</h1>
      <p>Reserveer iemand voor je fysieke taak</p>
      
      <form className="booking-form">
        <div className="form-group">
          <label>Taak Beschrijving</label>
          <textarea rows={4} placeholder="Beschrijf de taak..."></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Datum</label>
            <input type="date" />
          </div>
          <div className="form-group">
            <label>Tijd</label>
            <input type="time" />
          </div>
        </div>
        
        <div className="form-group">
          <label>Duur (uren)</label>
          <input type="number" min="1" defaultValue="1" />
        </div>
        
        <div className="form-group">
          <label>Locatie</label>
          <input type="text" placeholder="Adres of locatie" />
        </div>
        
        <div className="price-summary">
          <p>Verwachte totaalprijs:</p>
          <p className="total-price">€ 69,00</p>
        </div>
        
        <button type="submit" className="btn btn-primary btn-large">Bevestig Boeking</button>
      </form>
    </main>
  )
}
