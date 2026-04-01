const { Telegraf } = require('telegraf')
const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()
const PORT = process.env.PORT || 3000

const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-vercel-url.vercel.app'

app.get('/', (req, res) => {
  res.json({ status: 'ok', bot: 'SAH Music Studio', uptime: process.uptime() })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

bot.start((ctx) => {
  ctx.reply(
    '🎹 Welcome to SAH Music Studio!\n\nBuild your music empire, earn SAH coins, and climb the leaderboard!\n\nTap the button below to open your studio:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎵 Open Studio',
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      },
    }
  )
})

bot.on('message', (ctx) => {
  ctx.reply(
    '🎹 Tap the button below to open your studio:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🎵 Open Studio',
              web_app: { url: WEBAPP_URL },
            },
          ],
        ],
      },
    }
  )
})

bot.launch().then(() => {
  console.log('🎹 SAH Music Studio Bot is running...')
})

app.listen(PORT, () => {
  console.log(`🌐 Health check server running on port ${PORT}`)
})

process.once('SIGINT', () => {
  bot.stop('SIGINT')
  process.exit(0)
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
  process.exit(0)
})
