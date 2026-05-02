import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ISP_OFFICERS } from '../data/ispy/officers'
import { ISP_ITEMS, ISP_SCENE_WIDTH, ISP_SCENE_HEIGHT } from '../data/ispy/items'
import { getRevealByItemId } from '../data/ispy/reveals'
import './IspyPage.css'

/** Wrong match: ~1s solid glow, then quick fade (total animation length). */
const MATCH_PULSE_MS = 1400
/** Correct match: open modal when green animation ends — keep in sync with `.ispy-cutout--match-ok` / polaroid CSS `1.4s` */
const MATCH_OK_GREEN_MS = 1400

function isCorrectMatch(itemId, officerId) {
  const officer = ISP_OFFICERS.find((o) => o.id === officerId)
  return Boolean(officer && officer.matchesItemId === itemId)
}

export default function IspyPage() {
  const viewportRef = useRef(null)
  const pulseTimerRef = useRef(null)
  const revealCloseRef = useRef(null)
  const [scale, setScale] = useState(1)
  const [pickedItemId, setPickedItemId] = useState(null)
  const [pickedOfficerId, setPickedOfficerId] = useState(null)
  const [matchPulse, setMatchPulse] = useState(null)
  const [revealModal, setRevealModal] = useState(null)

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      if (!w || !h) return
      const s = Math.min(w / ISP_SCENE_WIDTH, h / ISP_SCENE_HEIGHT)
      setScale(s || 1)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const prev = document.title
    document.title = 'Game · 3SD'
    return () => {
      document.title = prev
    }
  }, [])

  useEffect(
    () => () => {
      if (pulseTimerRef.current != null) {
        window.clearTimeout(pulseTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (!revealModal) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => revealCloseRef.current?.focus(), 0)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
    }
  }, [revealModal])

  useEffect(() => {
    if (!revealModal) return
    const onKey = (e) => {
      if (e.key === 'Escape') setRevealModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [revealModal])

  const busy = matchPulse != null || revealModal != null

  function clearPulseLater() {
    if (pulseTimerRef.current != null) {
      window.clearTimeout(pulseTimerRef.current)
    }
    pulseTimerRef.current = window.setTimeout(() => {
      setMatchPulse(null)
      pulseTimerRef.current = null
    }, MATCH_PULSE_MS)
  }

  function resolvePair(itemId, officerId) {
    const ok = isCorrectMatch(itemId, officerId)
    setPickedItemId(null)
    setPickedOfficerId(null)
    if (ok) {
      setMatchPulse({ result: 'ok', itemId, officerId })
      if (pulseTimerRef.current != null) {
        window.clearTimeout(pulseTimerRef.current)
      }
      pulseTimerRef.current = window.setTimeout(() => {
        setMatchPulse(null)
        setRevealModal({ officerId, itemId })
        pulseTimerRef.current = null
      }, MATCH_OK_GREEN_MS)
      return
    }
    setMatchPulse({ result: 'bad', itemId, officerId })
    clearPulseLater()
  }

  function closeRevealModal() {
    setRevealModal(null)
  }

  function onItemClick(id) {
    if (busy) return
    if (pickedOfficerId) {
      resolvePair(id, pickedOfficerId)
      return
    }
    if (pickedItemId === id) {
      setPickedItemId(null)
      return
    }
    setPickedItemId(id)
  }

  function onOfficerClick(officerId) {
    if (busy) return
    if (pickedItemId) {
      resolvePair(pickedItemId, officerId)
      return
    }
    if (pickedOfficerId === officerId) {
      setPickedOfficerId(null)
      return
    }
    setPickedOfficerId(officerId)
  }

  const pickedItem = pickedItemId
    ? ISP_ITEMS.find((i) => i.id === pickedItemId)
    : null
  const pickedOfficer = pickedOfficerId
    ? ISP_OFFICERS.find((o) => o.id === pickedOfficerId)
    : null

  let footerMessage =
    'Pick an object in the scene or an officer below, then pick the other to try a match.'
  if (revealModal) {
    footerMessage = 'Close the story (✕ or Escape) when you’re ready to keep playing.'
  } else if (matchPulse?.result === 'ok') {
    footerMessage = 'Correct match! Opening their story…'
  } else if (matchPulse) {
    footerMessage = 'Not a match — try again.'
  } else if (pickedItem) {
    footerMessage = `Selected: ${pickedItem.label}. Now pick an officer.`
  } else if (pickedOfficer) {
    footerMessage = `Selected: ${pickedOfficer.label}. Now pick an object in the scene.`
  }

  return (
    <main className="ispy-page" aria-label="I SPY, Third Space Edition">
      <div className="ispy-stack">
        <header className="ispy-game-banner">
          <h2 className="ispy-game-banner-title">
            <span className="ispy-game-banner-line1">{'I\u2009SPY'}</span>
            <span className="ispy-game-banner-line2">Third Space Edition</span>
          </h2>
        </header>
        <div className="ispy-frame-outline">
          <div className="ispy-frame-body">
            <div ref={viewportRef} className="ispy-viewport">
              <div
                className="ispy-scene-slot"
                style={{
                  width: ISP_SCENE_WIDTH * scale,
                  height: ISP_SCENE_HEIGHT * scale,
                }}
              >
                <div
                  className="ispy-scene"
                  role="presentation"
                  style={{
                    width: ISP_SCENE_WIDTH,
                    height: ISP_SCENE_HEIGHT,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  {ISP_ITEMS.map((item) => {
                    const isPicked = item.id === pickedItemId
                    const flash =
                      matchPulse && matchPulse.itemId === item.id
                        ? matchPulse.result
                        : null
                    const {
                      id,
                      label,
                      left,
                      top,
                      width,
                      height,
                      zBase = 0,
                      imageRotate,
                      img,
                      hitSvg,
                    } = item
                    return (
                      <button
                        key={id}
                        type="button"
                        disabled={busy}
                        className={[
                          'ispy-cutout',
                          isPicked ? 'ispy-cutout--selected' : '',
                          flash === 'ok' ? 'ispy-cutout--match-ok' : '',
                          flash === 'bad' ? 'ispy-cutout--match-bad' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        style={{
                          '--ispy-z': zBase,
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                        }}
                        onClick={() => onItemClick(id)}
                        aria-label={`${label}${isPicked ? ' (selected)' : ''}`}
                        aria-pressed={isPicked}
                      >
                        <img
                          className="ispy-cutout__photo"
                          src={img}
                          alt=""
                          draggable={false}
                          style={
                            imageRotate != null
                              ? { transform: `rotate(${imageRotate}deg)` }
                              : undefined
                          }
                        />
                        <img
                          className="ispy-cutout__hit"
                          src={hitSvg}
                          alt=""
                          draggable={false}
                          aria-hidden
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ispy-officers-strip">
        <div className="ispy-officers" role="group" aria-label="Officers">
          {ISP_OFFICERS.map(({ id, label, img1, img2 }) => {
            const isPicked = id === pickedOfficerId
            const flash =
              matchPulse && matchPulse.officerId === id
                ? matchPulse.result
                : null
            return (
              <button
                key={id}
                type="button"
                disabled={busy}
                className={[
                  'ispy-polaroid',
                  isPicked ? 'ispy-polaroid--picked' : '',
                  flash === 'ok' ? 'ispy-polaroid--match-ok' : '',
                  flash === 'bad' ? 'ispy-polaroid--match-bad' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={`${label}. Hover or focus for alternate portrait. ${isPicked ? 'Selected.' : ''}`}
                aria-pressed={isPicked}
                onClick={() => onOfficerClick(id)}
              >
                <div className="ispy-polaroid__photo">
                  <img
                    className="ispy-polaroid__img ispy-polaroid__img--front"
                    src={img1}
                    alt=""
                    draggable={false}
                  />
                  <img
                    className="ispy-polaroid__img ispy-polaroid__img--back"
                    src={img2}
                    alt=""
                    draggable={false}
                  />
                </div>
                <span className="ispy-polaroid__caption">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="ispy-stack">
        <footer className="ispy-footer" aria-live="polite">
          <p>{footerMessage}</p>
        </footer>
      </div>

      {revealModal &&
        createPortal(
          <RevealStoryModal
            officerId={revealModal.officerId}
            itemId={revealModal.itemId}
            closeRef={revealCloseRef}
            onClose={closeRevealModal}
          />,
          document.body,
        )}
    </main>
  )
}

function RevealStoryModal({ officerId, itemId, closeRef, onClose }) {
  const officer = ISP_OFFICERS.find((o) => o.id === officerId)
  const item = ISP_ITEMS.find((i) => i.id === itemId)
  const quote =
    getRevealByItemId(itemId) ??
    'Thanks for finding this item — their story will go here soon.'

  if (!officer) return null

  const titleId = 'ispy-reveal-modal-title'

  return (
    <div
      className="ispy-reveal-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="ispy-reveal-modal__panel">
        <button
          ref={closeRef}
          type="button"
          className="ispy-reveal-modal__close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
        <div className="ispy-reveal-modal__layout">
          <div className="ispy-reveal-modal__polaroid-wrap">
            <div
              className="ispy-reveal-polaroid"
              tabIndex={0}
              aria-label={`${officer.label}: hover or focus for alternate portrait`}
            >
              <div className="ispy-reveal-polaroid__photo">
                <img
                  className="ispy-reveal-polaroid__img ispy-reveal-polaroid__img--front"
                  src={officer.img1}
                  alt=""
                  draggable={false}
                />
                <img
                  className="ispy-reveal-polaroid__img ispy-reveal-polaroid__img--back"
                  src={officer.img2}
                  alt=""
                  draggable={false}
                />
              </div>
              <span className="ispy-reveal-polaroid__caption">{officer.label}</span>
            </div>
          </div>
          <div className="ispy-reveal-modal__copy">
            <h2 id={titleId} className="ispy-reveal-modal__title">
              {officer.label}
              {item ? (
                <>
                  {' '}
                  <span className="ispy-reveal-modal__title-item">
                    · {item.label}
                  </span>
                </>
              ) : null}
            </h2>
            <p className="ispy-reveal-modal__quote">{quote}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
