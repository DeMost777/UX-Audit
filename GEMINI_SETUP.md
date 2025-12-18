# Gemini Setup (AI UX analysis)

Flow UX AI can run **Gemini Vision** automatically after each upload to generate UX issues with **pixel bounding boxes**.

## 1) Create an API key

- Use Google AI Studio and create an API key for the **Generative Language API**.
- Keep this key **server-side only** (never expose it as `NEXT_PUBLIC_*`).

## 2) Add environment variables

Create or update your `.env.local`:

```env
# Gemini (server-only)
GEMINI_API_KEY=YOUR_KEY_HERE

# Model name (example value; choose the exact model you want)
GEMINI_MODEL=gemini-2.0-flash

# Optional tuning
GEMINI_MAX_ISSUES=15
GEMINI_IMAGE_MAX_DIM=2048
GEMINI_TIMEOUT_MS=30000
```

## 3) How it runs

- Upload image → `/api/upload` creates an `analyses` row
- App triggers `/api/analyze`
- `/api/analyze` runs:
  - Deterministic rule-based analysis (existing)
  - Gemini vision analysis (new)
- Both sets of issues are stored in `analysis_results` and shown on the canvas.

## 4) Troubleshooting

- **401/403 from Gemini**: invalid key or API not enabled for the project
- **Timeouts**: increase `GEMINI_TIMEOUT_MS` or reduce `GEMINI_IMAGE_MAX_DIM`
- **Bad boxes**: Gemini boxes are clamped to image bounds; reduce `GEMINI_MAX_ISSUES` to improve quality


