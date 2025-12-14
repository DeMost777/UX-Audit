import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Image Proxy Endpoint
 * 
 * This endpoint proxies images from Supabase Storage with authentication.
 * Use this when the storage bucket is private.
 * 
 * Usage: /api/image/[bucket]/[filepath]
 * Example: /api/image/design-uploads/user-id/timestamp-filename.png
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { path } = await params
    const pathParts = path.split('/')
    
    if (pathParts.length < 2) {
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      )
    }

    const bucket = pathParts[0]
    const filePath = pathParts.slice(1).join('/')

    // Verify user owns the file (for security)
    if (bucket === 'design-uploads' && !filePath.startsWith(user.id)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath)

    if (error || !data) {
      console.error('Storage download error:', error)
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Convert blob to buffer
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Determine content type from file extension
    const extension = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'image/png'
    if (extension === 'jpg' || extension === 'jpeg') {
      contentType = 'image/jpeg'
    } else if (extension === 'png') {
      contentType = 'image/png'
    } else if (extension === 'svg') {
      contentType = 'image/svg+xml'
    }

    // Return the image with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

