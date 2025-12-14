'use client'

import { useState } from 'react'
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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
}

interface Screen {
  id: string
  name: string
  url: string
  issues: Issue[]
}

interface IssuesSidebarProps {
  screens: Screen[]
  selectedIssueId: string | null
  onIssueSelect: (issueId: string) => void
  onScreenSelect: (screenId: string) => void
}

export function IssuesSidebar({
  screens,
  selectedIssueId,
  onIssueSelect,
  onScreenSelect,
}: IssuesSidebarProps) {
  const [expandedScreens, setExpandedScreens] = useState<Set<string>>(new Set())

  const totalIssues = screens.reduce((sum, screen) => sum + screen.issues.length, 0)
  const criticalCount = screens.reduce(
    (sum, screen) => sum + screen.issues.filter((i) => i.severity === 'error').length,
    0
  )
  const warningCount = screens.reduce(
    (sum, screen) => sum + screen.issues.filter((i) => i.severity === 'warning').length,
    0
  )
  const infoCount = screens.reduce(
    (sum, screen) => sum + screen.issues.filter((i) => i.severity === 'info').length,
    0
  )

  const toggleScreen = (screenId: string) => {
    const newExpanded = new Set(expandedScreens)
    if (newExpanded.has(screenId)) {
      newExpanded.delete(screenId)
    } else {
      newExpanded.add(screenId)
    }
    setExpandedScreens(newExpanded)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'text-destructive border-destructive/20 hover:bg-destructive/10'
      case 'warning':
        return 'text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10'
      case 'info':
        return 'text-blue-500 border-blue-500/20 hover:bg-blue-500/10'
      default:
        return ''
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold">Issues Found</h2>
        <p className="mt-1 text-sm text-muted-foreground">{totalIssues} total</p>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20">
              <AlertCircle className="h-3 w-3 text-destructive" />
            </div>
            <span className="text-muted-foreground">Critical</span>
            <span className="ml-auto font-medium">{criticalCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500/20">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
            </div>
            <span className="text-muted-foreground">Major</span>
            <span className="ml-auto font-medium">{warningCount}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
              <Info className="h-3 w-3 text-blue-500" />
            </div>
            <span className="text-muted-foreground">Minor</span>
            <span className="ml-auto font-medium">{infoCount}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {screens.map((screen) => {
            const isExpanded = expandedScreens.has(screen.id)
            const hasIssues = screen.issues.length > 0

            return (
              <div key={screen.id} className="mb-1">
                <button
                  onClick={() => {
                    toggleScreen(screen.id)
                    onScreenSelect(screen.id)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="flex-1 truncate font-medium">{screen.name}</span>
                  {hasIssues && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {screen.issues.length}
                    </span>
                  )}
                </button>

                {isExpanded && hasIssues && (
                  <div className="ml-6 mt-1 space-y-1">
                    {screen.issues.map((issue) => (
                      <button
                        key={issue.id}
                        onClick={() => onIssueSelect(issue.id)}
                        className={cn(
                          'flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                          selectedIssueId === issue.id
                            ? 'border-accent bg-accent/10'
                            : getSeverityColor(issue.severity)
                        )}
                      >
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{issue.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            ({issue.x}, {issue.y})
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

