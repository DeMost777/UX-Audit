'use client'

import { useState } from 'react'
import { AlertCircle, Info, AlertTriangle } from 'lucide-react'

interface AnalysisResult {
  id: string
  issue_type: 'contrast' | 'spacing' | 'accessibility' | 'layout'
  severity: 'error' | 'warning' | 'info'
  title: string
  description: string
  x: number
  y: number
  width: number
  height: number
}

interface AnalysisCanvasProps {
  imageUrl: string
  imageWidth: number
  imageHeight: number
  results: AnalysisResult[]
  onIssueClick?: (result: AnalysisResult) => void
}

export function AnalysisCanvas({
  imageUrl,
  imageWidth,
  imageHeight,
  results,
  onIssueClick,
}: AnalysisCanvasProps) {
  const [selectedIssue, setSelectedIssue] = useState<AnalysisResult | null>(null)
  const [imageError, setImageError] = useState(false)

  const handleIssueClick = (result: AnalysisResult) => {
    setSelectedIssue(result)
    onIssueClick?.(result)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-500 bg-red-500/20'
      case 'warning':
        return 'border-yellow-500 bg-yellow-500/20'
      case 'info':
        return 'border-blue-500 bg-blue-500/20'
      default:
        return 'border-gray-500 bg-gray-500/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  // Calculate scale to fit container
  const containerWidth = 800 // Default container width
  const containerHeight = 600 // Default container height
  const scaleX = containerWidth / imageWidth
  const scaleY = containerHeight / imageHeight
  const displayScale = Math.min(scaleX, scaleY, 1) // Don't scale up

  return (
    <div className="space-y-4" data-analysis-canvas>
      <div className="relative rounded-lg border border-border bg-card overflow-hidden">
        <div
          className="relative"
          style={{
            width: `${imageWidth * displayScale}px`,
            height: `${imageHeight * displayScale}px`,
            maxWidth: '100%',
            margin: '0 auto',
          }}
        >
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center bg-muted text-center">
              <div className="p-4">
                <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
                <p className="mt-2 text-sm font-medium">Failed to load image</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  The image URL may be invalid or the storage bucket may be private.
                </p>
                <button
                  onClick={() => {
                    setImageError(false)
                    // Force reload by adding timestamp
                    const img = document.querySelector('img[src*="' + imageUrl + '"]') as HTMLImageElement
                    if (img) {
                      img.src = imageUrl + '?t=' + Date.now()
                    }
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="Design analysis"
              className="w-full h-full object-contain"
              style={{
                width: `${imageWidth * displayScale}px`,
                height: `${imageHeight * displayScale}px`,
              }}
              onError={() => {
                console.error('Image failed to load:', imageUrl)
                setImageError(true)
              }}
            />
          )}
          
          {/* Overlay issue highlights */}
          {results.map((result) => {
            const scaledX = result.x * displayScale
            const scaledY = result.y * displayScale
            const scaledWidth = result.width * displayScale
            const scaledHeight = result.height * displayScale

            return (
              <div
                key={result.id}
                className={`absolute border-2 cursor-pointer transition-all hover:opacity-80 ${getSeverityColor(result.severity)}`}
                style={{
                  left: `${scaledX}px`,
                  top: `${scaledY}px`,
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                }}
                onClick={() => handleIssueClick(result)}
                title={result.title}
              >
                <div className="absolute -top-6 left-0 flex items-center gap-1 bg-background/90 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                  {getSeverityIcon(result.severity)}
                  <span>{result.title}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected issue details */}
      {selectedIssue && (
        <div className={`rounded-lg border p-4 ${getSeverityColor(selectedIssue.severity)}`}>
          <div className="flex items-start gap-3">
            {getSeverityIcon(selectedIssue.severity)}
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{selectedIssue.title}</h3>
              <p className="text-sm text-muted-foreground">{selectedIssue.description}</p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs rounded bg-background/50 px-2 py-1">
                  {selectedIssue.issue_type}
                </span>
                <span className="text-xs rounded bg-background/50 px-2 py-1 capitalize">
                  {selectedIssue.severity}
                </span>
                <span className="text-xs rounded bg-background/50 px-2 py-1">
                  {selectedIssue.x}, {selectedIssue.y}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedIssue(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

