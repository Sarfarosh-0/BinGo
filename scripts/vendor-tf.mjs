// Vendors the pinned TensorFlow.js UMD bundle out of node_modules into public/
// so the app can load it same-origin. This removes the third-party CDN from the
// critical path (supply-chain + availability) and lets us ship a strict CSP.
//
// Run with: npm run vendor:tf   (re-run when bumping @tensorflow/tfjs)
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'node_modules/@tensorflow/tfjs/dist/tf.min.js')
const dest = resolve(root, 'public/vendor/tf.min.js')

mkdirSync(dirname(dest), { recursive: true })
copyFileSync(src, dest)
console.log(`Vendored TensorFlow.js -> ${dest}`)
