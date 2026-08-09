import { NextResponse } from 'next/server';
import { redis } from '../../../../lib/redis';

const KEY_PREFIX = 'edition:';

function emptyEdition() {
  return { movies: [], comments: [] };
}

export async function GET(request, { params }) {
  const { date } = params;
  const data = await redis.get(KEY_PREFIX + date);
  return NextResponse.json(data || emptyEdition());
}

export async function POST(request, { params }) {
  const { date } = params;
  const body = await request.json();
  const key = KEY_PREFIX + date;

  const existing = await redis.get(key);
  const edition = existing || emptyEdition();

  if (body.type === 'movie') {
    if (!body.title || !body.title.trim() || !body.user) {
      return NextResponse.json({ error: 'title and user are required' }, { status: 400 });
    }
    edition.movies.push({
      id: crypto.randomUUID(),
      title: body.title.trim().slice(0, 120),
      note: (body.note || '').trim().slice(0, 200),
      suggestedBy: body.user,
      votes: [],
      ts: Date.now(),
    });
  } else if (body.type === 'vote') {
    const movie = edition.movies.find((m) => m.id === body.movieId);
    if (!movie || !body.user) {
      return NextResponse.json({ error: 'movie and user are required' }, { status: 400 });
    }
    const i = movie.votes.indexOf(body.user);
    if (i === -1) {
      movie.votes.push(body.user);
    } else {
      movie.votes.splice(i, 1);
    }
  } else if (body.type === 'deleteMovie') {
    edition.movies = edition.movies.filter(
      (m) => !(m.id === body.movieId && m.suggestedBy === body.user)
    );
  } else if (body.type === 'comment') {
    if (!body.text || !body.text.trim() || !body.user) {
      return NextResponse.json({ error: 'text and user are required' }, { status: 400 });
    }
    edition.comments.push({
      id: crypto.randomUUID(),
      author: body.user,
      text: body.text.trim().slice(0, 280),
      ts: Date.now(),
    });
  } else {
    return NextResponse.json({ error: 'unknown type' }, { status: 400 });
  }

  await redis.set(key, edition);
  return NextResponse.json(edition);
}
