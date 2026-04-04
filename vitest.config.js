import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    svgr({ include: '**/*.svg', svgrOptions: { exportType: 'named' } })
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.{js,ts,tsx}', 'server/**/*.test.{js,ts}'],
    exclude: ['node_modules', '.cache', 'public'],
    setupFiles: ['src/test/setup.ts'],
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    }
  }
})
