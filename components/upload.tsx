"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UploadSection() {
  const [files, setFiles] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
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
    const fileNames = droppedFiles.map(file => file.name)
    setFiles([...files, ...fileNames])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const fileNames = selectedFiles.map(file => file.name)
      setFiles([...files, ...fileNames])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Upload and attach files</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload and attach files to this project.
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Drag and Drop Area */}
            <div
              className={`flex-1 rounded-lg border-2 border-dashed p-12 transition-colors ${
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
                accept=".fig,.json,.png,.jpg,.jpeg,.svg"
              />
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="flex flex-col gap-2 lg:w-64">
                {files.map((fileName, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2 text-sm"
                  >
                    <span className="truncate text-primary">{fileName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

