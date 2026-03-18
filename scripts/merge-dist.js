const fs = require('fs')
const path = require('path')

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d)
  }
}

const root = path.resolve(__dirname, '..')
fs.rmSync(path.join(root, 'dist'), { recursive: true, force: true })

copyDir(path.join(root, 'landing/dist'),        path.join(root, 'dist'))
copyDir(path.join(root, '3d-viewer/dist'),      path.join(root, 'dist/3d-viewer'))
copyDir(path.join(root, 'json-formatter/dist'), path.join(root, 'dist/json'))
copyDir(path.join(root, 'base64-encoder/dist'), path.join(root, 'dist/base64'))
copyDir(path.join(root, 'regex-tester/dist'),   path.join(root, 'dist/regex'))

console.log('✓ dist merged successfully')
