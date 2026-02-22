'use client';

import { useState, useEffect } from 'react';

interface Human {
  id: string;
  name: string;
  headline: string;
  location_city: string;
  hourly_rate: number;
  is_verified: number;
  skills: any[];
}

export default function BrowsePage() {
  const [humans, setHumans] = useState<Human[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => { if (data.success) setHumans(data.humans); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <h1>Mensen Zoeken</h1>
      {loading ? <p>Laden...</p> : (
        <div className="humans-grid">
          {humans.map(human => (
            <div key={human.id} className="human-card">
              <div className="human-avatar">{human.name.charAt(0)}</div>
              <h3>{human.name}</h3>
              <p className="human-headline">{human.headline}</p>
              <p className="human-location">📍 {human.location_city}</p>
              <p className="human-rate">€{human.hourly_rate}/uur</p>
              {human.is_verified === 1 && <span className="verified-badge">✓ Geverifieerd</span>}
              <a href={'/humans/' + human.id} className="btn btn-primary">Bekijk Profiel</a>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
