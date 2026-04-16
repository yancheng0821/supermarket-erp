import path from 'path'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import type { InlineConfig as VitestInlineConfig } from 'vitest/node'
import { defineConfig, type UserConfig } from 'vite'

type TestableViteConfig = UserConfig & {
  test: VitestInlineConfig
}

// https://vite.dev/config/
const config: TestableViteConfig = {
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routeFileIgnorePattern: '\\.(test|spec)\\.(ts|tsx)$',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
}

export default defineConfig(config)
