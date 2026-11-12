import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fsp from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(projectRoot, 'data', 'study-data.json')

// Tiny local file-storage API —/api/data
// GET  => data/study-data.json ka content (ya {})
// POST => pura sb_* snapshot disk me likh deta hai
// Isse browser ka storage reset ho jaye to bhi data safe rehta hai —
// sirf manual delete se hi data jata hai.
function fileStorage() {
  async function readData() {
    try { return await fsp.readFile(DATA_FILE, 'utf8') } catch { return null }
  }
  async function writeData(raw) {
    await fsp.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fsp.writeFile(DATA_FILE, raw, 'utf8')
  }
  function middleware() {
    return (req, res, next) => {
      if (!req.url.startsWith('/api/data')) return next()
      if (req.method === 'GET') {
        readData()
          .then(txt => {
            res.setHeader('Content-Type', 'application/json')
            res.end(txt || '{}')
          })
          .catch(() => { res.statusCode = 500; res.end('{"error":1}') })
        return
      }
      if (req.method === 'POST' || req.method === 'PUT') {
        const chunks = []
        req.on('data', c => chunks.push(c))
        req.on('end', async () => {
          try {
            const raw = Buffer.concat(chunks).toString('utf8')
            JSON.parse(raw) // sanity check
            await writeData(raw)
            res.setHeader('Content-Type', 'application/json')
            res.end('{"ok":1}')
          } catch {
            res.statusCode = 400
            res.end('{"error":1}')
          }
        })
        return
      }
      next()
    }
  }
  return {
    name: 'sb-file-storage',
    configureServer(server) { server.middlewares.use(middleware()) },
    configurePreviewServer(server) { server.middlewares.use(middleware()) },
  }
}

export default defineConfig({
  plugins: [react(), fileStorage()],
  server: {
    host: true, // 📱 phone se access: http://<PC-IP>:5173 (Network URL terminal me dikhta hai)
    // OneDrive-synced folder me normal file-watch khaali fail hota hai — polling on
    watch: { usePolling: true, interval: 300 },
  },
  preview: {
    host: true, // 📱 `npm run preview` bhi LAN par khule
  },
})
