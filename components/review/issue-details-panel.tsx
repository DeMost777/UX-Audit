'use client'

import { X, Lightbulb, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle, Info } from 'lucide-react'

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

interface IssueDetailsPanelProps {
  issue: Issue | null
  onClose: () => void
}

export function IssueDetailsPanel({ issue, onClose }: IssueDetailsPanelProps) {
  if (!issue) {
    return (
      <div className="border-t border-border bg-card p-6">
        <p className="text-center text-sm text-muted-foreground">
          Select an issue to view details
        </p>
      </div>
    )
  }

  const getSeverityInfo = (severity: string) => {
    switch (severity) {
      case 'error':
        return {
          label: 'Critical',
          icon: <AlertCircle className="h-5 w-5 text-destructive" />,
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive',
          textColor: 'text-destructive',
        }
      case 'warning':
        return {
          label: 'Major',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-500',
        }
      case 'info':
        return {
          label: 'Minor',
          icon: <Info className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-500',
        }
      default:
        return {
          label: 'Info',
          icon: <Info className="h-5 w-5" />,
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-foreground',
        }
    }
  }

  const severityInfo = getSeverityInfo(issue.severity)

  const getIssueTypeLabel = (type: string) => {
    switch (type) {
      case 'contrast':
        return 'Contrast'
      case 'spacing':
        return 'Spacing'
      case 'accessibility':
        return 'Accessibility'
      case 'layout':
        return 'Layout'
      default:
        return type
    }
  }

  const getWCAGReference = (type: string) => {
    switch (type) {
      case 'contrast':
        return 'WCAG 2.1 AA - 1.4.3 Contrast (Minimum)'
      case 'spacing':
        return 'WCAG 2.1 AA - 1.4.12 Text Spacing'
      case 'accessibility':
        return 'WCAG 2.1 AA - 2.5.5 Target Size'
      case 'layout':
        return 'WCAG 2.1 AA - 1.3.1 Info and Relationships'
      default:
        return 'UX Best Practice'
    }
  }

  return (
    <div className="border-t border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          {severityInfo.icon}
          <div>
            <h3 className="font-semibold">{issue.title}</h3>
            <p className="text-sm text-muted-foreground">
              {getIssueTypeLabel(issue.issue_type)} • Position: ({issue.x}, {issue.y})
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 p-6">
        {/* Severity Badge */}
        <div
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 ${severityInfo.bgColor} ${severityInfo.borderColor}`}
        >
          {severityInfo.icon}
          <span className={`text-sm font-medium ${severityInfo.textColor}`}>
            {severityInfo.label}
          </span>
        </div>

        {/* Problem */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Problem</h4>
          <p className="text-sm text-muted-foreground">{issue.description}</p>
        </div>

        {/* Cause */}
        <div>
          <h4 className="mb-2 text-sm font-semibold">Cause</h4>
          <p className="text-sm text-muted-foreground">
            {issue.issue_type === 'contrast' &&
              'Contrast ratio is approximately 1.0:1, below WCAG AA requirement of 4.5:1.'}
            {issue.issue_type === 'spacing' &&
              'Elements have insufficient spacing between them, affecting visual hierarchy and readability.'}
            {issue.issue_type === 'accessibility' &&
              'Interactive elements do not meet minimum size requirements for touch targets.'}
            {issue.issue_type === 'layout' &&
              'Elements are misaligned or inconsistent, affecting visual consistency.'}
          </p>
        </div>

        {/* Recommendation */}
        <div>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-accent" />
            Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">
            {issue.issue_type === 'contrast' &&
              'Increase contrast between text and background colors to at least 4.5:1 for normal text.'}
            {issue.issue_type === 'spacing' &&
              'Increase spacing between elements to at least 8px for mobile and 16px for desktop.'}
            {issue.issue_type === 'accessibility' &&
              'Ensure interactive elements have a minimum touch target of 44x44px (iOS) or 48x48px (Material).'}
            {issue.issue_type === 'layout' &&
              'Align elements to a consistent grid system and maintain visual rhythm throughout the design.'}
          </p>
        </div>

        {/* Reference */}
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Reference</p>
              <p className="mt-1 text-sm">{getWCAGReference(issue.issue_type)}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

