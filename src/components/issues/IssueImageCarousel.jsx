import { useState, useEffect, useMemo, useRef } from 'react'

const DEFAULT_IMAGES_PER_VIEW = 4

/**
 * Carousel used by issue articles (e.g. We The People, Urban Interlude).
 * @param {string} ns — Class prefix, e.g. 'article2' or 'article4' (CSS: `.${ns}-carousel`, …)
 */
export function IssueImageCarousel({
  images,
  carouselId,
  onImageClick,
  ns,
  altLabel = 'Gallery',
  imagesPerView = DEFAULT_IMAGES_PER_VIEW
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const totalImages = images.length
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const [slideStep, setSlideStep] = useState(0)

  if (totalImages === 0) {
    return null
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      if (nextIndex >= totalImages) {
        return 0
      }
      return nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const prevIndexNew = prevIndex - 1
      if (prevIndexNew < 0) {
        return totalImages - 1
      }
      return prevIndexNew
    })
  }

  const trackImages = useMemo(() => [...images, ...images], [images])

  useEffect(() => {
    const updateSlideStep = () => {
      if (!viewportRef.current || !trackRef.current) return

      const viewportWidth = viewportRef.current.clientWidth
      const trackStyles = window.getComputedStyle(trackRef.current)
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0
      const columns =
        parseInt(trackStyles.getPropertyValue('--carousel-columns'), 10) || imagesPerView
      const itemWidth = (viewportWidth - gap * (columns - 1)) / columns
      setSlideStep(itemWidth + gap)
    }

    updateSlideStep()
    window.addEventListener('resize', updateSlideStep)
    return () => window.removeEventListener('resize', updateSlideStep)
  }, [totalImages, imagesPerView])

  const c = (suffix) => `${ns}-${suffix}`

  return (
    <div className={c('carousel')}>
      <button
        type="button"
        className={`${c('carousel-arrow')} ${c('carousel-arrow-left')}`}
        onClick={prevSlide}
        aria-label="Previous images"
      >
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      <div className={c('carousel-images')} ref={viewportRef}>
        <div
          className={c('carousel-track')}
          ref={trackRef}
          style={{ transform: `translateX(-${currentIndex * slideStep}px)` }}
        >
          {trackImages.map((image, idx) => (
            <div
              key={`${carouselId}-track-${idx}`}
              className={`${c('carousel-track-item')} ${c('carousel-image-wrap')}`}
              onClick={() => onImageClick(idx % totalImages)}
            >
              <img
                src={image}
                alt={`${altLabel} ${(idx % totalImages) + 1}`}
                className={c('carousel-image')}
                loading={idx < totalImages ? 'eager' : 'lazy'}
                fetchPriority={idx < imagesPerView ? 'high' : 'auto'}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`${c('carousel-arrow')} ${c('carousel-arrow-right')}`}
        onClick={nextSlide}
        aria-label="Next images"
      >
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  )
}
