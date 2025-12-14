/**
 * PDF Export Generator
 * Generates PDF reports for UX analyses
 */

import jsPDF from 'jspdf'

export interface PDFData {
  fileName: string
  fileUrl: string
  analysisDate: string
  totalIssues: number
  issues: Array<{
    issue_type: string
    severity: string
    title: string
    description: string
    x: number
    y: number
    width: number
    height: number
  }>
  metadata?: {
    image_width: number
    image_height: number
    analysis_duration_ms: number
  }
}

export async function generatePDF(data: PDFData): Promise<Blob> {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - 2 * margin
  let yPosition = margin

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('UX Analysis Report', margin, yPosition)
  yPosition += 10

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`File: ${data.fileName}`, margin, yPosition)
  yPosition += 6
  doc.text(`Analysis Date: ${new Date(data.analysisDate).toLocaleDateString()}`, margin, yPosition)
  yPosition += 6
  doc.text(`Total Issues Found: ${data.totalIssues}`, margin, yPosition)
  yPosition += 10

  // Summary section
  if (data.metadata) {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Summary', margin, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Image Dimensions: ${data.metadata.image_width} × ${data.metadata.image_height}px`, margin, yPosition)
    yPosition += 5
    doc.text(`Analysis Duration: ${(data.metadata.analysis_duration_ms / 1000).toFixed(2)}s`, margin, yPosition)
    yPosition += 10
  }

  // Issues by severity
  const errors = data.issues.filter(i => i.severity === 'error')
  const warnings = data.issues.filter(i => i.severity === 'warning')
  const info = data.issues.filter(i => i.severity === 'info')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Issues Overview', margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(220, 53, 69) // Red for errors
  doc.text(`Errors: ${errors.length}`, margin, yPosition)
  yPosition += 5
  doc.setTextColor(255, 193, 7) // Yellow for warnings
  doc.text(`Warnings: ${warnings.length}`, margin, yPosition)
  yPosition += 5
  doc.setTextColor(0, 123, 255) // Blue for info
  doc.text(`Info: ${info.length}`, margin, yPosition)
  yPosition += 10
  doc.setTextColor(0, 0, 0) // Reset to black

  // Issues by type
  const contrast = data.issues.filter(i => i.issue_type === 'contrast')
  const spacing = data.issues.filter(i => i.issue_type === 'spacing')
  const accessibility = data.issues.filter(i => i.issue_type === 'accessibility')
  const layout = data.issues.filter(i => i.issue_type === 'layout')

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  checkPageBreak(15)
  doc.text('Issues by Category', margin, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Contrast: ${contrast.length}`, margin, yPosition)
  yPosition += 5
  doc.text(`Spacing: ${spacing.length}`, margin, yPosition)
  yPosition += 5
  doc.text(`Accessibility: ${accessibility.length}`, margin, yPosition)
  yPosition += 5
  doc.text(`Layout: ${layout.length}`, margin, yPosition)
  yPosition += 10

  // Detailed Issues
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  checkPageBreak(20)
  doc.text('Detailed Issues', margin, yPosition)
  yPosition += 8

  data.issues.forEach((issue, index) => {
    checkPageBreak(25)

    // Issue header
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    
    // Color based on severity
    if (issue.severity === 'error') {
      doc.setTextColor(220, 53, 69)
    } else if (issue.severity === 'warning') {
      doc.setTextColor(255, 193, 7)
    } else {
      doc.setTextColor(0, 123, 255)
    }

    doc.text(`${index + 1}. ${issue.title}`, margin, yPosition)
    yPosition += 6

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)

    // Issue details
    const descriptionLines = doc.splitTextToSize(issue.description, contentWidth)
    descriptionLines.forEach((line: string) => {
      checkPageBreak(5)
      doc.text(line, margin, yPosition)
      yPosition += 4
    })

    yPosition += 2

    // Issue metadata
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Type: ${issue.issue_type} | Severity: ${issue.severity} | Position: (${issue.x}, ${issue.y}) | Size: ${issue.width}×${issue.height}px`,
      margin,
      yPosition
    )
    yPosition += 6
    doc.setTextColor(0, 0, 0)
  })

  // Footer on all pages
  const pageCount = (doc as any).internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${pageCount} | Generated by Flow UX AI`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Generate blob
  const pdfBlob = doc.output('blob')
  return pdfBlob
}

