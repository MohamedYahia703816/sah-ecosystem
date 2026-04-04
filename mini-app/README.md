# SAH Mini App — Telegram Music Studio

> A tap-to-earn Telegram Mini App with professional AI music production tools.

[![Live](https://img.shields.io/badge/Status-Live-brightgreen)](https://sah-music.vercel.app)
[![Telegram](https://img.shields.io/badge/Bot-@Sah__Sonic__bot-26A5E4?logo=telegram)](https://t.me/Sah_Sonic_bot)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel)](https://sah-music.vercel.app)

---

## 🎵 What Is It?

SAH Mini App is a **Telegram-based music studio game** where you:
- 🎹 Build your music empire by collecting instruments
- 💰 Earn SAH tokens passively (profit/hour)
- 🤖 Use AI tools for real music production
- 🏆 Compete on the global leaderboard

---

## 🚀 Quick Start

1. Open **@Sah_Sonic_bot** on Telegram
2. Tap **Start** → Receive **400 SAH** bonus
3. Tap **🎵 Open Studio** → Enter the Mini App
4. Choose your music genre → Start earning!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, TypeScript, Tailwind CSS 4, Framer Motion |
| **Bot** | Node.js, Telegraf, Express |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel (frontend), Render (bot) |

---

## 📁 Structure

```
├── frontend/          # React Mini App
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── screens/      # App screens
│   │   ├── context/      # State management
│   │   └── styles/       # Global CSS
│   └── vercel.json
├── bot/               # Telegram Bot
│   ├── index.js
│   └── .env
└── supabase/          # Database config
```

---

## 🎮 Features

| Feature | Description |
|---------|-------------|
| **Tap to Earn** | Collect SAH by building your studio |
| **Multiple Genres** | Choose from different music styles |
| **Instrument Collection** | Buy and upgrade instruments |
| **Passive Income** | Earn SAH every hour |
| **Boosters** | Multiply your earnings |
| **Daily Tasks** | Complete tasks for bonus SAH |
| **Leaderboard** | Compete with musicians worldwide |
| **AI Music Tools** | Stem separation, restoration, MIDI |

---

## 📖 Documentation

- [Getting Started](docs/getting-started.md) — How to join and earn
- [Tokenomics](docs/tokenomics.md) — $SAH token economics
- [AI Tools](docs/ai-tools.md) — Music production tools
- [Referral System](docs/referral-system.md) — Community growth engine

---

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm install
npm run dev          # Local development
./deploy.sh          # Deploy to Vercel
```

### Bot
```bash
cd bot
npm install
node index.js        # Start the bot
```

---

## 📜 License

MIT
