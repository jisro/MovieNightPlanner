# Huisbioscoop

A lightweight movie voting app built for our biweekly home cinema nights.

**Live:** [thuisbios.vercel.app](https://thuisbios.vercel.app)

## What it does

Every two weeks on Thursday, five of us watch a movie together. This app lets us:

- **Suggest movies** for upcoming nights
- **Vote** on each other's suggestions ("Mee eens" = I agree)
- **Comment** on specific movie nights
- **No authentication** — just tap your name to "log in"

The schedule auto-generates every 14 days from a fixed anchor date (first Thursday after Jan 1, 2025), so there's no manual date entry.

## Design

Cinema-ticket aesthetic: velvet red, marquee gold, and a perforated stub. All styling is vanilla CSS with a focus on tactile, nostalgic UI.

## Tech stack

- **Next.js** (App Router)
- **Upstash Redis** — all data (suggestions, votes, comments) stored as JSON per edition key: `edition:YYYY-MM-DD`
- **Vercel** — deployed with automatic Redis integration
- **No authentication layer** — identity is just a name in localStorage

## Data model

Each movie night is one Redis key holding:
- List of suggested movies with vote counts
- Comment thread
- Date metadata

No users table, no sessions — this is intentionally minimal for a fixed group of five.

---

Built for my home cinema group. If you're one of the five and reading this: yes, I over-engineered our movie nights.
