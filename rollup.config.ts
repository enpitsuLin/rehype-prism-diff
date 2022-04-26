import path from 'path'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

export default defineConfig({
  input: path.join(__dirname, '/src/index.ts'),
  output: {
    file: path.join(__dirname, pkg.main),
    format: 'es',
    name: pkg.name,
    sourcemap: true
  },
  plugins: [typescript(), commonjs()]
})
