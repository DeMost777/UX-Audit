'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Image as ImageIcon, RefreshCw, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AnalysisCanvas } from '@/components/analysis-canvas'

interface Analysis {
  id: string
  file_name: string
  file_url: string
  status: string
  created_at: string
}

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

interface AnalysisMetadata {
  image_width: number
  image_height: number
  total_issues: number
  analysis_duration_ms: number
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [metadata, setMetadata] = useState<AnalysisMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [polling, setPolling] = useState(false)
  const [exporting, setExporting] = useState(false)

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`/api/analysis/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setResults(data.results || [])
      setMetadata(data.metadata)

      // If analysis is still processing, poll for updates
      if (data.analysis.status === 'processing' || data.analysis.status === 'pending') {
        setPolling(true)
      } else {
        setPolling(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setPolling(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchAnalysis()
    }
  }, [params.id])

  // Poll for analysis completion
  useEffect(() => {
    if (!polling) return

    const interval = setInterval(() => {
      fetchAnalysis()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [polling, params.id])

  const triggerAnalysis = async () => {
    try {
      setPolling(true)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisId: params.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to trigger analysis')
      }

      // Start polling for results
      setTimeout(() => {
        fetchAnalysis()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger analysis')
      setPolling(false)
    }
  }

  const exportPDF = async () => {
    try {
      setExporting(true)
      const response = await fetch(`/api/export/pdf/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to export PDF')
      }

      // Get the PDF blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ux-analysis-${analysis?.file_name.replace(/\.[^/.]+$/, '') || 'report'}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Analysis not found</h1>
          <p className="mt-2 text-muted-foreground">{error || 'The analysis you\'re looking for doesn\'t exist.'}</p>
          <Link href="/" className="mt-4 inline-block">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="mb-6 inline-block">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analysis: {analysis.file_name}</h1>
            <p className="mt-2 text-muted-foreground">
              Status: <span className="capitalize">{analysis.status}</span>
              {metadata && (
                <> • {metadata.total_issues} issues found</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {analysis.status === 'completed' && results.length > 0 && (
              <>
                <Link href={`/review/${params.id}`}>
                  <Button variant="default" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Review Design
                  </Button>
                </Link>
                <Button onClick={exportPDF} disabled={exporting} variant="outline">
                  {exporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </>
                  )}
                </Button>
              </>
            )}
            {(analysis.status === 'pending' || analysis.status === 'failed') && (
              <Button onClick={triggerAnalysis} disabled={polling}>
                {polling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {analysis.status === 'processing' || (analysis.status === 'pending' && polling) ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg font-semibold">Analyzing design...</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Visual Canvas with Issue Highlights */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Design Analysis</h2>
              {analysis.file_url && metadata ? (
                <AnalysisCanvas
                  imageUrl={analysis.file_url}
                  imageWidth={metadata.image_width}
                  imageHeight={metadata.image_height}
                  results={results}
                />
              ) : (
                <div className="relative rounded-lg border border-border bg-card p-4">
                  {analysis.file_url ? (
                    <img
                      src={analysis.file_url}
                      alt={analysis.file_name}
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Analysis Results List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Issues Found</h2>
              
              {results.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground">
                    {analysis.status === 'completed'
                      ? 'No issues found in this design. Great job!'
                      : 'Analysis results will appear here once processing is complete.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className={`rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                        result.severity === 'error'
                          ? 'border-destructive bg-destructive/10'
                          : result.severity === 'warning'
                          ? 'border-yellow-500 bg-yellow-500/10'
                          : 'border-blue-500 bg-blue-500/10'
                      }`}
                      onClick={() => {
                        // Scroll to canvas and highlight issue
                        const canvas = document.querySelector('[data-analysis-canvas]')
                        if (canvas) {
                          canvas.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{result.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {result.description}
                          </p>
                          <div className="mt-2 flex gap-2 text-xs">
                            <span className="rounded bg-muted px-2 py-1 capitalize">
                              {result.issue_type}
                            </span>
                            <span className="rounded bg-muted px-2 py-1 capitalize">
                              {result.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

