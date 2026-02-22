'use client';

import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo">HuurEenMens.ai</a>
        <nav className="nav">
          <a href="/browse">Mensen Zoeken</a>
          <a href="/how-it-works">Hoe het werkt</a>
          <a href="/pricing">Prijzen</a>
          <a href="/mcp">MCP</a>
          <a href="/api-docs">API</a>
          {user ? (
            <>
              <a href="/dashboard">Dashboard</a>
              <a href="/profile">Profiel</a>
              <button onClick={logout} className="btn btn-secondary">Uitloggen</button>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn-secondary">Inloggen</a>
              <a href="/signup" className="btn btn-primary">Aanmelden</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
