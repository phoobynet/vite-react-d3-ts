import { useEffect, useRef, useState } from 'react'

export const useSizeObserver = () => {
  const resizeObserver = useRef<ResizeObserver>()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [target, setTarget] = useState<Element | undefined | null>()

  const disconnect = () => {
    if (target) {
      resizeObserver.current?.unobserve(target)
      resizeObserver.current?.disconnect()
    }
  }

  const observe = (targetElement: Element | undefined | null) => {
    if (target) {
      disconnect()
    }

    setTarget(targetElement)
  }

  useEffect(() => {
    if (!target) {
      return
    }

    resizeObserver.current = new ResizeObserver((entries) => {
      const entry = entries[0]

      setWidth(entry.contentRect.width)
      setHeight(entry.contentRect.height)
    })

    resizeObserver.current.observe(target)

    return () => {
      disconnect()
    }
  }, [target])

  return {
    width,
    height,
    observe,
  }
}
