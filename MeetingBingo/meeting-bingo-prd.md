# Meeting Bingo — Product Requirements Document

**Version**: 1.0  
**Date**: December 11, 2025  
**Status**: Ready for Development  
**First Workshop**: December 12, 2025  
**Target Build Time**: 90 minutes (MVP)  

---

## 1. Executive Summary

### 1.1 Product Vision

Meeting Bingo transforms corporate meetings from passive endurance tests into engaging games by automatically detecting buzzwords through live audio transcription. Players generate personalized bingo cards, and squares fill automatically when keywords are spoken during meetings.

### 1.2 Business Objectives

- Demonstrate end-to-end functionality in 90-minute workshop
- Showcase browser-native speech recognition capabilities
- Create shareable, delightful experience that spreads virally
- Zero cost infrastructure using free/open-source tools only

### 1.3 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Card Generation | < 2 seconds | Performance timing |
| Speech Recognition Start | < 1 second | User perception |
| Auto-Fill Detection | > 70% accuracy | Manual testing |
| Time to BINGO (typical) | 10-25 minutes | Game analytics |
| Share Rate | > 30% of wins | Click tracking |

---

## 2. Scope Definition

### 2.1 In Scope (MVP — 90 minutes)

| Feature | Priority | Complexity |
|---------|----------|------------|
| Bingo card generation (5x5 grid) | P0 | Low |
| Buzzword category packs (3 packs) | P0 | Low |
| Free space (center) | P0 | Low |
| Web Speech API transcription | P0 | Medium |
| Auto-fill on word detection | P0 | Medium |
| Manual tap fallback | P0 | Low |
| BINGO detection (5 in a row) | P0 | Low |
| Win celebration animation | P0 | Low |
| Shareable result card | P1 | Medium |
| Game state persistence (localStorage) | P1 | Low |
| Mobile responsive layout | P1 | Low |
| Light/dark theme | P2 | Low |

### 2.2 Out of Scope (MVP)

- User accounts / authentication
- Multiplayer real-time sync
- Custom buzzword creation (use preset packs)
- Backend server / database
- Sound effects
- Game history beyond current session
- Leaderboards
- Calendar integration

### 2.3 What This Is NOT

