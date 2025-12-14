import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params

    // Fetch analysis with results and metadata
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Fetch analysis results
    const { data: results, error: resultsError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('analysis_id', id)
      .order('severity', { ascending: false })

    // Fetch analysis metadata
    const { data: metadata } = await supabase
      .from('analysis_metadata')
      .select('*')
      .eq('analysis_id', id)
      .single()

    // Generate signed URL for the image if it's stored in Supabase Storage
    // This handles both public and private buckets
    let imageUrl = analysis.file_url
    
    // If the URL is a Supabase storage URL, try to generate a signed URL
    // This works for both public and private buckets
    if (analysis.file_url && analysis.file_url.includes('supabase.co/storage')) {
      try {
        // Extract file path from URL
        // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
        // or: https://[project].supabase.co/storage/v1/object/sign/[bucket]/[path]
        const urlParts = analysis.file_url.split('/storage/v1/object/')
        if (urlParts.length > 1) {
          const remainingPath = urlParts[1]
          const pathParts = remainingPath.split('/')
          const bucket = pathParts[0]
          const filePath = pathParts.slice(1).join('/')
          
          // Generate signed URL (valid for 1 hour)
          const { data: signedUrlData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, 3600)
          
          if (!signedError && signedUrlData) {
            imageUrl = signedUrlData.signedUrl
          }
        }
      } catch (err) {
        console.error('Error generating signed URL:', err)
        // Fall back to original URL
      }
    }

    return NextResponse.json({
      analysis: {
        ...analysis,
        file_url: imageUrl,
      },
      results: results || [],
      metadata: metadata || null,
    })
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

