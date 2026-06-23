# Meeting Bingo 🎯

A single-player browser bingo game for buzzword-filled meetings. Generate a
5×5 card from a buzzword pack, then mark squares as you hear the jargon — by
tapping, or hands-free via your microphone. Complete any row, column, or
diagonal for **BINGO**.

Built from the docs in [`../MeetingBingo/`](../MeetingBingo) following
`IMPLEMENTATION_PLAN.md`.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · canvas-confetti

State is plain `useState` (no state library). Game progress persists to
`localStorage`. No backend, no API keys — **$0 infrastructure**. Deploys as a
static SPA.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # tsc + vite build → dist/
npm run preview  # serve the production build
```

## How speech auto-fill works (and its limits)

Auto-fill uses the browser-native **Web Speech API**, which is **microphone
only** — it transcribes what your mic picks up. It does **not** capture system
or remote-meeting audio (that browser capability doesn't exist for speech
recognition). So auto-fill works for in-person meetings or your own speaker
output near the mic; for headphone calls, **manual tap is the primary path**.

- Speech is available in Chrome/Edge; unsupported browsers (e.g. Firefox)
  automatically fall back to a fully playable **manual mode**.
- Audio is processed locally in the browser and never recorded or uploaded.
- Mic permission and the Web Share/clipboard APIs require **https + a user
  gesture** — test sharing/mic on the deployed https URL, not a LAN-IP dev
  server.

## Notable design decisions (from the plan)

- **Atomic fills:** speech auto-fill derives its dedup set and applies fills
  inside a single `setGame` updater, and `filledCount` is always recomputed
  from the card (never incremented) — no fill races or miscounts.
- **Resilient recognizer:** transient errors (`no-speech`, `aborted`,
  `network`) keep listening and auto-restart on `onend`; only `not-allowed` /
  `service-not-allowed` stop it.
- **Accessibility:** `prefers-reduced-motion` disables the auto-fill pop and
  confetti; squares expose `aria-pressed` + labels and a non-color ✓ affordance;
  mic state and detections are announced via `aria-live`.
- **Persistence:** state is stored under a versioned key; in-progress games
  resume on reload, finished/empty games reset to the landing page, and cards
  built from an unknown category are discarded.
- **Card preview:** the optional pre-start preview screen was cut; the first
  in-game state shows a fresh card plus a prominent "Start Listening" CTA.

## Deploy (Vercel)

Push to GitHub and import the repo in Vercel. The framework is auto-detected as
Vite; SPA fallback is automatic for static builds. Ships to `*.vercel.app`.

## Out of scope (deferred)

Multiplayer / Join Game, custom packs, history, achievements.
