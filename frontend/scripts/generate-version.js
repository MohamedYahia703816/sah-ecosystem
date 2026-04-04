import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const version = {
  build: Date.now(),
  timestamp: new Date().toISOString(),
  gitHash: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
}

const distPath = path.join(__dirname, '..', 'dist')
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true })
}

fs.writeFileSync(
  path.join(distPath, 'version.json'),
  JSON.stringify(version, null, 2)
)

console.log('version.json created:', version.timestamp)
