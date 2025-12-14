'use client'

import { X, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ExportModalProps {
  open: boolean
  onClose: () => void
  onExport: () => void
  analysisId: string
}

export function ExportModal({ open, onClose, onExport, analysisId }: ExportModalProps) {
  const handleExport = () => {
    onExport()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Analysis Report
          </DialogTitle>
          <DialogDescription>
            Generate a comprehensive PDF report of all detected UX issues with detailed
            explanations and recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
              <Download className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <h4 className="font-semibold">PDF Report</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Download a professional PDF report containing all issues, their locations,
                  severity levels, and actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

