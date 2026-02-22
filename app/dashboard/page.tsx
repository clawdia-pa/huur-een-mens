'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch('/api/bookings', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(res => res.json())
      .then(data => { if (data.success) setBookings(data.bookings); })
      .finally(() => setLoading(false));
  }, [token, router]);

  if (!token) return null;

  return (
    <main className="page">
      <h1>Dashboard</h1>
      <p>Welkom terug, {user?.name}!</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Mijn Boekingen</h2>
          <p className="card-number">{bookings.length}</p>
        </div>
        <div className="dashboard-card">
          <h2>Profiel</h2>
          <p className="card-status">{user?.headline ? 'Compleet' : 'Incompleet'}</p>
          <a href="/profile" className="card-link">Bewerk profiel</a>
        </div>
      </div>
    </main>
  )
}
