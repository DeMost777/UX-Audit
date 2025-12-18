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
        const urlMatch = analysis.file_url.match(/\/storage\/v1\/object\/(public|sign)\/([^\/]+)\/(.+)$/)
        
        if (urlMatch) {
          const bucket = urlMatch[2]
          const filePath = urlMatch[3]
          
          // Generate signed URL (valid for 1 hour)
          const { data: signedUrlData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, 3600)
          
          if (!signedError && signedUrlData?.signedUrl) {
            imageUrl = signedUrlData.signedUrl
            console.log('Generated signed URL for analysis:', analysis.id)
          } else {
            console.warn('Failed to generate signed URL:', signedError?.message)
            // If signed URL fails and bucket is public, try public URL
            if (urlMatch[1] === 'public') {
              const { data: publicUrlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)
              imageUrl = publicUrlData.publicUrl
            }
          }
        } else {
          console.warn('Could not parse storage URL:', analysis.file_url)
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

