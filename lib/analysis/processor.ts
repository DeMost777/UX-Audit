/**
 * Image Processing and Analysis Orchestrator
 */

import sharp from 'sharp'
import { analyzeImage, type AnalysisIssue } from './rules'
import type { ImageMetadata } from './rules'
import { analyzeWithGemini } from '@/lib/ai/gemini'

/**
 * Fetch image and extract metadata
 */
export async function getImageMetadata(imageUrl: string): Promise<ImageMetadata> {
  try {
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const metadata = await sharp(buffer).metadata()

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
    }
  } catch (error) {
    console.error('Error fetching image metadata:', error)
    // Return default metadata if fetch fails
    return {
      width: 1920,
      height: 1080,
      format: 'unknown',
    }
  }
}

/**
 * Process analysis for an uploaded image
 */
export async function processAnalysis(
  analysisId: string,
  imageUrl: string
): Promise<{
  issues: AnalysisIssue[]
  metadata: ImageMetadata
  duration: number
}> {
  const startTime = Date.now()

  // Get image metadata
  const metadata = await getImageMetadata(imageUrl)

  // Run deterministic analysis
  const issues = await analyzeImage(imageUrl, metadata)

  // Run Gemini (best-effort). Never fail the whole analysis if Gemini fails.
  let geminiIssues: AnalysisIssue[] = []
  try {
    geminiIssues = await analyzeWithGemini(imageUrl, metadata)
  } catch (err) {
    console.error('Gemini analysis failed (continuing with rule-based results):', err)
  }

  const duration = Date.now() - startTime

  return {
    issues: [...issues, ...geminiIssues],
    metadata,
    duration,
  }
}

