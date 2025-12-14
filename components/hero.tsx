"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FileWithStatus {
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  analysisId?: string
  error?: string
}

export function Hero() {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [files, setFiles] = useState<FileWithStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    const newFiles = droppedFiles
      .filter(file => file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')
      .map(file => ({ file, status: 'pending' as const }))
    
    setFiles([...files, ...newFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const newFiles = selectedFiles
        .filter(file => file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')
        .map(file => ({ file, status: 'pending' as const }))
      
      setFiles([...files, ...newFiles])
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const uploadFile = async (fileWithStatus: FileWithStatus, index: number) => {
    const formData = new FormData()
    formData.append('file', fileWithStatus.file)

    // Update status to uploading
    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, status: 'uploading' } : f
    ))

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      // Update status to success
      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, status: 'success', analysisId: data.analysis.id }
          : f
      ))

      // Redirect to analysis page after a short delay
      setTimeout(() => {
        router.push(`/analysis/${data.analysis.id}`)
      }, 1000)
    } catch (error) {
      // Update status to error
      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
          : f
      ))
    }
  }

  const handleUpload = async () => {
    if (sessionStatus === 'loading') {
      return
    }

    if (!session) {
      router.push('/auth/signin')
      return
    }

    setUploading(true)
    
    // Upload all pending files
    const pendingFiles = files.filter(f => f.status === 'pending')
    for (let i = 0; i < pendingFiles.length; i++) {
      const fileIndex = files.findIndex(f => f === pendingFiles[i])
      await uploadFile(pendingFiles[i], fileIndex)
    }

    setUploading(false)
  }

  const pendingFiles = files.filter(f => f.status === 'pending')
  const hasFiles = files.length > 0
  const canUpload = pendingFiles.length > 0 && !uploading && session

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Automate UX audits with <span className="text-accent">AI precision</span>
          </h1>
          <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
            Transform your Figma designs instantly. Flow UX AI analyzes your interfaces with machine learning,
            delivering actionable insights faster than any human expert.
          </p>
          
          {/* Drag and Drop Upload Section */}
          <div className="mt-10">
            <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-8 shadow-lg">
              <div className="mb-4">
                <h2 className="text-xl font-bold">Upload and attach files</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload and attach files to this project.
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:flex-row">
                {/* Drag and Drop Area */}
                <div
                  className={`flex-1 rounded-lg border-2 border-dashed p-12 transition-colors cursor-pointer ${
                    isDragging
                      ? "border-accent bg-accent/5"
                      : "border-border bg-muted/30"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="relative h-16 w-16 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-foreground" />
                      </div>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      <span className="underline cursor-pointer">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Maximum file size 50 MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/png,image/jpeg,image/jpg"
                  />
                </div>

                {/* Uploaded Files List */}
                {hasFiles && (
                  <div className="flex flex-col gap-2 lg:w-64">
                    {files.map((fileWithStatus, index) => (
                      <div
                        key={index}
                        className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                          fileWithStatus.status === 'success' 
                            ? 'bg-green-500/10 border border-green-500/20'
                            : fileWithStatus.status === 'error'
                            ? 'bg-destructive/10 border border-destructive/20'
                            : fileWithStatus.status === 'uploading'
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-primary/10'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {fileWithStatus.status === 'uploading' && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                          )}
                          {fileWithStatus.status === 'success' && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                          {fileWithStatus.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                          )}
                          <span className={`truncate ${
                            fileWithStatus.status === 'success' ? 'text-green-600 dark:text-green-400' :
                            fileWithStatus.status === 'error' ? 'text-destructive' :
                            'text-primary'
                          }`}>
                            {fileWithStatus.file.name}
                          </span>
                        </div>
                        {fileWithStatus.status !== 'uploading' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(index)
                            }}
                            className="ml-2 opacity-0 transition-opacity group-hover:opacity-100 flex-shrink-0"
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              {hasFiles && (
                <div className="mt-4 flex justify-end">
                  {sessionStatus === 'loading' ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </Button>
                  ) : !session ? (
                    <Link href="/auth/signin">
                      <Button>Sign in to upload</Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={handleUpload} 
                      disabled={!canUpload}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        `Upload ${pendingFiles.length} file${pendingFiles.length !== 1 ? 's' : ''}`
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}