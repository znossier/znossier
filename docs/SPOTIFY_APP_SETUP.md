# Spotify app setup (from scratch)

This app uses the **Spotify Web API** only to fetch track artist names (no user login). You use the **Client Credentials** flow, so you do **not** need a redirect URI or user authorization.

---

## 1. Open the dashboard

1. Go to **[developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)**.
2. Log in with your Spotify account (or create one).

---

## 2. Create an app

1. Click **“Create app”** (or “Create an app”).
2. Fill in the form:
   - **App name** – e.g. `Znossier` or `My Vinyl Player`.
   - **App description** – e.g. `Shows playlist and track artist for the vinyl player.`
   - If you see **Which APIs do you want to use?** – choose **Web API** (we only need the Web API).
3. Check the box to accept the **Developer Terms of Service** and **Spotify Design Guidelines** (if shown).
4. Click **Create** (or **Save**).

You’ll be taken to your new app’s page.

---

## 3. Get your credentials

On the app overview page you’ll see:

- **Client ID** – long string (e.g. `a1b2c3d4e5f6...`). Click **Copy** or select and copy it.
- **Client secret** – click **“Show client secret”** or **Reveal**, then copy it.

Keep the client secret private (don’t commit it to git or share it).

---

## 4. (Optional) Edit settings

Click **“Settings”** or **“Edit settings”** if you want to:

- **Website** – you can add your site URL (e.g. `https://znossier.vercel.app`). Optional.
- **Redirect URIs** – leave empty for this project. We only use Client Credentials (server-to-server), not user login, so no redirect is needed.

Click **Save** when done.

---

## 5. Add credentials to the project

1. In the project root, open **`.env.local`** (create it if it doesn’t exist).
2. Add these lines (use your real Client ID and Client secret):

```bash
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
```

3. Save the file.  
   `.env.local` is gitignored, so these values won’t be committed.

---

## 6. Restart the dev server

Restart your Next.js dev server so it picks up the new env vars:

```bash
# Stop the server (Ctrl+C), then:
npm run dev
```

---

## What this enables

When both `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are set, the app will:

1. Request an access token from Spotify using Client Credentials.
2. Call the Web API **Get Track** endpoint for the currently playing track.
3. Use the track’s **artist name** from the API instead of scraping the Spotify page.

So artist names come from the official API and stay accurate.

---

## Troubleshooting

- **“Invalid client”** – Double-check Client ID and Client secret in `.env.local` (no extra spaces, correct values from the dashboard). Restart the dev server after changing env.
- **Rate limits** – Client Credentials has generous limits for normal use (e.g. one request per track change). If you hit limits, Spotify will return an error; the app will fall back to other artist sources.
- **Rotating the secret** – If you ever click **Rotate** on the client secret in the dashboard, update `SPOTIFY_CLIENT_SECRET` in `.env.local` and restart the server.
