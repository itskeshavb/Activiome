import { useRef, useState, useEffect } from 'react'

/**
 * Lazy-loading video player. The <video> src is only set once the element
 * enters the viewport, preventing all clips from loading simultaneously.
 */
export default function VideoPlayer({ src }) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full bg-muted rounded overflow-hidden"
      style={{ aspectRatio: '3 / 4' }}
    >
      {isVisible && src ? (
        <video
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {isVisible && !src ? 'No video' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
