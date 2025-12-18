import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB in bytes
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

export async function POST(request: NextRequest) {
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
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG and JPG files are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      )
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = fileName

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      )
    }

    // Get URL for the uploaded file
    // For public buckets, use public URL (simpler and faster)
    // For private buckets, use signed URL
    const { data: urlData } = supabase.storage
      .from('design-uploads')
      .getPublicUrl(filePath)
    
    let fileUrl = urlData.publicUrl
    
    // Also try to get signed URL as backup (works for both public and private)
    // This ensures images load even if bucket settings change
    try {
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('design-uploads')
        .createSignedUrl(filePath, 31536000) // 1 year in seconds
      
      if (!signedUrlError && signedUrlData?.signedUrl) {
        // Prefer signed URL as it works for both public and private buckets
        fileUrl = signedUrlData.signedUrl
        console.log('Using signed URL for upload:', filePath)
      } else {
        console.log('Using public URL for upload:', filePath, signedUrlError?.message)
      }
    } catch (err) {
      console.warn('Error generating signed URL, using public URL:', err)
      // Continue with public URL
    }

    // Determine file type for database
    const fileType = fileExt?.toLowerCase() === 'png' ? 'png' : 
                     fileExt?.toLowerCase() === 'jpg' || fileExt?.toLowerCase() === 'jpeg' ? 'jpg' : 
                     'unknown'

    // Create analysis record in database
    const { data: analysisData, error: dbError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: fileUrl,
        file_type: fileType,
        status: 'pending',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Try to delete the uploaded file if database insert fails
      await supabase.storage.from('design-uploads').remove([filePath])
      
      return NextResponse.json(
        { error: 'Failed to create analysis record', details: dbError.message },
        { status: 500 }
      )
    }

    // Trigger analysis automatically in the background
    // Use setTimeout to avoid blocking the response
    setTimeout(async () => {
      try {
        const analyzeUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/analyze`
        await fetch(analyzeUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
          },
          body: JSON.stringify({ analysisId: analysisData.id }),
        })
      } catch (err) {
        console.error('Failed to trigger analysis:', err)
        // Analysis can be triggered manually if auto-trigger fails
      }
    }, 100)

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysisData.id,
        file_name: analysisData.file_name,
        file_url: analysisData.file_url,
        status: analysisData.status,
        created_at: analysisData.created_at,
      },
    })
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