- Not a meeting recording tool (audio processed locally, never stored)
- Not a collaboration platform (single-player MVP)
- Not a productivity tool (it's explicitly for fun)

---

## 3. User Stories & Acceptance Criteria

### 3.1 Epic 1: Game Setup

#### US-1.1: Start New Game
**As a** meeting attendee  
**I want to** start a new bingo game quickly  
**So that** I can play during my upcoming meeting

**Acceptance Criteria**:
- [ ] Landing page loads in < 2 seconds
- [ ] "New Game" button prominently displayed
- [ ] No account or signup required
- [ ] Works on desktop Chrome, Firefox, Safari, Edge

#### US-1.2: Select Buzzword Category
**As a** player  
**I want to** choose a category of buzzwords  
**So that** my card matches my meeting type

**Acceptance Criteria**:
- [ ] At least 3 category options displayed: Agile, Corporate, Tech
- [ ] Each category has 40+ unique buzzwords
- [ ] Category selection shows preview of sample words
- [ ] Selection generates immediate card preview

#### US-1.3: Generate Unique Card
**As a** player  
**I want** a randomized bingo card  
**So that** my game is unique each time

**Acceptance Criteria**:
- [ ] 5x5 grid generated with 24 random words + 1 free space
- [ ] Free space always in center position
- [ ] No duplicate words on same card
- [ ] Card layout renders correctly on all screen sizes
- [ ] Can regenerate card before starting game

---

### 3.2 Epic 2: Audio Transcription

#### US-2.1: Enable Microphone
**As a** player  
**I want to** enable microphone access  
**So that** the game can hear meeting audio

**Acceptance Criteria**:
- [ ] Clear prompt explaining why microphone needed
- [ ] Privacy message: "Audio processed locally, never recorded"
- [ ] Graceful handling if permission denied
- [ ] Visual indicator when microphone is active
- [ ] Works with system audio (meeting playback through speakers)

#### US-2.2: Real-Time Transcription
**As a** player  
**I want** spoken words to be transcribed  
**So that** buzzwords can be detected automatically

**Acceptance Criteria**:
- [ ] Uses Web Speech API (free, browser-native)
- [ ] Transcription begins within 1 second of enabling
- [ ] Continuous listening mode (doesn't stop after silence)
- [ ] Visual feedback showing transcription is active
- [ ] Handles background noise reasonably well

#### US-2.3: Auto-Fill Detection
**As a** player  
**I want** squares to fill automatically when buzzwords are spoken  
**So that** I don't have to manually track

**Acceptance Criteria**:
- [ ] Detects exact word matches (case-insensitive)
- [ ] Detects partial/fuzzy matches for compound words
- [ ] Auto-fill animation plays within 500ms of detection
- [ ] Toast notification shows detected word
- [ ] Square changes to "filled" state permanently
- [ ] Detection works for words spoken by any meeting participant

---

### 3.3 Epic 3: Gameplay

#### US-3.1: Manual Square Toggle
**As a** player  
**I want to** manually tap squares  
**So that** I can mark words the transcription missed

**Acceptance Criteria**:
- [ ] Tap/click on square toggles filled state
- [ ] Visual feedback on tap
- [ ] Can unfill accidentally tapped squares
- [ ] Manual fills distinguished from auto-fills (optional)

#### US-3.2: Progress Tracking
**As a** player  
**I want to** see my progress toward BINGO  
**So that** I know how close I am to winning

**Acceptance Criteria**:
- [ ] Counter shows "X/24 squares filled"
- [ ] Visual indication when one square away from BINGO
- [ ] Highlight potential winning lines
- [ ] Free space counts toward all lines

#### US-3.3: BINGO Detection
**As a** player  
**I want** the game to detect when I get BINGO  
**So that** I can celebrate my win

**Acceptance Criteria**:
- [ ] Detects horizontal BINGO (5 rows)
- [ ] Detects vertical BINGO (5 columns)
- [ ] Detects diagonal BINGO (2 diagonals)
- [ ] Detection happens immediately on qualifying fill
- [ ] Game highlights winning line

---

### 3.4 Epic 4: Win State & Sharing

#### US-4.1: Win Celebration
**As a** winner  
**I want** a satisfying celebration  
**So that** the win feels rewarding

**Acceptance Criteria**:
- [ ] Confetti or particle animation plays
- [ ] "BINGO!" text displays prominently
- [ ] Winning line highlighted on card
- [ ] Animation is visually satisfying but professional
- [ ] No sound by default (user is in a meeting)
- [ ] Celebration doesn't freeze or lag

#### US-4.2: Result Summary
**As a** winner  
**I want** to see my game summary  
**So that** I can share my achievement

**Acceptance Criteria**:
- [ ] Shows time elapsed to BINGO
- [ ] Shows winning word that completed BINGO
- [ ] Shows total squares filled
- [ ] Shows category played
- [ ] Screenshot-ready card layout

#### US-4.3: Share Result
**As a** winner  
**I want to** share my result with teammates  
**So that** they can join the fun

**Acceptance Criteria**:
- [ ] "Share" button copies result to clipboard
- [ ] Shareable format includes: result card image OR text summary
- [ ] Includes link to play Meeting Bingo
- [ ] Works with Slack, Teams, Discord paste
- [ ] Mobile share triggers native share sheet

---

## 4. Data Models

### 4.1 Game State

```typescript
interface BingoGame {
  id: string;                    // UUID
  category: CategoryType;        // 'agile' | 'corporate' | 'tech'
  card: BingoCard;
  startedAt: Date | null;
  completedAt: Date | null;
  winningLine: WinningLine | null;
  winningWord: string | null;
}

interface BingoCard {
  squares: BingoSquare[][];      // 5x5 grid
}

interface BingoSquare {
  word: string;
  isFilled: boolean;
  isAutoFilled: boolean;         // true if detected by transcription
  isFreeSpace: boolean;
  filledAt: Date | null;
}

type WinningLine = {
  type: 'row' | 'column' | 'diagonal';
  index: number;                 // 0-4 for row/col, 0-1 for diagonal
};
```

### 4.2 Buzzword Categories

```typescript
interface BuzzwordCategory {
  id: CategoryType;
  name: string;
  description: string;
  icon: string;
  words: string[];               // 40+ words per category
}

const CATEGORIES: BuzzwordCategory[] = [
  {
    id: 'agile',
    name: 'Agile & Scrum',
    description: 'Sprint planning, standups, and retrospectives',
    icon: '🏃',
    words: [
      'sprint', 'backlog', 'standup', 'retrospective', 'velocity',
      'blocker', 'story points', 'epic', 'user story', 'scrum master',
      'product owner', 'kanban', 'burndown', 'refinement', 'iteration',
      'acceptance criteria', 'definition of done', 'capacity', 'throughput',
      'cycle time', 'lead time', 'WIP limit', 'swimlane', 'ceremony',
      'timeboxed', 'increment', 'artifact', 'transparency', 'inspection',
      'adaptation', 'self-organizing', 'cross-functional', 'servant leader',
      'impediment', 'spike', 'technical debt', 'refactor', 'MVP',
      'release', 'deployment', 'continuous integration', 'CI/CD'
    ]
  },
  {
    id: 'corporate',
    name: 'Corporate Speak',
    description: 'Synergy, leverage, and circling back',
    icon: '💼',
    words: [
      'synergy', 'leverage', 'circle back', 'take offline', 'bandwidth',
      'low-hanging fruit', 'move the needle', 'deep dive', 'touch base',
      'action item', 'deliverable', 'stakeholder', 'alignment', 'visibility',
      'paradigm shift', 'best practice', 'value proposition', 'ROI',
      'bottom line', 'top of mind', 'streamline', 'optimize', 'scalable',
      'proactive', 'holistic', 'robust', 'ecosystem', 'pivot',
      'disruption', 'innovation', 'thought leader', 'core competency',
      'mission critical', 'game changer', 'win-win', 'net-net',
      'helicopter view', 'granular', 'drill down', 'peel back the onion',
      'boil the ocean', 'bleeding edge', 'north star'
    ]
  },
  {
    id: 'tech',
    name: 'Tech & Engineering',
    description: 'APIs, cloud, and architecture discussions',
    icon: '💻',
    words: [
      'API', 'cloud', 'microservices', 'serverless', 'containerized',
      'kubernetes', 'docker', 'CI/CD', 'pipeline', 'deployment',
      'scalability', 'latency', 'throughput', 'database', 'schema',
      'migration', 'refactor', 'technical debt', 'architecture',
      'infrastructure', 'DevOps', 'observability', 'monitoring',
      'alerting', 'incident', 'postmortem', 'SLA', 'uptime',
      'performance', 'optimization', 'caching', 'load balancing',
      'security', 'authentication', 'authorization', 'encryption',
      'compliance', 'audit', 'code review', 'pull request', 'merge',
      'branch', 'release', 'rollback', 'feature flag'
    ]
  }
];
```

---

## 5. Technical Specifications

### 5.1 Technology Stack (Free/Open Source Only)

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React 18 + TypeScript | Industry standard, workshop familiarity |
| **Styling** | Tailwind CSS | Rapid UI development, utility-first |
| **Speech** | Web Speech API | Free, browser-native, no API keys |
| **Animation** | CSS + canvas-confetti | Lightweight celebration effects |
| **State** | React useState + localStorage | Simple, no backend needed |
| **Build** | Vite | Fast builds, excellent DX |
| **Deployment** | Vercel | Free tier, instant deploys |

### 5.2 Web Speech API Integration

```typescript
// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

interface SpeechConfig {
  continuous: true;           // Don't stop after silence
  interimResults: true;       // Get partial results
  lang: 'en-US';              // English recognition
}

// Detection logic
function checkForBuzzwords(transcript: string, cardWords: string[]): string[] {
  const normalizedTranscript = transcript.toLowerCase();
  const detectedWords: string[] = [];
  
  for (const word of cardWords) {
    const normalizedWord = word.toLowerCase();
    // Check for exact word boundaries
    const regex = new RegExp(`\\b${escapeRegex(normalizedWord)}\\b`, 'i');
    if (regex.test(normalizedTranscript)) {
      detectedWords.push(word);
    }
  }
  
  return detectedWords;
}
```

### 5.3 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 33+ | ✅ Full | Best support for Web Speech API |
| Edge 79+ | ✅ Full | Chromium-based |
| Safari 14.1+ | ✅ Full | Requires webkit prefix |
| Firefox | ⚠️ Limited | Speech API behind flag, fallback to manual |
| Mobile Chrome | ✅ Full | Android support |
| Mobile Safari | ✅ Full | iOS 14.5+ |

### 5.4 Privacy Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRIVACY BY DESIGN                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │ Microphone  │───▶│ Web Speech  │───▶│ Browser-Local       │ │
│  │   Audio     │    │    API      │    │ Text Processing     │ │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘ │
│                                                    │            │
│                                                    ▼            │
│                                        ┌─────────────────────┐ │
│                                        │ Buzzword Detection  │ │
│                                        │ (Client-side only)  │ │
│                                        └──────────┬──────────┘ │
│                                                    │            │
│                                                    ▼            │
│                                        ┌─────────────────────┐ │
│                                        │ Game State Update   │ │
│                                        │ (localStorage)      │ │
│                                        └─────────────────────┘ │
│                                                                 │
│  ✅ Audio never leaves device                                   │
│  ✅ No server transmission                                      │
│  ✅ No recording or storage                                     │
│  ✅ Transcription discarded immediately after processing        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. User Interface Specifications

### 6.1 Screen Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│  Category   │────▶│    Game     │────▶│    Win      │
│    Page     │     │  Selection  │     │   Active    │     │   Screen    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                               │
                                               │ (if no win)
                                               ▼
                                        ┌─────────────┐
                                        │  Continue   │
                                        │  or Reset   │
                                        └─────────────┘
```

### 6.2 Landing Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     🎯 MEETING BINGO                           │
│                                                                 │
│           Turn any meeting into a game.                        │
│      Auto-detects buzzwords using speech recognition!          │
│                                                                 │
│                    ┌─────────────────┐                         │
│                    │   🎮 NEW GAME   │                         │
│                    └─────────────────┘                         │
│                                                                 │
│         🔒 Audio processed locally. Never recorded.            │
│                                                                 │
│                                                                 │
│  ───────────────────────────────────────────────────────────   │
│                                                                 │
│              How It Works:                                     │
│                                                                 │
│     1️⃣ Pick a buzzword category                                │
│     2️⃣ Enable microphone for auto-detection                    │
│     3️⃣ Join your meeting and listen                            │
│     4️⃣ Watch squares fill automatically!                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 Category Selection

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                   Choose Your Buzzword Pack                    │
│                                                                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │                 │ │                 │ │                 │   │
│  │       🏃        │ │       💼        │ │       💻        │   │
│  │                 │ │                 │ │                 │   │
│  │  Agile & Scrum  │ │ Corporate Speak │ │ Tech & Eng      │   │
│  │                 │ │                 │ │                 │   │
│  │  Sprint, Epic   │ │ Synergy, ROI    │ │ API, Cloud      │   │
│  │  Standup, MVP   │ │ Circle back     │ │ DevOps          │   │
│  │                 │ │                 │ │                 │   │
│  │    [Select]     │ │    [Select]     │ │    [Select]     │   │
│  │                 │ │                 │ │                 │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
│                                                                 │
│                      ← Back to Home                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.4 Active Game Screen

```
┌─────────────────────────────────────────────────────────────────┐
│  🎯 Meeting Bingo           🎤 Listening...    8/24 filled    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │          │          │   ✅     │          │   ✅     │      │
│  │  Sprint  │ Backlog  │ Standup  │ Velocity │ Blocker  │      │
│  │          │          │          │          │          │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │   ✅     │          │   ✅     │          │          │      │
│  │  Epic    │  Story   │  Scrum   │  Kanban  │Burndown  │      │
│  │          │  Points  │  Master  │          │          │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │          │          │   ⭐     │   ✅     │          │      │
│  │   MVP    │  Scope   │  FREE    │  Agile   │  Tech    │      │
│  │          │  Creep   │  SPACE   │          │  Debt    │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │   ✅     │          │          │   ✅     │          │      │
│  │  Retro   │ Refactor │   JIRA   │  Deploy  │  CI/CD   │      │
│  │          │          │          │          │          │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │          │          │          │          │          │      │
│  │ Release  │  Hotfix  │    PR    │  Merge   │  Branch  │      │
│  │          │          │          │          │          │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎤 Last heard: "...review the sprint backlog..."       │   │
│  │     ✨ Detected: "sprint", "backlog"                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│           [🔄 New Card]     [⏹️ Stop Listening]                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 Win Screen

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    🎉 🎊 BINGO! 🎊 🎉                          │
│                                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │   ✅     │   ✅     │   ✅     │   ✅     │   ✅     │ ←WIN │
│  │  Sprint  │ Backlog  │ Standup  │ Velocity │ Blocker  │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │   ✅     │          │   ✅     │          │          │      │
│  │  Epic    │  Story   │  Scrum   │  Kanban  │Burndown  │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │          │          │   ⭐     │   ✅     │          │      │
│  │   MVP    │  Scope   │  FREE    │  Agile   │  Tech    │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │   ✅     │          │          │   ✅     │          │      │
│  │  Retro   │ Refactor │   JIRA   │  Deploy  │  CI/CD   │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │          │          │          │          │          │      │
│  │ Release  │  Hotfix  │    PR    │  Merge   │  Branch  │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                                 │
│         ────────────────────────────────────────────           │
│                                                                 │
│                ⏱️ Time to BINGO: 18 minutes                     │
│                🏆 Winning word: "Blocker"                       │
│                📊 Squares filled: 12/24                         │
│                                                                 │
│         ┌────────────┐          ┌────────────┐                 │
│         │ 📤 SHARE   │          │ 🔄 PLAY    │                 │
│         │   RESULT   │          │   AGAIN    │                 │
│         └────────────┘          └────────────┘                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.6 Color System

```css
/* Light Mode */
--bg-primary: #ffffff;
--bg-secondary: #f3f4f6;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--accent-blue: #3b82f6;
--accent-green: #10b981;
--accent-yellow: #f59e0b;
--filled-square: #dbeafe;       /* Light blue for filled */
--free-space: #fef3c7;          /* Warm yellow */
--winning-line: #86efac;        /* Bright green */

/* Square States */
--square-default: #ffffff;
--square-filled: #3b82f6;
--square-filled-text: #ffffff;
--square-hover: #eff6ff;
```

---

## 7. Component Architecture

### 7.1 Component Tree

```
App
├── LandingPage
│   ├── Header
│   ├── HeroSection
│   └── HowItWorks
│
├── CategorySelection
│   ├── CategoryCard (×3)
│   └── BackButton
│
├── GameBoard
│   ├── GameHeader
│   │   ├── Logo
│   │   ├── StatusIndicator (listening/paused)
│   │   └── ProgressCounter
│   │
│   ├── BingoCard
│   │   └── BingoSquare (×25)
│   │
│   ├── TranscriptPanel
│   │   ├── LiveTranscript
│   │   └── DetectedWords
│   │
│   └── GameControls
│       ├── NewCardButton
│       └── ListeningToggle
│
├── WinScreen
│   ├── Confetti
│   ├── WinningCard
│   ├── GameStats
│   └── ShareButton
│
└── Shared
    ├── Button
    ├── Card
    └── Toast
```

### 7.2 Key Component Interfaces

```typescript
// BingoSquare.tsx
interface BingoSquareProps {
  word: string;
  isFilled: boolean;
  isAutoFilled: boolean;
  isFreeSpace: boolean;
  isWinningSquare: boolean;
  onClick: () => void;
}

// GameBoard.tsx
interface GameBoardProps {
  game: BingoGame;
  isListening: boolean;
  onSquareClick: (row: number, col: number) => void;
  onToggleListening: () => void;
  onNewCard: () => void;
}

// TranscriptPanel.tsx
interface TranscriptPanelProps {
  transcript: string;
  detectedWords: string[];
  isListening: boolean;
}
```

---

## 8. Implementation Priorities

### 8.1 Phase 1: Core Game (45 minutes)
1. Project setup (Vite + React + TypeScript + Tailwind)
2. Landing page with "New Game" button
3. Category selection (3 cards)
4. Card generation (5x5 grid, randomized from category)
5. Manual square toggle (click to fill)
6. BINGO detection logic
7. Basic win state

### 8.2 Phase 2: Speech Integration (30 minutes)
1. Web Speech API integration
2. Microphone permission flow
3. Real-time transcription display
4. Buzzword detection logic
5. Auto-fill animation

### 8.3 Phase 3: Polish (15 minutes)
1. Win celebration (confetti)
2. Share functionality
3. Responsive tweaks
4. localStorage persistence

---

## 9. Testing Checklist

### 9.1 Functional Tests
- [ ] Card generates with 24 unique words + free space
- [ ] Each category produces different cards
- [ ] Manual tap toggles square state
- [ ] BINGO detected for all 12 possible winning lines
- [ ] Win screen displays correct stats
- [ ] Share copies correct content

### 9.2 Speech Recognition Tests
- [ ] Microphone permission prompt appears
- [ ] Transcription starts after permission granted
- [ ] Words detected from clear speech
- [ ] Auto-fill triggers on detection
- [ ] Transcription handles compound words ("code review")
- [ ] Graceful fallback if speech API unavailable

### 9.3 Edge Cases
- [ ] Multiple words detected simultaneously
- [ ] Same word spoken multiple times (only fills once)
- [ ] Browser tab switch and return
- [ ] Mobile landscape orientation
- [ ] Slow network (not applicable — all local)

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Web Speech API not available | Low | High | Feature detection; fallback to manual-only mode |
| Poor transcription accuracy | Medium | Medium | Manual tap fallback always available |
| Firefox/older browser issues | Medium | Low | Progressive enhancement; core game works without speech |
| Meeting audio not captured | Medium | Medium | User can hold phone near speaker; manual fallback |
| Scope creep in workshop | High | Medium | Hard scope lock; multiplayer explicitly out |

---

## 11. Success Metrics (Post-Workshop)

### Engagement
- Games started per session
- Average time to BINGO
- Share rate (clicks on share button)
- Return visits within 7 days

### Technical
- Speech recognition availability rate
- Auto-fill accuracy (detected vs. spoken)
- Error rate (crashes, failed states)
- Performance (time to interactive)

---

## 12. Future Considerations (Post-MVP Backlog)

| Feature | Priority | Complexity |
|---------|----------|------------|
| Custom buzzword lists | High | Low |
| Multiplayer real-time sync | High | High |
| Achievement system | Medium | Medium |
| Meeting type templates | Medium | Low |
| Sound effects toggle | Low | Low |
| Dark mode | Low | Low |
| Export game history | Low | Medium |
| Mobile app (PWA) | Low | Medium |

---

## Sources

Mozilla Developer Network. "Web Speech API." *MDN Web Docs*, 2024, https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API.

Mozilla Developer Network. "SpeechRecognition." *MDN Web Docs*, 2024, https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition.

Can I Use. "Speech Recognition API." *Can I Use*, 2024, https://caniuse.com/speech-recognition.

Vercel. "Pricing." *Vercel*, 2025, https://vercel.com/pricing.

Tailwind Labs. "Tailwind CSS Documentation." *Tailwind CSS*, 2024, https://tailwindcss.com/docs.

Vite. "Getting Started." *Vite*, 2024, https://vitejs.dev/guide/.

Canvas Confetti. "GitHub Repository." *GitHub*, https://github.com/catdad/canvas-confetti.

---

*Document prepared for 021.School Workshop*  
*Next Step: Architecture Plan*
