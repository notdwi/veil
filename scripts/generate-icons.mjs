// Rasterises assets/icon.svg, then hands it to the Tauri icon generator.
// Mobile targets are dropped — VEIL ships desktop only.
import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import sharp from 'sharp'

const SOURCE = 'assets/icon.svg'
const RASTER = 'assets/icon.png'
const OUT = 'src-tauri/icons'

await sharp(SOURCE, { density: 900 }).resize(1024, 1024).png().toFile(RASTER)
console.log(`rasterised ${SOURCE} -> ${RASTER}`)

execFileSync('npx', ['tauri', 'icon', RASTER, '-o', OUT], { stdio: 'inherit', shell: true })

for (const dir of ['android', 'ios']) {
  rmSync(`${OUT}/${dir}`, { recursive: true, force: true })
}
console.log('icon set written')
