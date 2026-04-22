import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { svgPathProperties } from 'svg-path-properties'

function usage() {
  return `
svg-to-polygon.mjs

Converts SVG outline(s) into CSS polygon points in percentages.

Usage:
  node scripts/svg-to-polygon.mjs <fileOrFolder> [--points 48] [--precision 2] [--pick longest|first] [--print css|raw]

Examples:
  node scripts/svg-to-polygon.mjs "C:\\path\\outline.svg" --points 56
  node scripts/svg-to-polygon.mjs "./scripts/outlines" --points 48 --pick longest
`
}

function parseArgs(argv) {
  const args = {
    target: null,
    points: 48,
    precision: 2,
    pick: 'longest',
    print: 'css'
  }

  const positional = []
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--points') args.points = Number(argv[++i])
    else if (a === '--precision') args.precision = Number(argv[++i])
    else if (a === '--pick') args.pick = String(argv[++i] ?? '')
    else if (a === '--print') args.print = String(argv[++i] ?? '')
    else if (a === '-h' || a === '--help') args.help = true
    else if (a.startsWith('--')) throw new Error(`Unknown flag: ${a}`)
    else positional.push(a)
  }

  args.target = positional[0] ?? null
  return args
}

function extractViewBox(svgText) {
  const m = svgText.match(/viewBox\s*=\s*"\s*([\d.+-eE]+)\s+([\d.+-eE]+)\s+([\d.+-eE]+)\s+([\d.+-eE]+)\s*"/)
  if (m) {
    return {
      minX: Number(m[1]),
      minY: Number(m[2]),
      width: Number(m[3]),
      height: Number(m[4])
    }
  }

  const widthM = svgText.match(/\bwidth\s*=\s*"\s*([\d.+-eE]+)(px)?\s*"/)
  const heightM = svgText.match(/\bheight\s*=\s*"\s*([\d.+-eE]+)(px)?\s*"/)
  if (widthM && heightM) {
    return {
      minX: 0,
      minY: 0,
      width: Number(widthM[1]),
      height: Number(heightM[1])
    }
  }

  return null
}

function normalizePathD(d) {
  return String(d)
    .trim()
    .replace(/\s+/g, ' ')
}

function extractPaths(svgText) {
  const paths = []

  // Match <path ...> even when attributes / d="..." span multiple lines.
  // Supports d="..." or d='...'
  const reDouble = /<path\b[\s\S]*?\bd\s*=\s*"([\s\S]*?)"[\s\S]*?>/g
  const reSingle = /<path\b[\s\S]*?\bd\s*=\s*'([\s\S]*?)'[\s\S]*?>/g

  let m
  while ((m = reDouble.exec(svgText))) {
    const d = normalizePathD(m[1])
    if (d) paths.push(d)
  }
  while ((m = reSingle.exec(svgText))) {
    const d = normalizePathD(m[1])
    if (d) paths.push(d)
  }

  return paths
}

function pickPathD(paths, pick) {
  if (paths.length === 0) return null
  if (pick === 'first') return paths[0]
  if (pick !== 'longest') throw new Error(`--pick must be "longest" or "first" (got "${pick}")`)

  let best = paths[0]
  let bestLen = -Infinity
  for (const d of paths) {
    try {
      const props = new svgPathProperties(d)
      const len = props.getTotalLength()
      if (len > bestLen) {
        bestLen = len
        best = d
      }
    } catch {
      // ignore invalid paths
    }
  }
  return best
}

function toPercentPolygon({ d, viewBox, points, precision }) {
  if (!viewBox) throw new Error('SVG is missing viewBox (or width/height). Add a viewBox for consistent % output.')
  if (!Number.isFinite(points) || points < 3) throw new Error('--points must be a number >= 3')
  if (!Number.isFinite(precision) || precision < 0) throw new Error('--precision must be a number >= 0')

  const props = new svgPathProperties(d)
  const total = props.getTotalLength()

  const fmt = (n) => Number(n.toFixed(precision))

  const pts = []
  for (let i = 0; i < points; i++) {
    const t = (i / points) * total
    const { x, y } = props.getPointAtLength(t)
    const xPct = ((x - viewBox.minX) / viewBox.width) * 100
    const yPct = ((y - viewBox.minY) / viewBox.height) * 100
    pts.push(`${fmt(xPct)}% ${fmt(yPct)}%`)
  }

  return `polygon(${pts.join(', ')})`
}

async function listSvgFiles(targetPath) {
  const stat = await fs.stat(targetPath)
  if (stat.isFile()) return [targetPath]
  if (!stat.isDirectory()) return []

  const entries = await fs.readdir(targetPath, { withFileTypes: true })
  const svgs = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.svg'))
    .map((e) => path.join(targetPath, e.name))
    .sort((a, b) => a.localeCompare(b))

  return svgs
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help || !args.target) {
    console.log(usage().trim())
    process.exit(0)
  }

  const files = await listSvgFiles(args.target)
  if (files.length === 0) {
    throw new Error(`No SVG files found at: ${args.target}`)
  }

  for (const file of files) {
    const svgText = await fs.readFile(file, 'utf8')
    const viewBox = extractViewBox(svgText)
    const paths = extractPaths(svgText)
    const d = pickPathD(paths, args.pick)

    if (!d) {
      console.error(`[skip] ${path.basename(file)}: no <path d="..."> found`)
      continue
    }

    const poly = toPercentPolygon({
      d,
      viewBox,
      points: args.points,
      precision: args.precision
    })

    const name = path.basename(file)
    if (args.print === 'raw') {
      console.log(`${name}\t${poly}`)
    } else if (args.print === 'css') {
      console.log(`/* ${name} */`)
      console.log(`clip-path: ${poly};`)
      console.log(`shape-outside: ${poly};`)
      console.log('')
    } else {
      throw new Error(`--print must be "css" or "raw" (got "${args.print}")`)
    }
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err))
  process.exit(1)
})

