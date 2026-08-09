# Huisbioscoop

A tiny app for a fixed group of 5 people to suggest and vote on movies for a
home cinema night that happens every 2 weeks on a Thursday, plus a comment
thread per night.

- "Login" = tap your name. No passwords, no accounts.
- Suggest a movie for the next (or any) edition.
- Vote "Mee eens" (I agree) on someone else's pick.
- Comment on a specific movie night.
- Data (suggestions, votes, comments) is shared and stored in Upstash Redis,
  so everyone sees the same thing regardless of device.

## 1. Create the Redis database (Upstash)

The easiest path is through Vercel, since it wires up the environment
variables automatically:

1. Go to your project on [vercel.com](https://vercel.com) → **Storage** tab
   → **Create Database** → choose **Upstash** → **Redis**.
2. Connect it to this project. Vercel will automatically add
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to your project's
   environment variables.

(Alternatively, create a free database directly at
[upstash.com](https://upstash.com) and copy the REST URL and token from its
dashboard into your environment variables manually.)

## 2. Run it locally

```bash
npm install
cp .env.local.example .env.local
# fill in UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local
npm run dev
```

Open http://localhost:3000.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Huisbioscoop"
git branch -M main
git remote add origin https://github.com/<your-username>/huisbioscoop.git
git push -u origin main
```

## 4. Deploy to Vercel

1. On [vercel.com](https://vercel.com), **Add New Project** → import the
   GitHub repo you just pushed.
2. If you didn't set up storage via Vercel in step 1, add
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` under
   **Settings → Environment Variables**.
3. Deploy. That's it — no other config needed.

## Customizing

- **Who can log in**: edit the `USERS` array in `lib/dates.js`.
- **Schedule**: editions are calculated from a fixed anchor date in
  `lib/dates.js` (first Thursday on/after 2025-01-01), stepping every 14
  days forever. Change the anchor there if you want the cycle to shift.
- **Look and feel**: all styling is in `app/globals.css` (cinema-ticket
  theme — velvet red, marquee gold, paper ticket with a stub).

## How data is stored

Each edition is one Redis key, `edition:YYYY-MM-DD`, holding its movies
(with votes) and comments as JSON. There's no user accounts table — "who
you are" is just a name held in the browser's local storage after you tap
a seat.
