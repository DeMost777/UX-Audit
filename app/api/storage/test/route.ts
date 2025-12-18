import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Storage Test Endpoint
 * Helps debug storage bucket configuration
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', details: authError?.message },
        { status: 401 }
      )
    }

    // Check bucket configuration
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    const designUploadsBucket = buckets?.find(b => b.id === 'design-uploads')
    
    // Try to list files in the bucket
    const { data: files, error: listError } = await supabase.storage
      .from('design-uploads')
      .list(user.id, {
        limit: 5,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    // Test URL generation
    let testUrl = null
    let signedUrl = null
    if (files && files.length > 0) {
      const testFile = files[0]
      const filePath = `${user.id}/${testFile.name}`
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath)
      testUrl = publicUrlData.publicUrl
      
      // Get signed URL
      const { data: signedUrlData, error: signedError } = await supabase.storage
        .from('design-uploads')
        .createSignedUrl(filePath, 3600)
      signedUrl = signedUrlData?.signedUrl || null
    }

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      bucket: {
        exists: !!designUploadsBucket,
        public: designUploadsBucket?.public || false,
        name: designUploadsBucket?.name,
        id: designUploadsBucket?.id,
      },
      files: {
        count: files?.length || 0,
        sample: files?.slice(0, 3).map(f => ({
          name: f.name,
          size: f.metadata?.size,
          created: f.created_at,
        })) || [],
      },
      urls: {
        publicUrl: testUrl,
        signedUrl: signedUrl,
      },
      errors: {
        buckets: bucketsError?.message,
        list: listError?.message,
      },
    })
  } catch (error) {
    console.error('Storage test error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

