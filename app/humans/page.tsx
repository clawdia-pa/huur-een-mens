'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Human {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location_city: string;
  location_country: string;
  hourly_rate: number;
  is_verified: number;
  skills: any[];
}

function HumanContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [human, setHuman] = useState<Human | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.humans.find((h: Human) => h.id === id);
          setHuman(found || null);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="page"><p>Laden...</p></main>;
  if (!human) return <main className="page"><h1>Mens niet gevonden</h1></main>;

  return (
    <main className="page">
      <div className="profile-header">
        <div className="avatar-large">{human.name.charAt(0)}</div>
        <div className="profile-info">
          <h1>{human.name}</h1>
          <p className="headline">{human.headline}</p>
          {human.is_verified === 1 && <span className="verified-badge">✓ Geverifieerd</span>}
        </div>
      </div>
      <div className="profile-details">
        <div className="detail-section">
          <h2>Over</h2>
          <p>{human.bio || 'Geen bio beschikbaar'}</p>
        </div>
        <div className="detail-section">
          <h2>Locatie</h2>
          <p>{human.location_city}, {human.location_country}</p>
        </div>
        <div className="detail-section">
          <h2>Vaardigheden</h2>
          <div className="skills">
            {human.skills?.map((s: any) => (
              <span key={s.id} className="skill-tag">{s.name}</span>
            )) || <p>Geen vaardigheden</p>}
          </div>
        </div>
        <div className="detail-section">
          <h2>Tarief</h2>
          <p className="price">€{human.hourly_rate}/uur</p>
        </div>
        <a href={'/book?human=' + human.id} className="btn btn-primary btn-large">Nu Boeken</a>
      </div>
    </main>
  )
}

export default function HumanDetailPage() {
  return (
    <Suspense fallback={<main className="page"><p>Laden...</p></main>}>
      <HumanContent />
    </Suspense>
  );
}
