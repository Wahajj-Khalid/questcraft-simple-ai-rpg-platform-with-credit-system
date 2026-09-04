import { NextResponse } from 'next/server'

function splitTextIntoChunks(text: string, maxLen = 150): string[] {
  const clean = text.replace(/[*_#`~]/g, '').trim()
  if (!clean) return []

  // Split into natural sentences
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean]
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length <= maxLen) {
      current = (current + ' ' + sentence).trim()
    } else {
      if (current) chunks.push(current)
      current = sentence.trim().slice(0, maxLen)
    }
  }
  if (current) chunks.push(current)

  return chunks.length > 0 ? chunks : [clean.slice(0, maxLen)]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const text = searchParams.get('text')

  if (!text) {
    return new NextResponse('Missing text parameter', { status: 400 })
  }

  try {
    // Split long DM text into clean sentence chunks
    const chunks = splitTextIntoChunks(text, 150).slice(0, 4)
    const audioBuffers: Buffer[] = []

    for (const chunk of chunks) {
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=en&client=tw-ob`

      const res = await fetch(googleTtsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
      })

      if (res.ok) {
        const buf = await res.arrayBuffer()
        audioBuffers.push(Buffer.from(buf))
      }
    }

    if (audioBuffers.length === 0) {
      throw new Error('Google TTS returned no audio buffers')
    }

    // Concatenate all MP3 sentence buffers into one smooth MP3 file
    const combinedBuffer = Buffer.concat(audioBuffers)

    return new NextResponse(combinedBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error: any) {
    console.error('Server TTS Error:', error)
    return new NextResponse('Failed to generate audio', { status: 500 })
  }
}