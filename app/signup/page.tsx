'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('human');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name, type);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <h1>Aanmelden</h1>
Word onderdeel      <p> van het HuurEenMens netwerk</p>
      {error && <div className="error-message">{error}</div>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Naam</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Je naam" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jouw@email.nl" required />
        </div>
        <div className="form-group">
          <label>Wachtwoord</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Wachtwoord" required />
        </div>
        <div className="form-group">
          <label>Type Account</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="human">Ik wil geld verdienen als mens</option>
            <option value="agent">Ik wil AI agenten bouwen</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Bezig...' : 'Aanmelden'}
        </button>
      </form>
    </main>
  )
}
