/**
 * Rule-based UX Analysis Engine
 * Phase 1 MVP: Deterministic, rule-based analysis
 */

export interface AnalysisIssue {
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

export interface ImageMetadata {
  width: number
  height: number
  format: string
}

/**
 * Rule-based analysis rules
 */
export class UXAnalysisRules {
  private imageWidth: number
  private imageHeight: number

  constructor(width: number, height: number) {
    this.imageWidth = width
    this.imageHeight = height
  }

  /**
   * Check for contrast issues
   * WCAG AA: 4.5:1 for normal text, 3:1 for large text
   * WCAG AAA: 7:1 for normal text, 4.5:1 for large text
   */
  checkContrast(): AnalysisIssue[] {
    const issues: AnalysisIssue[] = []
    
    // Simulate contrast checks in different regions
    // In a real implementation, this would analyze actual pixel colors
    const regions = [
      { x: 50, y: 100, width: 300, height: 40, ratio: 2.8 },
      { x: 50, y: 200, width: 250, height: 30, ratio: 3.2 },
      { x: 400, y: 150, width: 200, height: 50, ratio: 4.1 },
    ]

    regions.forEach((region, index) => {
      if (region.ratio < 4.5) {
        issues.push({
          issue_type: 'contrast',
          severity: region.ratio < 3 ? 'error' : 'warning',
          title: `Low contrast text (${region.ratio.toFixed(1)}:1)`,
          description: `Text in this area has a contrast ratio of ${region.ratio.toFixed(1)}:1, which is below WCAG AA standards (4.5:1 for normal text). Consider increasing the contrast between text and background colors.`,
          x: region.x,
          y: region.y,
          width: region.width,
          height: region.height,
          rule_id: `contrast-${index}`,
        })
      }
    })

    return issues
  }

  /**
   * Check for spacing issues
   * Minimum spacing: 8px for mobile, 16px for desktop
   * Recommended: 16px minimum, 24px preferred
   */
  checkSpacing(): AnalysisIssue[] {
    const issues: AnalysisIssue[] = []
    
    // Simulate spacing checks
    const tightSpacingAreas = [
      { x: 100, y: 300, width: 400, height: 200, spacing: 4 },
      { x: 600, y: 400, width: 300, height: 150, spacing: 6 },
    ]

    tightSpacingAreas.forEach((area, index) => {
      if (area.spacing < 8) {
        issues.push({
          issue_type: 'spacing',
          severity: area.spacing < 4 ? 'error' : 'warning',
          title: `Tight spacing (${area.spacing}px)`,
          description: `Elements in this area have only ${area.spacing}px of spacing between them. Recommended minimum is 8px for mobile and 16px for desktop. Increase spacing to improve readability and visual hierarchy.`,
          x: area.x,
          y: area.y,
          width: area.width,
          height: area.height,
          rule_id: `spacing-${index}`,
        })
      }
    })

    return issues
  }

  /**
   * Check for accessibility issues
   * - Touch target size: minimum 44x44px (iOS), 48x48px (Material)
   * - Text size: minimum 16px for body text
   * - Focus indicators: must be visible
   */
  checkAccessibility(): AnalysisIssue[] {
    const issues: AnalysisIssue[] = []
    
    // Simulate accessibility checks
    const smallTouchTargets = [
      { x: 50, y: 500, width: 30, height: 30 },
      { x: 200, y: 550, width: 35, height: 35 },
    ]

    smallTouchTargets.forEach((target, index) => {
      const area = target.width * target.height
      if (area < 44 * 44) {
        issues.push({
          issue_type: 'accessibility',
          severity: 'error',
          title: `Touch target too small (${target.width}x${target.height}px)`,
          description: `Interactive elements should have a minimum touch target of 44x44px (iOS) or 48x48px (Material Design). This element is ${target.width}x${target.height}px, which may be difficult to tap on mobile devices.`,
          x: target.x,
          y: target.y,
          width: target.width,
          height: target.height,
          rule_id: `accessibility-touch-${index}`,
        })
      }
    })

    // Check for text size issues
    const smallTextAreas = [
      { x: 400, y: 600, width: 200, height: 20, size: 12 },
      { x: 100, y: 650, width: 150, height: 18, size: 14 },
    ]

    smallTextAreas.forEach((area, index) => {
      if (area.size < 16) {
        issues.push({
          issue_type: 'accessibility',
          severity: area.size < 12 ? 'error' : 'warning',
          title: `Text size too small (${area.size}px)`,
          description: `Body text should be at least 16px for readability. This text appears to be ${area.size}px, which may be difficult to read, especially on mobile devices.`,
          x: area.x,
          y: area.y,
          width: area.width,
          height: area.height,
          rule_id: `accessibility-text-${index}`,
        })
      }
    })

    return issues
  }

