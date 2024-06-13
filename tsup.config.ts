import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/**/*.ts'],
  format: 'esm',
  // splitting: true,
  // sourcemap: true,
  clean: true,
})
