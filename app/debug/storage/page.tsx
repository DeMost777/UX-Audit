'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'

interface StorageTestResult {
  authenticated: boolean
  userId?: string
  bucket?: {
    exists: boolean
    public: boolean
    name?: string
    id?: string
  }
  files?: {
    count: number
    sample: Array<{
      name: string
      size?: number
      created?: string
    }>
  }
  urls?: {
    publicUrl?: string | null
    signedUrl?: string | null
  }
  errors?: {
    buckets?: string
    list?: string
  }
  error?: string
  details?: string
}

export default function StorageDebugPage() {
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<StorageTestResult | null>(null)

  useEffect(() => {
    testStorage()
  }, [])

  const testStorage = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/storage/test')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({
        authenticated: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Storage Debug Tool</h1>
        <p className="mt-2 text-muted-foreground">
          This page helps diagnose storage bucket configuration issues
        </p>
        <Button onClick={testStorage} className="mt-4">
          Refresh Test
        </Button>
      </div>

      {result && (
        <div className="space-y-6">
          {/* Authentication Status */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Authentication</h2>
            <div className="flex items-center gap-2">
              {result.authenticated ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Authenticated</span>
                  {result.userId && (
                    <span className="text-sm text-muted-foreground">
                      (User ID: {result.userId})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span>Not Authenticated</span>
                </>
              )}
            </div>
          </div>

          {/* Bucket Status */}
          {result.bucket && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Bucket Configuration</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {result.bucket.exists ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span>Bucket exists: {result.bucket.exists ? 'Yes' : 'No'}</span>
                </div>
                {result.bucket.exists && (
                  <>
                    <div className="flex items-center gap-2">
                      {result.bucket.public ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span>Public bucket: {result.bucket.public ? 'Yes ✅' : 'No ❌'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Bucket ID: {result.bucket.id}
                    </div>
                    {!result.bucket.public && (
                      <div className="mt-4 rounded-lg bg-yellow-500/10 p-4 text-sm">
                        <p className="font-medium text-yellow-500">
                          ⚠️ Bucket is private! This is likely causing image loading issues.
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          Run this SQL in Supabase to make it public:
                        </p>
                        <code className="mt-2 block rounded bg-muted p-2">
                          UPDATE storage.buckets SET public = true WHERE id = 'design-uploads';
                        </code>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Files Status */}
          {result.files && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Files</h2>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Total files: </span>
                  <span>{result.files.count}</span>
                </div>
                {result.files.sample.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Sample files:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {result.files.sample.map((file, idx) => (
                        <li key={idx} className="font-mono">
                          {file.name} ({file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'unknown size'})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* URLs */}
          {result.urls && (
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">URLs</h2>
              <div className="space-y-4">
                {result.urls.publicUrl && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Public URL:</p>
                    <code className="block break-all rounded bg-muted p-2 text-xs">
                      {result.urls.publicUrl}
                    </code>
                    <a
                      href={result.urls.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Test URL →
                    </a>
                  </div>
                )}
                {result.urls.signedUrl && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Signed URL:</p>
                    <code className="block break-all rounded bg-muted p-2 text-xs">
                      {result.urls.signedUrl}
                    </code>
                    <a
                      href={result.urls.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      Test URL →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Errors */}
          {result.errors && Object.keys(result.errors).length > 0 && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
              <h2 className="mb-4 text-xl font-semibold text-destructive">Errors</h2>
              <div className="space-y-2 text-sm">
                {result.errors.buckets && (
                  <div>
                    <span className="font-medium">Buckets error: </span>
                    <span>{result.errors.buckets}</span>
                  </div>
                )}
                {result.errors.list && (
                  <div>
                    <span className="font-medium">List error: </span>
                    <span>{result.errors.list}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* General Error */}
          {result.error && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
              <h2 className="mb-4 text-xl font-semibold text-destructive">Error</h2>
              <p>{result.error}</p>
              {result.details && (
                <p className="mt-2 text-sm text-muted-foreground">{result.details}</p>
              )}
            </div>
          )}

          {/* Quick Fix Instructions */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Quick Fix</h2>
            <div className="space-y-4">
              <div>
                <p className="mb-2 font-medium">1. Make bucket public:</p>
                <code className="block rounded bg-muted p-2 text-sm">
                  UPDATE storage.buckets SET public = true WHERE id = 'design-uploads';
                </code>
              </div>
              <div>
                <p className="mb-2 font-medium">2. Add public read policy:</p>
                <code className="block rounded bg-muted p-2 text-sm">
                  CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'design-uploads');
                </code>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Run these in Supabase SQL Editor, then refresh this page to verify.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