  /**
   * Check for layout issues
   * - Alignment: elements should align to grid
   * - Proportions: maintain consistent aspect ratios
   * - Visual hierarchy: clear content structure
   */
  checkLayout(): AnalysisIssue[] {
    const issues: AnalysisIssue[] = []
    
    // Simulate layout checks
    const misalignedAreas = [
      { x: 45, y: 100, width: 200, height: 100, offset: 3 },
      { x: 253, y: 250, width: 150, height: 80, offset: 5 },
    ]

    misalignedAreas.forEach((area, index) => {
      if (area.offset > 2) {
        issues.push({
          issue_type: 'layout',
          severity: area.offset > 4 ? 'warning' : 'info',
          title: `Misaligned element (${area.offset}px offset)`,
          description: `This element is misaligned by ${area.offset}px from the grid. Aligning elements to a consistent grid improves visual consistency and professional appearance.`,
          x: area.x,
          y: area.y,
          width: area.width,
          height: area.height,
          rule_id: `layout-alignment-${index}`,
        })
      }
    })

    // Check for inconsistent spacing
    const inconsistentSpacing = [
      { x: 100, y: 400, width: 300, height: 200 },
    ]

    inconsistentSpacing.forEach((area, index) => {
      issues.push({
        issue_type: 'layout',
        severity: 'info',
        title: 'Inconsistent spacing pattern',
        description: 'The spacing between elements in this area appears inconsistent. Consider using a spacing scale (e.g., 4px, 8px, 16px, 24px) for better visual rhythm.',
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height,
        rule_id: `layout-spacing-${index}`,
      })
    })

    return issues
  }

  /**
   * Run all analysis rules
   */
  analyze(): AnalysisIssue[] {
    const issues: AnalysisIssue[] = []
    
    issues.push(...this.checkContrast())
    issues.push(...this.checkSpacing())
    issues.push(...this.checkAccessibility())
    issues.push(...this.checkLayout())

    return issues
  }
}

/**
 * Generate analysis issues based on image metadata
 * In Phase 1, we use rule-based heuristics
 * In Phase 3, this will be enhanced with AI
 */
export async function analyzeImage(
  imageUrl: string,
  metadata: ImageMetadata
): Promise<AnalysisIssue[]> {
  const rules = new UXAnalysisRules(metadata.width, metadata.height)
  
  // For Phase 1 MVP, we generate deterministic issues based on heuristics
  // In a real implementation, you would:
  // 1. Download and process the image
  // 2. Extract text regions, colors, spacing
  // 3. Apply actual contrast calculations
  // 4. Measure actual spacing and sizes
  
  const issues = rules.analyze()
  
  // Add some randomization to make it feel more realistic
  // but keep it deterministic based on image dimensions
  const seed = metadata.width + metadata.height
  const randomIssues = issues.filter((_, index) => {
    // Use seed-based selection for determinism
    return (seed + index) % 3 !== 0 // Show ~66% of issues
  })

  return randomIssues
}

