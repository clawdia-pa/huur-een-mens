'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface Human {
  id: string;
  name: string;
  headline: string;
  hourly_rate: number;
}

function BookingForm() {
  const searchParams = useSearchParams();
  const humanId = searchParams.get('human');
  const { user, token } = useAuth();

  const [human, setHuman] = useState<Human | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [taskLocation, setTaskLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!humanId) { setLoading(false); return; }
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.humans.find((h: Human) => h.id === humanId);
          setHuman(found || null);
        }
      })
      .finally(() => setLoading(false));
  }, [humanId]);

  const totalPrice = human ? human.hourly_rate * durationHours : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!user || !token) {
      setError('Je moet ingelogd zijn om te boeken. Ga naar Inloggen.');
      return;
    }

    if (!human) {
      setError('Geen mens geselecteerd.');
      return;
    }

    if (!taskDescription || !taskDate || !taskTime || !taskLocation) {
      setError('Vul alle velden in.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          human_id: human.id,
          task_description: taskDescription,
          task_location: taskLocation,
          task_date: taskDate,
          task_time: taskTime,
          duration_hours: durationHours,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Er ging iets mis bij het boeken.');
      }
    } catch (err: any) {
      setError('Netwerkfout. Probeer het opnieuw.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <main className="page"><p>Laden...</p></main>;

  if (!humanId || !human) {
    return (
      <main className="page">
        <h1>Geen mens geselecteerd</h1>
        <p>Ga naar <a href="/browse">Mensen Zoeken</a> om iemand te kiezen.</p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="page">
        <h1>✓ Boeking Bevestigd!</h1>
        <p>Je hebt <strong>{human.name}</strong> geboekt voor {taskDate} om {taskTime}.</p>
        <p>Totaalprijs: <strong>€{totalPrice.toFixed(2)}</strong></p>
        <div className="hero-buttons" style={{ marginTop: '2rem' }}>
          <a href="/dashboard" className="btn btn-primary">Naar Dashboard</a>
          <a href="/browse" className="btn btn-secondary">Meer Mensen Zoeken</a>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <h1>Boek {human.name}</h1>
      <p>{human.headline}</p>

      {error && <div className="error-message" style={{ color: '#e53e3e', background: '#fed7d7', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>{error}</div>}

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Taak Beschrijving</label>
          <textarea rows={4} placeholder="Beschrijf de taak..." value={taskDescription} onChange={e => setTaskDescription(e.target.value)} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Datum</label>
            <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Tijd</label>
            <input type="time" value={taskTime} onChange={e => setTaskTime(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label>Duur (uren)</label>
          <input type="number" min="1" value={durationHours} onChange={e => setDurationHours(parseInt(e.target.value) || 1)} required />
        </div>

        <div className="form-group">
          <label>Locatie</label>
          <input type="text" placeholder="Adres of locatie" value={taskLocation} onChange={e => setTaskLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Opmerkingen (optioneel)</label>
          <textarea rows={2} placeholder="Extra informatie..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <div className="price-summary">
          <p>Verwachte totaalprijs:</p>
          <p className="total-price">€ {totalPrice.toFixed(2)}</p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>({durationHours} uur × €{human.hourly_rate}/uur)</p>
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
          {submitting ? 'Bezig met boeken...' : 'Bevestig Boeking'}
        </button>
      </form>
    </main>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<main className="page"><p>Laden...</p></main>}>
      <BookingForm />
    </Suspense>
  );
}
