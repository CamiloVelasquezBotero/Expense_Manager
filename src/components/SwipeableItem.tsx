/* Component Created By Camilo Velasquez botero  */
/* 
    Swipe an item  
1- enclose the div in this component and passing it as children    
2- Give the properties "onLeadingSwipeFunction" to the Left side for the function and "onTrailingSwipeFunction" for the Rigth side
3- Give the content to show to the user in "leadingActionContent" to left and "trailingActionContent" to right
*/

import { useState, useRef, useCallback } from "react"

type SwipeableItemProps = {
    children: React.ReactNode;
    maxSwipe?: number;
    actionThreshold?: number;
    onLeadingSwipeFunction?: () => void;
    onTrailingSwipeFunction?: () => void;
    leadingActionContent?: React.ReactNode;
    trailingActionContent?: React.ReactNode;
}

export default function SwipeableItem({
    children,
    maxSwipe = 150,
    actionThreshold = 120,
    onLeadingSwipeFunction,
    onTrailingSwipeFunction,
    leadingActionContent,
    trailingActionContent
}: SwipeableItemProps) {
    /* ── Swipe state ── */
    const [offsetX, setOffsetX] = useState(0)
    const swiping = useRef(false)
    const startX = useRef(0)
    const startY = useRef(0)
    const currentX = useRef(0)
    const dirLocked = useRef<'h' | 'v' | null>(null)

    /* ── Handlers ── */
    const onStart = useCallback((clientX: number, clientY: number) => {
        startX.current = clientX
        startY.current = clientY
        currentX.current = 0
        dirLocked.current = null
        swiping.current = true
    }, [])

    const onMove = useCallback((clientX: number, clientY: number) => {
        if (!swiping.current) return

        const dx = clientX - startX.current
        const dy = clientY - startY.current

        /* Lock direction after 8 px of movement */
        if (dirLocked.current === null) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                dirLocked.current = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v'
            }
            return
        }

        if (dirLocked.current === 'v') return          /* Vertical scroll — ignore */

        const clamped = Math.max(-maxSwipe, Math.min(maxSwipe, dx))
        currentX.current = clamped
        setOffsetX(clamped)
    }, [maxSwipe])

    const onEnd = useCallback(() => {
        if (!swiping.current) return
        swiping.current = false

        /* Function to the Left movement */
        if (currentX.current > actionThreshold) {
            if (onLeadingSwipeFunction) onLeadingSwipeFunction()      /* Leading action */
        }
        /* Function for the Right movement */
        if (currentX.current < -actionThreshold) {
            if (onTrailingSwipeFunction) onTrailingSwipeFunction()      /* Trailing action — Delete */
        }

        currentX.current = 0
        dirLocked.current = null
        setOffsetX(0)
    }, [actionThreshold, onLeadingSwipeFunction, onTrailingSwipeFunction])

    /* Touch events */
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        onStart(e.touches[0].clientX, e.touches[0].clientY)
    }, [onStart])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        onMove(e.touches[0].clientX, e.touches[0].clientY)
    }, [onMove])

    const handleTouchEnd = useCallback(() => onEnd(), [onEnd])

    /* Mouse events (desktop support) */
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        onStart(e.clientX, e.clientY)
    }, [onStart])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        onMove(e.clientX, e.clientY)
    }, [onMove])

    const handleMouseUp = useCallback(() => onEnd(), [onEnd])
    const handleMouseLeave = useCallback(() => { if (swiping.current) onEnd() }, [onEnd])

    return (
        /* Cover the div that we want to animate */
        <div style={{ position: 'relative', overflow: 'hidden', touchAction: 'pan-y' }}>

            {/* Leading action — revealed when swiping right */}
            {leadingActionContent && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '1.25rem',
                        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        letterSpacing: '0.05em',
                        opacity: offsetX > 0 ? 1 : 0,
                        transition: swiping.current ? 'none' : 'opacity 0.25s',
                        pointerEvents: 'none',
                    }}
                >
                    {leadingActionContent}
                </div>
            )}

            {/* Trailing action — revealed when swiping left */}
            {trailingActionContent && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: '1.25rem',
                        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                        letterSpacing: '0.05em',
                        opacity: offsetX < 0 ? 1 : 0,
                        transition: swiping.current ? 'none' : 'opacity 0.25s',
                        pointerEvents: 'none',
                    }}
                >
                    {trailingActionContent}
                </div>
            )}

            {/* Content wrapper */}
            <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                style={{
                    transform: `translateX(${offsetX}px)`,
                    transition: swiping.current ? 'none' : 'transform 0.3s cubic-bezier(.25,.8,.25,1)',
                    cursor: 'grab',
                    userSelect: 'none',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {children}
            </div>
        </div>
    )
}
