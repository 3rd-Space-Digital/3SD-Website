import { useState, useEffect, useCallback, useRef } from 'react'
import logoIcon from '../assets/svgs/3SD.svg'
import { useHomepageReveal } from '../context/HomepageRevealContext'
import './Homepage.css'

const PHRASE = 'Third Space Digital'
const REPULSION_DISTANCE = 1000
const REPULSION_STRENGTH = 50
const EXPAND_REPULSION_STRENGTH = 2700
const EXPAND_REPULSION_DISTANCE = 5000
const LERP = 0.33
const COLUMN_COUNT = 6
const ROWS_PER_COLUMN = 24
const SCROLL_SPEED = 1
const COLUMN_GAP = 0
const ROW_GAP = 0.2
const FADE_HEIGHT = 0.12
const EXPAND_RAMP_DURATION = 800

function Homepage() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 })
  const [revealed, setRevealed] = useState(false)
  const [expanding, setExpanding] = useState(false)
  const expandStartRef = useRef(0)
  const clickPosRef = useRef({ x: 0, y: 0 })
  const scrollOffsetsRef = useRef(Array(COLUMN_COUNT).fill(0))
  const smoothedOffsetsRef = useRef({})
  const mousePosRef = useRef({ x: -9999, y: -9999 })
  const { setHomepageRevealed } = useHomepageReveal()

  mousePosRef.current = mouse

  useEffect(() => {
    return () => setHomepageRevealed(false)
  }, [setHomepageRevealed])

  const handleMouseMove = useCallback((e) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: -9999, y: -9999 })
  }, [])

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      setMouse({ x: touch.clientX, y: touch.clientY })
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    setMouse({ x: -9999, y: -9999 })
  }, [])

  const handleLogoClick = useCallback((e) => {
    e.stopPropagation()
    if (revealed || expanding) return
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    // Set click position to the center of the screen
    clickPosRef.current = {
      x: containerRect.width / 2,
      y: containerRect.height / 2,
    }
    setExpanding(true)
    expandStartRef.current = performance.now()
  }, [revealed, expanding])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    let raf = null

    const chars = [...PHRASE]
    let layout = { fontSize: 14, letterSpacing: 0, charWidths: [], phraseWidth: 0, rowHeight: 0, columnWidth: 0, totalContentHeight: 0 }

    const updateLayout = () => {
      layout.fontSize = Math.min(48, Math.max(24, Math.min(container.clientWidth, container.clientHeight) * 0.05))
      layout.letterSpacing = layout.fontSize * -0.02
      ctx.font = `900 ${layout.fontSize}px Inter, system-ui, sans-serif`
      layout.charWidths = chars.map((c) => ctx.measureText(c).width)
      layout.phraseWidth = layout.charWidths.reduce((a, w) => a + w, 0) + layout.letterSpacing * (chars.length - 1)
      layout.rowHeight = layout.fontSize * (1 + ROW_GAP)
      layout.columnWidth = layout.phraseWidth * (1 + COLUMN_GAP)
      layout.totalContentHeight = layout.rowHeight * ROWS_PER_COLUMN
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      updateLayout()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const getKey = (col, row, i) => `${col}-${row}-${i}`
    const getSmoothed = (key) => {
      if (!smoothedOffsetsRef.current[key]) smoothedOffsetsRef.current[key] = { dx: 0, dy: 0 }
      return smoothedOffsetsRef.current[key]
    }

    const draw = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      const canvasRect = canvas.getBoundingClientRect()

      let mx, my, strength, dist, scrollFrozen = false, rampComplete = false
      if (expanding) {
        const elapsed = performance.now() - expandStartRef.current
        const t = Math.min(1, elapsed / EXPAND_RAMP_DURATION)
        rampComplete = t >= 1
        const easeT = 1 - Math.pow(1 - t, 1.2)
        const { x: cx, y: cy } = clickPosRef.current
        mx = cx
        my = cy
        strength = EXPAND_REPULSION_STRENGTH * easeT
        dist = REPULSION_DISTANCE + (EXPAND_REPULSION_DISTANCE - REPULSION_DISTANCE) * easeT
        scrollFrozen = true
      } else {
        const { x: mwx, y: mwy } = mousePosRef.current
        mx = mwx - canvasRect.left
        my = mwy - canvasRect.top
        strength = REPULSION_STRENGTH
        dist = REPULSION_DISTANCE
      }

      ctx.clearRect(0, 0, w, h)

      const { phraseWidth, rowHeight, columnWidth, totalContentHeight, fontSize, letterSpacing, charWidths } = layout
      const totalColWidth = columnWidth * COLUMN_COUNT
      let anyVisible = false
      const startX = (w - totalColWidth) / 2 + columnWidth / 2
      const pad = Math.max(REPULSION_STRENGTH + 20, strength + 40)

      for (let col = 0; col < COLUMN_COUNT; col++) {
        const colX = startX + col * columnWidth
        const direction = col % 2 === 0 ? 1 : -1
        let sy = scrollOffsetsRef.current[col]
        if (!scrollFrozen) {
          sy += SCROLL_SPEED * direction
          sy = ((sy % totalContentHeight) + totalContentHeight) % totalContentHeight
          scrollOffsetsRef.current[col] = sy
        }
        const scrollY = sy
        const colLeft = colX - phraseWidth / 2

        ctx.save()
        ctx.beginPath()
        if (scrollFrozen) {
          const clipMargin = 800
          ctx.rect(-clipMargin, -clipMargin, w + clipMargin * 2, h + clipMargin * 2)
        } else {
          ctx.rect(colLeft - pad, 0, phraseWidth + pad * 2, h)
        }
        ctx.clip()

        const startRow = Math.floor((scrollY - rowHeight) / rowHeight)
        const endRow = Math.ceil((scrollY + h + rowHeight) / rowHeight)
        for (let row = startRow; row <= endRow; row++) {
          const baseY = -scrollY + row * rowHeight
          if (baseY < -rowHeight || baseY > h + rowHeight) continue

          let x = colLeft
          for (let i = 0; i < chars.length; i++) {
            const c = chars[i]
            const cw = charWidths[i]
            const centerX = x + cw / 2
            const centerY = baseY + fontSize / 2

            let targetDx = 0
            let targetDy = 0
            const d = Math.hypot(mx - centerX, my - centerY)
            if (d < dist && d > 0) {
              const force = ((dist - d) / dist) * strength
              targetDx = ((centerX - mx) / d) * force
              targetDy = ((centerY - my) / d) * force
            }

            const key = getKey(col, row, i)
            const s = getSmoothed(key)
            const lerp = expanding ? 0.5 : LERP
            s.dx += (targetDx - s.dx) * lerp
            s.dy += (targetDy - s.dy) * lerp

            const drawX = x + s.dx
            const drawY = baseY + fontSize + s.dy

            if (scrollFrozen) {
              const buffer = Math.max(fontSize * 4, 150)
              const charRight = drawX + cw
              const charBottom = drawY + fontSize * 0.3
              const charTop = drawY - fontSize
              const overlapsViewport =
                charRight >= -buffer &&
                drawX <= w + buffer &&
                charTop <= h + buffer &&
                charBottom >= -buffer
              if (overlapsViewport) anyVisible = true
            }
            ctx.fillStyle = '#000'
            ctx.fillText(c, drawX, drawY)
            x += cw + letterSpacing
          }
        }
        ctx.restore()
      }

      if (scrollFrozen && rampComplete && !anyVisible) {
        setExpanding(false)
        setRevealed(true)
        setHomepageRevealed(true)
      }

      ctx.save()
      const fadeHeight = h * FADE_HEIGHT
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, 'rgba(255,255,255,0)')
      grad.addColorStop(fadeHeight / h, 'rgba(255,255,255,1)')
      grad.addColorStop(1 - fadeHeight / h, 'rgba(255,255,255,1)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [expanding])

  return (
    <main
      className="homepage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <section className="homepage-canvas-container" ref={containerRef}>
        <div className={`homepage-reveal ${revealed ? 'homepage-reveal--visible' : ''}`}>
          <div className="homepage-reveal-content">
            <h2 className="homepage-reveal-title">
              <span className="homepage-reveal-line1">You asked.</span>
              <br />
              <span className="homepage-reveal-line2">We answered.</span>
            </h2>
            <p className="homepage-reveal-text homepage-reveal-p1">
              3rd Space Digital is a social events organization and visual arts editorial made for creatives, by creatives. 
              We exist to build what so many people were looking for – a third space. Not home, not work, but somewhere in between.
            </p>
            <p className="homepage-reveal-text homepage-reveal-p2">
              Our organization gives people a place to connect outside the mundane routine of classes and deadlines. 
              We bring photographers, writers, designers, models, dancers, and many more altogether through immersive events 
              and collaborative storytelling. We facilitate experiences where growth is collective.
            </p>
            <p className="homepage-reveal-text homepage-reveal-p3">
              Every gathering has a purpose.<br />
              Every article is collaborative.<br />
              Every moment in 3rd Space Digital is designed to spark something new.
            </p>
            <p className="homepage-reveal-text homepage-reveal-p4" style={{ fontStyle: 'italic', marginTop: '1.5rem' }}>
              It's time to create more than you consume.
            </p>
          </div>
        </div>
        <button
          ref={logoRef}
          type="button"
          className={`homepage-logo ${expanding || revealed ? 'homepage-logo--dropping' : ''}`}
          onClick={handleLogoClick}
          aria-label="Explore"
        >
          <img src={logoIcon} alt="" />
        </button>
        {!revealed && (
          <canvas ref={canvasRef} className="homepage-canvas" />
        )}
      </section>
    </main>
  )
}

export default Homepage
