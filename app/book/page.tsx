'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { createWalletClient, custom } from 'viem';
import { baseSepolia } from 'viem/chains';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { wrapFetchWithPayment } from 'x402-fetch';

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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState('');

  const [taskDescription, setTaskDescription] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [taskLocation, setTaskLocation] = useState('');
  const [notes, setNotes] = useState('');

  const providerRef = useRef<any>(null);
  const walletClientRef = useRef<any>(null);

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

  async function connectWallet() {
    setError('');
    setWalletStatus('Wallet verbinden...');
    try {
      const sdk = new CoinbaseWalletSDK({
        appName: 'HuurEenMens',
      });

      const provider = sdk.makeWeb3Provider();
      providerRef.current = provider;

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('Geen account gevonden');
      }

      const address = accounts[0];
      setWalletAddress(address);

      const client = createWalletClient({
        account: address as `0x${string}`,
        chain: baseSepolia,
        transport: custom(provider),
      });
      walletClientRef.current = client;

      setWalletStatus('Verbonden');
    } catch (err: any) {
      setError(err.message || 'Kon wallet niet verbinden.');
      setWalletStatus('');
    }
  }

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

    if (!walletClientRef.current) {
      setError('Verbind eerst je wallet om te betalen.');
      return;
    }

    setSubmitting(true);
    try {
      const fetchWithPayment = wrapFetchWithPayment(
        fetch as any,
        walletClientRef.current as any,
      );

      const res = await fetchWithPayment('/api/bookings', {
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
      setError(err.message || 'Betaling of boeking mislukt. Probeer het opnieuw.');
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
        <h1>Boeking Bevestigd!</h1>
        <p>Je hebt <strong>{human.name}</strong> geboekt voor {taskDate} om {taskTime}.</p>
        <p>Betaald met USDC via je wallet.</p>
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

      <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '0.5rem', background: walletAddress ? '#c6f6d5' : '#e2e8f0' }}>
        {walletAddress ? (
          <p style={{ margin: 0 }}>
            Wallet verbonden: <code>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</code>
          </p>
        ) : (
          <div>
            <p style={{ margin: '0 0 0.5rem 0' }}>Verbind je wallet om te betalen met USDC op Base</p>
            <button type="button" onClick={connectWallet} className="btn btn-secondary" disabled={walletStatus === 'Wallet verbinden...'}>
              {walletStatus || 'Verbind Coinbase Wallet'}
            </button>
          </div>
        )}
      </div>

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
          <p>Totaalprijs:</p>
          <p className="total-price">$1.00 USDC</p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>Betaling via Base netwerk</p>
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={submitting || !walletAddress}>
          {submitting ? 'Betaling verwerken...' : 'Betaal & Bevestig Boeking'}
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
