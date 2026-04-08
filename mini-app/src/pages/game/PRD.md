# 🎮 SAH Kingdom Game — PRD v1.0

## 1. Concept & Vision

**SAH Kingdom** is an immersive music-themed kingdom-building game where players collect resources, trade with other musicians, and grow their musical empire. The experience feels like opening a treasure chest of instruments and gems — every interaction should feel rewarding, surprising, and alive.

**Core Fantasy:** You're a music producer building your dream studio kingdom. Each resource represents a piece of music history: vintage guitars, rare synths, legendary albums, and magical gems that power your creative magic.

---

## 2. Design Language

### Aesthetic Direction
**"Neon Music Vault"** — Dark, luxurious backgrounds with glowing accents. Think of a high-end music studio at night: warm wood tones meeting electric blue and gold highlights.

### Color Palette
```css
--bg-deep: #0a0a0f;
--bg-card: #12121a;
--bg-card-hover: #1a1a25;
--border: rgba(255,255,255,0.08);
--gold: #d4af37;
--gold-glow: rgba(212,175,55,0.4);
--blue: #4a9eff;
--blue-glow: rgba(74,158,255,0.3);
--purple: #9b59b6;
--purple-glow: rgba(155,89,182,0.3);
--green: #2ecc71;
--red: #e74c3c;
--text: #ffffff;
--text2: #8a8a9a;
```

### Typography
- **Headings:** `'Orbitron', sans-serif` — Futuristic, bold
- **Body:** `'Inter', sans-serif` — Clean, readable
- **Numbers/Stats:** `'JetBrains Mono', monospace` — Sharp, technical

### Motion Philosophy
Every interaction has **weight and feedback**:
- **Card Spawn:** Scale from 0 + rotation + glow burst
- **Card Hover:** Lift (translateY -8px) + shadow expansion + subtle glow
- **Card Click:** Press effect (scale 0.95) + ripple + success particle
- **Resource Gain:** Numbers fly up and fade + bounce animation
- **Market Trade:** Cards slide out/in with elastic easing
- **Idle:** Subtle floating animation on special cards (gems, rare items)

---

## 3. Resources System

### Resource Types

| Icon | Resource | Rarity | Description | Value (SAH) |
|------|----------|--------|-------------|-------------|
| 🎸 | **Instruments** | Common-Rare | Vintage guitars, synths, drums | 10-500 |
| 🎵 | **Notes** | Common | Musical notes — basic currency | 1-5 |
| 👤 | **Musicians** | Rare | Producer avatars for your kingdom | 100-1000 |
| 💿 | **Albums** | Epic | Legendary albums with royalties | 500-5000 |
| 💎 | **Gems** | Legendary | Power-ups, multipliers, special access | 1000+ |

### Rarity Glow Colors
```css
.common { border-color: #888; box-shadow: 0 0 10px rgba(136,136,136,0.3); }
.rare { border-color: #4a9eff; box-shadow: 0 0 15px rgba(74,158,255,0.4); }
.epic { border-color: #9b59b6; box-shadow: 0 0 20px rgba(155,89,182,0.5); }
.legendary { border-color: #d4af37; box-shadow: 0 0 25px rgba(212,175,55,0.6); animation: legendaryPulse 2s infinite; }
```

---

## 4. Core Features

### 4.1 Kingdom Dashboard
- **Stats Bar:** Total Resources | Kingdom Level | SAH Balance | Active Musicians
- **Resource Counters:** Animated number updates when resources change
- **Quick Actions:** Collect Daily → Trade → Upgrade Kingdom

### 4.2 Resource Collection
- **Collection Grid:** 3x4 grid of resource cards
- **Daily Spin:** Free spin every 24h for random resources
- **Achievement Bonuses:** Collect all instruments → bonus gems

### 4.3 Market / Trading
- **Market Cards:** Buy/Sell resources with other players
- **Live Price Ticker:** Prices fluctuate based on supply/demand
- **Trade Animations:** Cards slide across with particle effects

