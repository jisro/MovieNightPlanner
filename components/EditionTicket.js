'use client';

import { useCallback, useEffect, useState } from 'react';

export default function EditionTicket({ iso, label, editionNumber, user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [movieNote, setMovieNote] = useState('');
  const [commentText, setCommentText] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/editions/${iso}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [iso]);

  useEffect(() => {
    setLoading(true);
    setData(null);
    load();
    const id = setInterval(load, 12000);
    return () => clearInterval(id);
  }, [load]);

  async function send(body) {
    setPosting(true);
    try {
      const res = await fetch(`/api/editions/${iso}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      setData(json);
    } finally {
      setPosting(false);
    }
  }

  async function handleSuggest(e) {
    e.preventDefault();
    if (!movieTitle.trim()) return;
    await send({ type: 'movie', title: movieTitle, note: movieNote, user });
    setMovieTitle('');
    setMovieNote('');
  }

  async function handleVote(movieId) {
    await send({ type: 'vote', movieId, user });
  }

  async function handleDelete(movieId) {
    await send({ type: 'deleteMovie', movieId, user });
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    await send({ type: 'comment', text: commentText, user });
    setCommentText('');
  }

  const movies = data ? [...data.movies].sort((a, b) => b.votes.length - a.votes.length) : [];

  return (
    <div className="ticket">
      <div className="stub">
        <span className="stub-eyebrow">Editie</span>
        <span className="stub-number">#{String(editionNumber).padStart(3, '0')}</span>
        <span className="stub-admit">Adm&nbsp;een</span>
        <span className="stub-date">{label}</span>
      </div>

      <div className="content">
        <section className="panel">
          <h3>Films</h3>

          {loading && <p className="muted">Laden…</p>}
          {!loading && movies.length === 0 && (
            <p className="muted">Nog geen films voorgesteld. Wees de eerste.</p>
          )}

          <ul className="movie-list">
            {movies.map((m) => {
              const agreed = m.votes.includes(user);
              return (
                <li key={m.id} className="movie-row">
                  <div className="movie-main">
                    <span className="movie-title">{m.title}</span>
                    <span className="movie-by">voorgesteld door {m.suggestedBy}</span>
                    {m.note && <p className="movie-note">{m.note}</p>}
                  </div>
                  <div className="movie-actions">
                    <button
                      type="button"
                      className={`agree-btn${agreed ? ' agreed' : ''}`}
                      onClick={() => handleVote(m.id)}
                      disabled={posting}
                    >
                      {agreed ? '✓ Mee eens' : 'Mee eens'}
                      {m.votes.length > 0 && <span className="count">{m.votes.length}</span>}
                    </button>
                    {m.suggestedBy === user && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(m.id)}
                        disabled={posting}
                        aria-label="Verwijder film"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <form className="suggest-form" onSubmit={handleSuggest}>
            <input
              type="text"
              placeholder="Filmtitel"
              value={movieTitle}
              onChange={(e) => setMovieTitle(e.target.value)}
              maxLength={120}
            />
            <input
              type="text"
              placeholder="Toelichting (optioneel)"
              value={movieNote}
              onChange={(e) => setMovieNote(e.target.value)}
              maxLength={200}
            />
            <button type="submit" disabled={posting || !movieTitle.trim()}>
              Stel voor
            </button>
          </form>
        </section>

        <section className="panel">
          <h3>Gesprek</h3>

          <ul className="comment-list">
            {data &&
              data.comments.map((c) => (
                <li key={c.id} className="comment-row">
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-text">{c.text}</span>
                </li>
              ))}
            {data && data.comments.length === 0 && <p className="muted">Nog geen reacties.</p>}
          </ul>

          <form className="comment-form" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Zeg iets over deze avond…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={280}
            />
            <button type="submit" disabled={posting || !commentText.trim()}>
              Stuur
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
