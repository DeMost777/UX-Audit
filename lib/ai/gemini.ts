import sharp from 'sharp'
import { z } from 'zod'
import type { AnalysisIssue, ImageMetadata } from '@/lib/analysis/rules'

type GeminiIssueType = AnalysisIssue['issue_type']
type GeminiSeverity = AnalysisIssue['severity']

const GeminiResponseSchema = z.object({
  issues: z
    .array(
      z.object({
        issue_type: z.enum(['contrast', 'spacing', 'accessibility', 'layout']),
        severity: z.enum(['error', 'warning', 'info']),
        title: z.string().min(1),
        description: z.string().min(1),
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        rule_id: z.string().optional(),
      })
    )
    .default([]),
})

function envInt(name: string, fallback: number) {
  const raw = process.env[name]
  if (!raw) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function clampInt(n: number, min: number, max: number) {
  const v = Math.round(n)
  if (v < min) return min
  if (v > max) return max
  return v
}

function extractJsonFromText(text: string) {
  // Prefer fenced code blocks
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  if (fenceMatch?.[1]) return fenceMatch[1].trim()

  // Fallback: best-effort object extraction
  const first = text.indexOf('{')
  const last = text.lastIndexOf('}')
  if (first >= 0 && last > first) return text.slice(first, last + 1).trim()

  return text.trim()
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(t)
  }
}

function guessMimeType(url: string, headerContentType?: string | null) {
  const ct = headerContentType?.split(';')[0]?.trim()
  if (ct) return ct
  const lower = url.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  return 'image/jpeg'
}

async function preprocessImageForGemini(
  input: Buffer,
  maxDim: number
): Promise<{ buffer: Buffer; mimeType: string }> {
  const img = sharp(input, { failOnError: false })
  const meta = await img.metadata()
  const w = meta.width ?? 0
  const h = meta.height ?? 0

  // Resize only if needed. Convert to JPEG for smaller payload.
  const resized =
    w > 0 && h > 0 && (w > maxDim || h > maxDim)
      ? img.resize({ width: maxDim, height: maxDim, fit: 'inside', withoutEnlargement: true })
      : img

  const buffer = await resized.jpeg({ quality: 82 }).toBuffer()
  return { buffer, mimeType: 'image/jpeg' }
}

function buildGeminiPrompt(params: {
  width: number
  height: number
  maxIssues: number
}) {
  const { width, height, maxIssues } = params

  return [
    'You are a senior UX and accessibility auditor.',
    'Analyze the UI screenshot and return ONLY valid JSON (no markdown, no commentary).',
    '',
    'Output schema:',
    '{',
    '  "issues": [',
    '    {',
    '      "issue_type": "contrast" | "spacing" | "accessibility" | "layout",',
    '      "severity": "error" | "warning" | "info",',
    '      "title": string,',
    '      "description": string,',
    '      "x": integer,',
    '      "y": integer,',
    '      "width": integer,',
    '      "height": integer,',
    '      "rule_id": string (optional)',
    '    }',
    '  ]',
    '}',
    '',
    `Constraints:`,
    `- Coordinates are in PIXELS in the original image coordinate space.`,
    `- Image size is width=${width}, height=${height}.`,
    `- Use top-left origin (0,0).`,
    `- Ensure x,y >= 0; width,height > 0; x+width <= ${width}; y+height <= ${height}.`,
    `- Return at most ${maxIssues} issues.`,
    `- Focus on actionable UX + accessibility findings (WCAG, hierarchy, layout consistency, tap targets, clarity).`,
    `- Avoid nitpicks and purely aesthetic opinions.`,
  ].join('\n')
}

async function callGeminiGenerateContent(params: {
  apiKey: string
  model: string
  prompt: string
  imageBase64: string
  imageMimeType: string
  timeoutMs: number
}) {
  const { apiKey, model, prompt, imageBase64, imageMimeType, timeoutMs } = params

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`

  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType: imageMimeType, data: imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      // Some models support this; if not, we still parse JSON from text output.
      responseMimeType: 'application/json',
    },
  }

  const resp = await fetchWithTimeout(url, timeoutMs).then((r) =>
    r.ok ? r : r.text().then((t) => Promise.reject(new Error(`Gemini error ${r.status}: ${t}`)))
  )

  const data = (await resp.json()) as any
  const parts: any[] = data?.candidates?.[0]?.content?.parts ?? []
  const text = parts.map((p) => p?.text).filter(Boolean).join('\n')
  if (!text) {
    throw new Error('Gemini returned no text content')
  }
  return text
}

export async function analyzeWithGemini(imageUrl: string, metadata: ImageMetadata): Promise<AnalysisIssue[]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return []

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
  const timeoutMs = envInt('GEMINI_TIMEOUT_MS', 30000)
  const maxIssues = envInt('GEMINI_MAX_ISSUES', 15)
  const maxDim = envInt('GEMINI_IMAGE_MAX_DIM', 2048)

  // Fetch and preprocess image
  const imgResp = await fetchWithTimeout(imageUrl, timeoutMs)
  if (!imgResp.ok) {
    throw new Error(`Failed to fetch image for Gemini: ${imgResp.status} ${imgResp.statusText}`)
  }
  const mimeType = guessMimeType(imageUrl, imgResp.headers.get('content-type'))
  const arrayBuffer = await imgResp.arrayBuffer()
  const originalBuffer = Buffer.from(arrayBuffer)
  const { buffer, mimeType: processedMime } = await preprocessImageForGemini(originalBuffer, maxDim)

  const prompt = buildGeminiPrompt({
    width: metadata.width,
    height: metadata.height,
    maxIssues,
  })

  const rawText = await callGeminiGenerateContent({
    apiKey,
    model,
    prompt,
    imageBase64: buffer.toString('base64'),
    imageMimeType: processedMime || mimeType,
    timeoutMs,
  })

  const jsonText = extractJsonFromText(rawText)
  const parsed = GeminiResponseSchema.safeParse(JSON.parse(jsonText))
  if (!parsed.success) {
    throw new Error(`Gemini JSON validation failed: ${parsed.error.message}`)
  }

  const issues: AnalysisIssue[] = []

  for (let i = 0; i < parsed.data.issues.length; i++) {
    const issue = parsed.data.issues[i]

    // Clamp boxes into image bounds
    const x = clampInt(issue.x, 0, Math.max(0, metadata.width - 1))
    const y = clampInt(issue.y, 0, Math.max(0, metadata.height - 1))
    const maxW = Math.max(1, metadata.width - x)
    const maxH = Math.max(1, metadata.height - y)
    const width = clampInt(issue.width, 1, maxW)
    const height = clampInt(issue.height, 1, maxH)

    const issue_type = issue.issue_type as GeminiIssueType
    const severity = issue.severity as GeminiSeverity

    // Basic sanity: skip degenerate boxes
    if (width <= 0 || height <= 0) continue

    issues.push({
      issue_type,
      severity,
      title: issue.title,
      description: issue.description,
      x,
      y,
      width,
      height,
      rule_id: `gemini:${issue.rule_id || `vision:v1:${i}`}`,
    })
  }

  return issues
}


