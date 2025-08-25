import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { supabase } from '@/lib/supabase';
import type { ReportInsert } from '@/types/database';

export const dynamic = 'force-dynamic';

// Initialize S3 client for Cloudflare R2
const s3Client = process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
}) : null;

async function uploadImageToR2(imageData: string, filename: string): Promise<string> {
  if (!s3Client || !process.env.R2_BUCKET_NAME) {
    throw new Error('R2 not configured');
  }

  // Convert base64 to buffer
  const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: `reports/${filename}`,
    Body: buffer,
    ContentType: 'image/jpeg',
    ContentDisposition: 'inline',
  });

  await s3Client.send(command);
  
  // Return public URL
  return `https://${process.env.R2_PUBLIC_URL}/reports/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    const { image, analysis, location, userId } = await request.json();

    if (!image || !analysis || !userId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    // Check if user is authenticated
    if (!supabase) {
      return NextResponse.json({
        error: 'Database not configured'
      }, { status: 500 });
    }

    // Verify user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({
        error: 'Unauthorized'
      }, { status: 401 });
    }

    let imageUrl: string;

    // Upload image to R2 or use local storage as fallback
    if (s3Client && process.env.R2_BUCKET_NAME) {
      try {
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        imageUrl = await uploadImageToR2(image, filename);
      } catch (uploadError) {
        console.error('R2 upload failed:', uploadError);
        // For development, we can use a placeholder URL
        imageUrl = `data:image/jpeg;base64,${image.split(',')[1]}`;
      }
    } else {
      // Development fallback - store as data URL
      imageUrl = image;
    }

    // Prepare report data
    const reportData: ReportInsert = {
      user_id: userId,
      image_url: imageUrl,
      problem_type: analysis.problemType,
      problem_subtype: analysis.problemSubtype,
      license_plate: analysis.licensePlate || null,
      location: location || null,
      description: analysis.description,
      ai_analysis: JSON.stringify(analysis),
      confidence_score: analysis.confidence,
      status: analysis.confidence >= 0.7 ? 'approved' : 'pending',
    };

    // Insert report into database
    const { data: report, error: insertError } = await supabase
      .from('reports')
      .insert(reportData)
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json({
        error: 'Failed to save report'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      report,
      message: 'Report submitted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json({
      error: 'Failed to submit report'
    }, { status: 500 });
  }
}