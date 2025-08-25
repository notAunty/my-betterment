import { NextRequest, NextResponse } from 'next/server';
import type { AIAnalysisResult } from '@/types/database';

export const dynamic = 'force-dynamic';

const CLASSIFICATION_PROMPT = `You are an AI assistant specialized in analyzing images for civic problem reporting in Malaysia. Your task is to:

1. Classify the problem type as either "parking" or "infrastructure"
2. Identify the specific problem subtype
3. Extract license plate numbers if visible (Malaysian format)
4. Provide a confidence score (0-1)
5. Give a brief description

PROBLEM TYPES:
- parking: illegal_parking, double_parking, blocking_driveway, disabled_spot_violation, fire_lane_violation, no_parking_zone
- infrastructure: pothole, damaged_infrastructure, broken_streetlight, dangerous_walkway, damaged_road_sign, blocked_drain

RESPONSE FORMAT (JSON only):
{
  "problemType": "parking" | "infrastructure",
  "problemSubtype": "specific_subtype_from_list_above",
  "licensePlate": "ABC1234" | null,
  "confidence": 0.85,
  "description": "Brief description of what you see",
  "requiresRetake": false
}

If the image is unclear, blurry, or doesn't show a clear civic problem, set "requiresRetake": true and "confidence": below 0.5.

Malaysian license plates typically follow patterns like:
- ABC1234 (3 letters + 4 numbers)
- WA1234A (state code + numbers + letter)
- V1234 (commercial vehicles)

Analyze this image:`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Check if we have OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      // Return mock response for development
      return NextResponse.json({
        success: true,
        analysis: {
          problemType: 'parking',
          problemSubtype: 'illegal_parking',
          licensePlate: 'ABC1234',
          confidence: 0.85,
          description: 'Car parked illegally in no-parking zone',
          requiresRetake: false
        } as AIAnalysisResult,
        timestamp: new Date().toISOString()
      });
    }
    
    // Call OpenAI Vision API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: CLASSIFICATION_PROMPT
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1 // Low temperature for consistent classification
      })
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }

    const aiResult = await openaiResponse.json();
    const content = aiResult.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Parse the JSON response
    let analysis: AIAnalysisResult;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      analysis = JSON.parse(jsonStr);

      // Validate the response structure
      if (!analysis.problemType || !analysis.problemSubtype || typeof analysis.confidence !== 'number') {
        throw new Error('Invalid analysis structure');
      }

      // Ensure confidence is between 0 and 1
      analysis.confidence = Math.max(0, Math.min(1, analysis.confidence));

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError, content);
      // Fallback to requiring retake if parsing fails
      analysis = {
        problemType: 'parking',
        problemSubtype: 'illegal_parking',
        confidence: 0.3,
        description: 'Unable to clearly identify the problem. Please retake the photo.',
        requiresRetake: true
      };
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Return a fallback response that requires retake
    return NextResponse.json({
      success: false,
      analysis: {
        problemType: 'parking',
        problemSubtype: 'illegal_parking',
        confidence: 0.2,
        description: 'Analysis failed. Please retake the photo.',
        requiresRetake: true
      } as AIAnalysisResult,
      error: 'Failed to analyze image',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}