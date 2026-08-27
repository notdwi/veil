import { useCallback, useRef, useState } from 'react'

type Axis = 'x' | 'y'

/** Pointer-capture drag used by the panel resizers. */
export function useDrag(axis: Axis, onDelta: (position: number, event: PointerEvent) => void) {
  const [dragging, setDragging] = useState(false)
  const frame = useRef(0)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      setDragging(true)
      document.body.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize'

      const move = (ev: PointerEvent) => {
        cancelAnimationFrame(frame.current)
        frame.current = requestAnimationFrame(() => onDelta(axis === 'x' ? ev.clientX : ev.clientY, ev))
      }
      const up = () => {
        cancelAnimationFrame(frame.current)
        setDragging(false)
        document.body.style.cursor = ''
        window.removeEventListener('pointermove', move)
        window.removeEventListener('pointerup', up)
      }
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up)
    },
    [axis, onDelta],
  )

  return { dragging, onPointerDown }
}
