import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Extract base64 data from data URL
    const base64Data = image.split(',')[1];
    
    // Call OpenAI Vision API (or any other LLM with vision capabilities)
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
                text: 'Analyze this image and describe what you see. Focus on identifying any objects, activities, or situations that might be relevant for community reporting or documentation.'
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
        max_tokens: 300
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('Failed to analyze image with LLM');
    }

    const aiResult = await openaiResponse.json();
    const description = aiResult.choices[0]?.message?.content || 'Unable to analyze image';

    return NextResponse.json({
      success: true,
      description,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}