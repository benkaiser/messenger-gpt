import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'messenger-gpt',
  description: 'Generate replies for messenger.com using ChatGPT',
  version: '0.0.0',
  manifest_version: 3,
  icons: {
    '16': 'img/logo-16.png',
    '32': 'img/logo-32.png',
    '48': 'img/logo-48.png',
    '128': 'img/logo-128.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*.messenger.com/*', 'https://*.messenger.com/*'],
      js: ['src/content/index.tsx'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-16.png', 'img/logo-32.png', 'img/logo-48.png', 'img/logo-128.png'],
      matches: [],
    },
  ],
  permissions: ['storage'],
})
