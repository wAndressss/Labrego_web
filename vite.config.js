import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// En desarrollo (npm run dev) atiende /api/* con las mismas funciones que
// usa Vercel en producción, para poder probar el envío de cotizaciones.
function localApi() {
  return {
    name: 'labrego-local-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\/+/, '')
        if (!/^[a-z-]+$/.test(name)) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.js`)
          await mod.default(req, res)
        } catch (err) {
          if (err?.code === 'ERR_LOAD_URL' || /Failed to load url/.test(err?.message)) return next()
          server.config.logger.error(err?.stack || String(err))
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Error en el servidor local.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Las variables de .env.local (SMTP_USER, QUOTE_SECRET...) quedan
  // disponibles para las funciones de /api, nunca para el navegador
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [react(), localApi()],
  }
})
