import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generatePDF } from '@/lib/pdf/generator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params

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

    if (resultsError) {
      return NextResponse.json(
        { error: 'Failed to fetch analysis results' },
        { status: 500 }
      )
    }

    // Generate PDF
    const pdfData = {
      fileName: analysis.file_name,
      fileUrl: analysis.file_url,
      analysisDate: analysis.created_at,
      totalIssues: results?.length || 0,
      issues: results || [],
      metadata: metadata || undefined,
    }

    const pdfBlob = await generatePDF(pdfData)

    // Return PDF as response
    const pdfBuffer = await pdfBlob.arrayBuffer()
    const pdfBytes = Buffer.from(pdfBuffer)

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ux-analysis-${analysis.file_name.replace(/\.[^/.]+$/, '')}.pdf"`,
        'Content-Length': pdfBytes.length.toString(),
      },
    })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { error: 'Failed to export PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