### 4.4 Card Interactions
```
┌─────────────────────────────────────────────────────────┐
│  CARD STATES                                            │
├─────────────────────────────────────────────────────────┤
│  DEFAULT    → Static with subtle idle float             │
│  HOVER      → Lift + glow + tooltip appears             │
│  CLICK      → Press + ripple + action triggers          │
│  SPAWN      → Scale from 0 + rotation + glow burst     │
│  SELL       → Slide right + fade + particles           │
│  BUY        → Slide in from market + land with bounce   │
└─────────────────────────────────────────────────────────┘
```

---

## 5. UI Components

### 5.1 ResourceCard
```jsx
Props: { type, name, rarity, value, icon, count, onClick, isNew }
States: idle | hover | pressed | spawning | removing
Animations: 
  - spawn: scale(0→1) + rotate(-10°→0°) + opacity(0→1) [400ms, ease-out]
  - hover: translateY(0→-8px) + box-shadow expand [200ms]
  - press: scale(1→0.95) [100ms]
  - remove: translateX(0→100%) + opacity(1→0) [300ms]
```

### 5.2 StatsBar
```jsx
Props: { kingdomLevel, totalResources, sahBalance, musicians }
Animations:
  - number change: countUp animation + green flash
  - level up: explosion particles + golden glow
```

### 5.3 MarketCard
```jsx
Props: { resource, seller, price, onBuy, onCancel }
States: listing | my-listing | sold
Animations:
  - appear: slide from bottom with spring easing
  - buy: card flies to inventory
```

### 5.4 DailyChest
```jsx
Props: { onOpen, canOpen, timeUntilOpen }
Animations:
  - closed: subtle shake every 5s (inviting)
  - opening: chest opens with light burst
  - reveal: cards cascade out one by one
```

---

## 6. Technical Approach

### Frontend Stack
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** CSS Modules + CSS Variables
- **Animations:** CSS Keyframes + Framer Motion concepts
- **State:** React useState/useReducer (local) + Context API

### File Structure
```
src/pages/game/
├── Kingdom.jsx          # Main game page
├── components/
│   ├── ResourceCard.jsx
│   ├── ResourceCard.css
│   ├── StatsBar.jsx
│   ├── StatsBar.css
│   ├── Market.jsx
│   ├── Market.css
│   ├── DailyChest.jsx
│   ├── DailyChest.css
│   └── Animations.css   # Global animation keyframes
├── hooks/
│   └── useGameState.js  # Game state management
└── data/
    └── resources.js      # Resource definitions
```

### API Endpoints (Future)
```
GET  /api/kingdom          → User's kingdom state
POST /api/kingdom/collect  → Daily collection
GET  /api/market           → Active listings
POST /api/market/list      → List resource for sale
POST /api/market/buy/:id   → Buy resource
```

---

## 7. Animation Specifications

### Card Spawn Animation
```css
@keyframes cardSpawn {
  0% {
    transform: scale(0) rotate(-15deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
/* Duration: 400ms, Easing: cubic-bezier(0.34, 1.56, 0.64, 1) */
```

### Hover Glow Effect
```css
.card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(0,0,0,0.4),
    0 0 30px var(--glow-color);
}
```

### Number Update Animation
```css
@keyframes countUp {
  0% { transform: translateY(20px); opacity: 0; }
  50% { color: #2ecc71; }
  100% { transform: translateY(0); opacity: 1; }
}
```

### Legendary Card Pulse
```css
@keyframes legendaryPulse {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212,175,55,0.4);
  }
  50% { 
    box-shadow: 0 0 40px rgba(212,175,55,0.8);
  }
}
```

---

## 8. Success Metrics

| Feature | Target | Validation |
|---------|--------|------------|
| Card animations | 60fps | No jank on hover/click |
| Market load time | <1s | Perceived snappiness |
| Daily chest | Engaging | User returns in 24h |
| Trading volume | 10+ trades/day | Active market |

---

## 9. Future Phases

### Phase 2: Multiplayer
- Guild kingdoms
- Resource sharing
- Collaborative events

### Phase 3: NFT Integration
- Tradeable resources as NFTs
- Marketplace on BNB Chain
- SAH Token staking

### Phase 4: AI Features
- AI musician assistants
- Auto-mixing resources
- Personalized recommendations
