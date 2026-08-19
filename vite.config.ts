import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/

function googleTagManager(gtmId: string): Plugin {
  return {
    name: 'ygrow-google-tag-manager',
    transformIndexHtml(html) {
      if (!gtmId) return html

      const script = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});</script>`
      const noScript = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>`

      return html
        .replace('<head>', `<head>\n    ${script}`)
        .replace('<body>', `<body>\n    ${noScript}`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const configuredGtmId = env.VITE_GTM_ID?.trim().toUpperCase() ?? ''
  const gtmId = GTM_ID_PATTERN.test(configuredGtmId) ? configuredGtmId : ''

  return {
    plugins: [react(), googleTagManager(gtmId)],
    build: {
      // Three.js is lazy-loaded as a separate hero-effect chunk.
      chunkSizeWarningLimit: 550,
    },
    server: {
      host: '127.0.0.1',
      port: 3001,
      strictPort: true,
    },
    preview: {
      host: '127.0.0.1',
      port: 3001,
      strictPort: true,
    },
  }
})
