import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processAnalysis } from '@/lib/analysis/processor'

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

    const { analysisId } = await request.json()

    if (!analysisId) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      )
    }

    // Fetch analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single()

    if (analysisError || !analysis) {
      return NextResponse.json(
        { error: 'Analysis not found' },
        { status: 404 }
      )
    }

    // Check if already processed
    if (analysis.status === 'completed' || analysis.status === 'processing') {
      return NextResponse.json(
        { error: 'Analysis already processed or in progress' },
        { status: 400 }
      )
    }

    // Update status to processing
    await supabase
      .from('analyses')
      .update({ status: 'processing' })
      .eq('id', analysisId)

    try {
      // Process the analysis
      const { issues, metadata, duration } = await processAnalysis(
        analysisId,
        analysis.file_url
      )

      // Save results to database
      if (issues.length > 0) {
        const { error: resultsError } = await supabase
          .from('analysis_results')
          .insert(
            issues.map(issue => ({
              analysis_id: analysisId,
              ...issue,
            }))
          )

        if (resultsError) {
          console.error('Error saving results:', resultsError)
        }
      }

      // Save metadata
      const { error: metadataError } = await supabase
        .from('analysis_metadata')
        .insert({
          analysis_id: analysisId,
          image_width: metadata.width,
          image_height: metadata.height,
          total_issues: issues.length,
          analysis_duration_ms: duration,
        })

      if (metadataError) {
        console.error('Error saving metadata:', metadataError)
      }

      // Update analysis status to completed
      await supabase
        .from('analyses')
        .update({ status: 'completed' })
        .eq('id', analysisId)

      return NextResponse.json({
        success: true,
        analysis: {
          id: analysisId,
          status: 'completed',
          total_issues: issues.length,
        },
      })
    } catch (error) {
      // Update analysis status to failed
      await supabase
        .from('analyses')
        .update({ status: 'failed' })
        .eq('id', analysisId)

      console.error('Analysis processing error:', error)
      return NextResponse.json(
        { error: 'Analysis processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

