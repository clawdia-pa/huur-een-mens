'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <h1>Inloggen</h1>
      <p>Welkom terug</p>
      {error && <div className="error-message">{error}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jouw@email.nl" required />
        </div>
        <div className="form-group">
          <label>Wachtwoord</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Wachtwoord" required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Bezig...' : 'Inloggen'}
        </button>
        <p className="form-footer">Nog geen account? <a href="/signup">Aanmelden</a></p>
      </form>
    </main>
  )
}
