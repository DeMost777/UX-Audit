'use client'

import { useRef, useState, useEffect } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Issue {
  id: string
  issue_type: 'contrast' | 'spacing' | 'accessibility' | 'layout'
  severity: 'error' | 'warning' | 'info'
  title: string
  x: number
  y: number
  width: number
  height: number
}

interface Screen {
  id: string
  name: string
  url: string
  width: number
  height: number
  issues: Issue[]
}

interface ReviewCanvasProps {
  screens: Screen[]
  selectedIssueId: string | null
  selectedScreenId: string | null
  onIssueSelect: (issueId: string) => void
  onScreenSelect: (screenId: string) => void
}

export function ReviewCanvas({
  screens,
  selectedIssueId,
  selectedScreenId,
  onIssueSelect,
  onScreenSelect,
}: ReviewCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [panStart, setPanStart] = useState<{ x: number; y: number } | null>(null)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const zoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const zoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const resetZoom = () => {
    setZoom(100)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && panStart) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setPanStart(null)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-destructive bg-destructive/20'
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/20'
      case 'info':
        return 'border-blue-500 bg-blue-500/20'
      default:
        return 'border-muted bg-muted/20'
    }
  }

  const getSeverityMarker = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-destructive'
      case 'warning':
        return 'bg-yellow-500'
      case 'info':
        return 'bg-blue-500'
      default:
        return 'bg-muted'
    }
  }

  // Auto-select first screen if none selected
  useEffect(() => {
    if (!selectedScreenId && screens.length > 0) {
      onScreenSelect(screens[0].id)
    }
  }, [selectedScreenId, screens, onScreenSelect])

  const selectedScreen = screens.find((s) => s.id === selectedScreenId) || screens[0]

  if (!selectedScreen) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No screens available</p>
      </div>
    )
  }

  const scale = zoom / 100
  const scaledWidth = selectedScreen.width * scale
  const scaledHeight = selectedScreen.height * scale

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      {/* Canvas Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <h3 className="font-semibold">{selectedScreen.name}</h3>
          <p className="text-sm text-muted-foreground">
            {selectedScreen.issues.length} issue{selectedScreen.issues.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={zoomOut}
              disabled={zoom <= 50}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="min-w-[3rem] text-center text-sm font-medium">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={zoomIn}
              disabled={zoom >= 200}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={resetZoom}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-auto bg-muted/20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="relative mx-auto my-8"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Screen Image */}
          <img
            src={selectedScreen.url}
            alt={selectedScreen.name}
            className="h-full w-full object-contain"
            draggable={false}
          />

          {/* Issue Markers Overlay */}
          {selectedScreen.issues.map((issue) => {
            const scaledX = issue.x * scale
            const scaledY = issue.y * scale
            const scaledWidth = issue.width * scale
            const scaledHeight = issue.height * scale
            const isSelected = selectedIssueId === issue.id

            return (
              <div
                key={issue.id}
                onClick={() => onIssueSelect(issue.id)}
                className={cn(
                  'absolute cursor-pointer border-2 transition-all',
                  getSeverityColor(issue.severity),
                  isSelected && 'ring-2 ring-accent ring-offset-2'
                )}
                style={{
                  left: `${scaledX}px`,
                  top: `${scaledY}px`,
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                }}
              >
                {/* Marker Dot */}
                <div
                  className={cn(
                    'absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 border-background',
                    getSeverityMarker(issue.severity)
                  )}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Screen Navigation (if multiple screens) */}
      {screens.length > 1 && (
        <div className="flex items-center gap-2 border-t border-border bg-card px-6 py-3">
          <span className="text-sm text-muted-foreground">Screens:</span>
          <div className="flex gap-2">
            {screens.map((screen) => (
              <button
                key={screen.id}
                onClick={() => onScreenSelect(screen.id)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                  selectedScreenId === screen.id
                    ? 'border-accent bg-accent/10 text-accent-foreground'
                    : 'border-border bg-background hover:bg-muted'
                )}
              >
                {screen.name}
                {screen.issues.length > 0 && (
                  <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                    {screen.issues.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

