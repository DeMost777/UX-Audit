'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReviewTopbar } from '@/components/review/review-topbar'
import { IssuesSidebar } from '@/components/review/issues-sidebar'
import { ReviewCanvas } from '@/components/review/review-canvas'
import { IssueDetailsPanel } from '@/components/review/issue-details-panel'
import { ExportModal } from '@/components/review/export-modal'

interface Analysis {
  id: string
  file_name: string
  file_url: string
  status: string
  created_at: string
}

interface Issue {
  id: string
  issue_type: 'contrast' | 'spacing' | 'accessibility' | 'layout'
  severity: 'error' | 'warning' | 'info'
  title: string
  description: string
  x: number
  y: number
  width: number
  height: number
  rule_id: string
}

interface AnalysisMetadata {
  image_width: number
  image_height: number
  total_issues: number
  analysis_duration_ms: number
}

interface Screen {
  id: string
  name: string
  url: string
  width: number
  height: number
  issues: Issue[]
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [screens, setScreens] = useState<Screen[]>([])
  const [metadata, setMetadata] = useState<AnalysisMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchAnalysis()
  }, [params.id])

  const fetchAnalysis = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analysis/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      setMetadata(data.metadata)

      // Transform analysis into screens format
      if (data.analysis && data.results) {
        const screen: Screen = {
          id: data.analysis.id,
          name: data.analysis.file_name,
          url: data.analysis.file_url,
          width: data.metadata?.image_width || 1920,
          height: data.metadata?.image_height || 1080,
          issues: data.results || [],
        }
        setScreens([screen])
        setSelectedScreenId(screen.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleIssueSelect = (issueId: string) => {
    setSelectedIssueId(issueId)
    // Scroll to issue on canvas if needed
  }

  const handleScreenSelect = (screenId: string) => {
    setSelectedScreenId(screenId)
    setSelectedIssueId(null) // Clear selected issue when switching screens
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      const response = await fetch(`/api/export/pdf/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to export PDF')
      }

      const blob = await response.blob()
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

  const selectedIssue = screens
    .flatMap((s) => s.issues)
    .find((i) => i.id === selectedIssueId) || null

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Analysis not found</h1>
          <p className="mt-2 text-muted-foreground">{error || 'The analysis you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (analysis.status !== 'completed') {
    return (
      <div className="flex h-screen items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Analysis in Progress</h1>
          <p className="mt-2 text-muted-foreground">
            The analysis is still being processed. Please wait...
          </p>
          <Button onClick={() => router.push(`/analysis/${params.id}`)} className="mt-4" variant="outline">
            View Analysis Page
          </Button>
        </div>
      </div>
    )
  }

  if (screens.length === 0 || screens[0].issues.length === 0) {
    return (
      <div className="flex h-screen flex-col">
        <ReviewTopbar onExportClick={() => setExportModalOpen(true)} />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">No Issues Found</h1>
            <p className="mt-2 text-muted-foreground">
              Great job! This design passed all UX checks.
            </p>
            <Button onClick={() => router.push('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <ReviewTopbar onExportClick={() => setExportModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0">
          <IssuesSidebar
            screens={screens}
            selectedIssueId={selectedIssueId}
            onIssueSelect={handleIssueSelect}
            onScreenSelect={handleScreenSelect}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ReviewCanvas
            screens={screens}
            selectedIssueId={selectedIssueId}
            selectedScreenId={selectedScreenId}
            onIssueSelect={handleIssueSelect}
            onScreenSelect={handleScreenSelect}
          />

          {/* Issue Details Panel */}
          <div className="flex-shrink-0">
            <IssueDetailsPanel
              issue={selectedIssue}
              onClose={() => setSelectedIssueId(null)}
            />
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        analysisId={params.id as string}
      />
    </div>
  )
}

