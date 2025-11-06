import { useEffect, useRef, useState } from 'react'

export default function DevFps() {
  if (import.meta.env.PROD) return null as any
  const rafRef = useRef(0)
  const lastRef = useRef(performance.now())
  const framesRef = useRef(0)
  const [fps, setFps] = useState(0)
  useEffect(() => {
    const loop = (t: number) => {
      framesRef.current += 1
      const dt = t - lastRef.current
      if (dt >= 1000) {
        setFps(Math.round((framesRef.current * 1000) / dt))
        framesRef.current = 0
        lastRef.current = t
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])
  return (
    <div style={{ position: 'fixed', left: 8, bottom: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 12, zIndex: 9999 }}>
      {fps} fps
    </div>
  )
}


