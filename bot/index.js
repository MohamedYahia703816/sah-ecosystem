const { Telegraf } = require('telegraf')
const express = require('express')
const { createClient } = require('@supabase/supabase-js')
const dotenv = require('dotenv')
const https = require('https')

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const app = express()
const PORT = process.env.PORT || 3000

const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-vercel-url.vercel.app'

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://fosectnadqffvrnepdbo.supabase.co',
  process.env.SUPABASE_KEY || 'sb_publishable_j6JbOMEQjHUILKKpmExnuw_LSCGKWvv'
)

// Track notified users to avoid spam
const notifiedUsers = new Set()

app.get('/', (req, res) => {
  res.json({ status: 'ok', bot: 'SAH Music Studio', uptime: process.uptime() })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

bot.start(async (ctx) => {
  const user = ctx.from
  try {
    await supabase.from('users').upsert({
      id: String(user.id),
      username: user.username || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
    }, { onConflict: 'id' })
  } catch (err) {
    console.error('Failed to register user:', err)
  }

  ctx.reply(
    '🎹 Welcome to SAH Music Studio!\n\nBuild your music empire, earn SAH coins, and climb the leaderboard!\n\nTap the button below to open your studio:',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🎵 Open Studio', web_app: { url: WEBAPP_URL } },
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
            { text: '🎵 Open Studio', web_app: { url: WEBAPP_URL } },
          ],
        ],
      },
    }
  )
})

// Check for app updates and notify users
async function checkForUpdates() {
  try {
    // Fetch version.json from the deployed app
    const versionUrl = new URL('/version.json', WEBAPP_URL)
    
    https.get(versionUrl, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', async () => {
        try {
          const versionInfo = JSON.parse(data)
          const currentVersion = versionInfo.version || versionInfo.timestamp || 'unknown'
          
          // Check if we already notified for this version
          if (notifiedUsers.has(currentVersion)) return
          
          const { data: users, error } = await supabase
            .from('users')
            .select('id')
          
          if (error || !users || users.length === 0) return
          
          console.log(`📢 New version detected: ${currentVersion}. Notifying ${users.length} users...`)
          
          let successCount = 0
          for (const user of users) {
            try {
              await bot.telegram.sendMessage(
                Number(user.id),
                `🔄 *Update Available!*\n\n` +
                `SAH Music Studio has been updated with new features and improvements.\n\n` +
                `Tap below to try the new version:`,
                {
                  parse_mode: 'Markdown',
                  reply_markup: {
                    inline_keyboard: [
                      [{ text: '🎵 Open Updated Studio', web_app: { url: WEBAPP_URL } }],
                    ],
                  },
                }
              )
              successCount++
            } catch (err) {
              console.log(`❌ Failed to notify ${user.id}: ${err.message}`)
            }
          }
          
          notifiedUsers.add(currentVersion)
          console.log(`✅ Update notification sent: ${successCount}/${users.length} users`)
          
        } catch (err) {
          console.log('⚠️ Failed to parse version info')
        }
      })
    }).on('error', (err) => {
      console.log('⚠️ Failed to check for updates:', err.message)
    })
    
  } catch (err) {
    console.log('⚠️ Update check error:', err.message)
  }
}

async function checkAndSendNotifications() {
  try {
    console.log('🔍 Checking for pending notifications...')
    
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('sent', false)
      .order('created_at', { ascending: true })
      .limit(1)

    if (error) {
      console.error('Supabase query error:', error)
      return
    }

    if (!notifications || notifications.length === 0) {
      console.log('No pending notifications')
      return
    }

    const notification = notifications[0]
    console.log(`📤 Found notification: "${notification.title}"`)

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')

    if (usersError) {
      console.error('Failed to fetch users:', usersError)
      return
    }

    console.log(`👥 Found ${users?.length || 0} users`)

    let successCount = 0
    let failCount = 0

    for (const user of (users || [])) {
      try {
        await bot.telegram.sendMessage(
          Number(user.id),
          `📢 *${notification.title}*\n\n${notification.message}`,
          { parse_mode: 'Markdown' }
        )
        successCount++
        console.log(`✅ Sent to ${user.id}`)
      } catch (err) {
        failCount++
        console.log(`❌ Failed to send to ${user.id}: ${err.message}`)
      }
    }

    const { error: updateError } = await supabase
      .from('notifications')
      .update({ sent: true, sent_at: new Date().toISOString() })
      .eq('id', notification.id)

    if (updateError) {
      console.error('Failed to update notification:', updateError)
    } else {
      console.log(`✅ Notification marked as sent: ${successCount} succeeded, ${failCount} failed`)
    }
  } catch (err) {
    console.error('❌ Notification check error:', err)
  }
}

// Start bot
bot.launch()
console.log('🎹 SAH Music Studio Bot is running...')

// Check notifications every 30 seconds
setInterval(checkAndSendNotifications, 30000)
setTimeout(checkAndSendNotifications, 5000)

// Check for app updates every 5 minutes
setInterval(checkForUpdates, 5 * 60 * 1000)
setTimeout(checkForUpdates, 10000)

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
