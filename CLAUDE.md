# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A workshop repository ("Zero To One", June 2026). It currently contains **planning documents and a Claude Code skill — no application code yet.** There is no `package.json`, no build, lint, or test setup. The "Meeting Bingo" app described in `MeetingBingo/` is meant to be built *from* these docs (a 90-minute MVP exercise), not modified as existing code.

Do not look for or invent build/run commands at the repo root — they don't exist until the app is scaffolded (see below).

## Layout

- `MeetingBingo/` — planning docs for the app to be built (see doc hierarchy below).
- `.claude/skills/plan-review-skill/` — an installed Claude Code skill (the `plan-review-skill` / `/plan-review-skill` command).

## The MeetingBingo doc hierarchy

Four documents with a deliberate dependency order. When facts conflict, the **later** doc in this chain wins:

1. `meeting-bingo-prd.md` — product requirements, scope (in/out), success metrics. Source of truth for **what** and **scope boundaries**.
2. `meeting-bingo-architecture.md` — technical design, the canonical TypeScript interfaces, and **paste-ready reference code** for *some* files: `src/types`, `src/lib/cardGenerator`, `src/lib/bingoChecker`, `src/lib/wordDetector`, `src/hooks/useSpeechRecognition`, `src/App`, `src/components/BingoSquare`, `src/components/TranscriptPanel`, `src/data/categories`, plus root `vite.config`. Everything else has no reference code and must be written: the remaining components (`BingoCard`, `GameBoard`, `GameControls`, `LandingPage`, `CategorySelect`, `WinScreen`, the `ui/` primitives) and the remaining hooks (`useGame`, `useBingoDetection`, `useLocalStorage`). Also defines the proposed `src/` folder structure.
3. `meeting-bingo-uxr.md` — UX research and design principles (e.g. "solo must be fully fun").
4. `IMPLEMENTATION_PLAN.md` — **derived from and reconciles all three above.** This is the build authority: ordered phases, gap resolutions, and the decisions made where the other docs disagree. Start here when building.

`IMPLEMENTATION_PLAN.md` was already run through `/plan-review-skill` — its "Review Summary" section lists VP-level blockers. **Treat these as binding constraints, not suggestions**, because the architecture's reference code does not yet account for them:

- Web Speech API is **mic-only** — "system audio" capture (PRD US-2.1) is not achievable; don't promise it.
- The recognizer dies on natural silence; distinguish transient vs. fatal `onerror` and auto-restart on `onend` (don't clear `isListening` on transient errors).
- `alreadyFilled` has no state owner — derive it atomically inside `setGame` to avoid fill races / miscounts.
- Resolve the filled-square color-token conflict (PRD §6.6) before pasting components.
- Add `prefers-reduced-motion` handling and basic ARIA semantics (absent from the reference code).

Intentionally **out of MVP scope** (deferred, not forgotten): multiplayer / Join Game, custom packs, history, achievements.

## Planned stack & scaffold

When asked to build the app, follow `IMPLEMENTATION_PLAN.md` Phase order (Foundation → Core Game manual-only → Speech → Polish/Deploy), keeping the app runnable at every step. The plan scaffolds into a **`meeting-bingo/` subdirectory**:

```bash
npm create vite@latest meeting-bingo -- --template react-ts
cd meeting-bingo && npm install
npm install canvas-confetti
npm install -D @types/canvas-confetti tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Stack: Vite + React 18 + TypeScript + Tailwind CSS + canvas-confetti. State = `useState`/Context only (no state library). Persistence = `localStorage`. No backend; deploy as a static SPA to Vercel. Constraint throughout: **$0 infrastructure, no API keys.**

## The plan-review skill

`/plan-review-skill <plan-file>` (or natural triggers like "review this plan") runs a multi-perspective review. Architecture is a **thin dispatcher**:

1. The skill (`SKILL.md`) reads `agent-prompt.md` and spawns a single `general-purpose` subagent, passing that prompt plus the user's request, the plan path, and cwd.
2. That subagent coordinates three VP review agents (Product, Engineering, Design), consolidates findings by severity (Critical/High/Medium/Low), and uses `AskUserQuestion` for approval.
3. Per `SKILL.md` (the authoritative v2.0.0 contract), **the subagent should not edit files** — background execution auto-denies Write/Edit — so it returns approved plan edits as text *recommendations* and the main conversation (coordinator) applies them with its own Edit tool. Note: `agent-prompt.md` still contains older instructions that grant the subagent Write/Edit and have it edit the plan file directly. The two files disagree; follow `SKILL.md`'s recommendations-only contract, and treat the in-place-edit language in `agent-prompt.md` as stale.

Because of step 3, run this skill in the **foreground** when interactive approval is needed. Most of the review logic lives in `agent-prompt.md`, not `SKILL.md`.
