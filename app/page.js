'use client';

import { useEffect, useState } from 'react';
import {
  USERS,
  editionDateForIndex,
  toISODate,
  formatEditionLabel,
  getUpcomingIndex,
} from '../lib/dates';
import EditionTicket from '../components/EditionTicket';

const STORAGE_KEY = 'huisbioscoop_user';

export default function Home() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && USERS.includes(saved)) setUser(saved);
    setReady(true);
  }, []);

  function chooseUser(name) {
    setUser(name);
    window.localStorage.setItem(STORAGE_KEY, name);
  }

  function switchSeat() {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  if (!ready) return null;

  if (!user) {
    return (
      <main className="seat-screen">
        <div className="marquee">
          <span className="marquee-eyebrow">Elke twee weken · donderdag</span>
          <h1>Huisbioscoop</h1>
          <p className="marquee-sub">Kies je stoel om te beginnen</p>
        </div>
        <div className="seats">
          {USERS.map((name) => (
            <button key={name} type="button" className="seat" onClick={() => chooseUser(name)}>
              {name}
            </button>
          ))}
        </div>
      </main>
    );
  }

  const baseIndex = getUpcomingIndex();
  const index = baseIndex + offset;
  const date = editionDateForIndex(index);
  const iso = toISODate(date);
  const label = formatEditionLabel(date);

  let navLabel = 'Eerstvolgende editie';
  if (offset > 0) navLabel = `${offset} editie${offset > 1 ? 's' : ''} later`;
  if (offset < 0) navLabel = `${Math.abs(offset)} editie${Math.abs(offset) > 1 ? 's' : ''} terug`;

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">Huisbioscoop</div>
        <div className="whoami">
          Ingelogd als <strong>{user}</strong>
          <button type="button" className="link-btn" onClick={switchSeat}>
            wissel
          </button>
        </div>
      </header>

      <nav className="edition-nav">
        <button type="button" onClick={() => setOffset(offset - 1)} aria-label="Vorige editie">
          ‹
        </button>
        <span className="edition-nav-label">{navLabel}</span>
        <button type="button" onClick={() => setOffset(offset + 1)} aria-label="Volgende editie">
          ›
        </button>
      </nav>

      <EditionTicket iso={iso} label={label} editionNumber={index + 1} user={user} />
    </main>
  );
}
