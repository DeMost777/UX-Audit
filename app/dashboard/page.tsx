'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  Loader2,
  FileImage,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Analysis {
  id: string
  file_name: string
  file_url: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  analysis_metadata?: {
    total_issues: number
    image_width: number
    image_height: number
  }
}

interface DashboardStats {
  total: number
  completed: number
  processing: number
  failed: number
  totalIssues: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
    totalIssues: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (sessionStatus === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchAnalyses()
  }, [session, sessionStatus, statusFilter, router])

  const fetchAnalyses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter) {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/analyses?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analyses')
      }

      const data = await response.json()
      setAnalyses(data.analyses || [])

      // Calculate stats
      const completed = data.analyses.filter((a: Analysis) => a.status === 'completed')
      const processing = data.analyses.filter((a: Analysis) => a.status === 'processing' || a.status === 'pending')
      const failed = data.analyses.filter((a: Analysis) => a.status === 'failed')
      const totalIssues = completed.reduce((sum: number, a: Analysis) => 
        sum + (a.analysis_metadata?.total_issues || 0), 0
      )

      setStats({
        total: data.total || 0,
        completed: completed.length,
        processing: processing.length,
        failed: failed.length,
        totalIssues,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'processing':
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      case 'processing':
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20'
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (sessionStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your design analyses
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <FileImage className="h-8 w-8 text-primary" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                  {stats.processing}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Issues Found</p>
                <p className="text-2xl font-bold mt-1">{stats.totalIssues}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2">
              <Button
                variant={statusFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(null)}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'processing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('processing')}
              >
                Processing
              </Button>
            </div>
          </div>
        </div>

        {/* Analyses List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchAnalyses} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : filteredAnalyses.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg font-semibold">No analyses found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || statusFilter
                ? 'Try adjusting your filters'
                : 'Upload your first design to get started'}
            </p>
            {!searchQuery && !statusFilter && (
              <Link href="/" className="mt-4 inline-block">
                <Button>Upload Design</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnalyses.map((analysis) => (
              <Link
                key={analysis.id}
                href={analysis.status === 'completed' ? `/review/${analysis.id}` : `/analysis/${analysis.id}`}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-primary/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getStatusIcon(analysis.status)}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{analysis.file_name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>

                {analysis.file_url && (
                  <div className="mb-4 rounded-lg overflow-hidden bg-muted aspect-video">
                    <img
                      src={analysis.file_url}
                      alt={analysis.file_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium ${getStatusColor(
                      analysis.status
                    )}`}
                  >
                    {getStatusIcon(analysis.status)}
                    <span className="capitalize">{analysis.status}</span>
                  </span>

                  {analysis.analysis_metadata && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>{analysis.analysis_metadata.total_issues} issues</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

