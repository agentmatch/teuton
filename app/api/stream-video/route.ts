import { NextRequest, NextResponse } from 'next/server'

interface ManifestChunk {
  index: number
  filename: string
  size: number
}

interface VideoManifest {
  originalFile: string
  totalSize: number
  chunkSize: number
  numChunks: number
  chunks: ManifestChunk[]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get('id')
  
  if (!videoId) {
    return NextResponse.json({ error: 'Video ID required' }, { status: 400 })
  }

  try {
    // First, fetch the manifest to know how many chunks we have
    const manifestUrl = `https://content.silvergrail.com/videos/${videoId}/manifest.json`
    const manifestResponse = await fetch(manifestUrl)
    
    if (!manifestResponse.ok) {
      throw new Error('Manifest not found')
    }
    
    const manifest: VideoManifest = await manifestResponse.json()
    
    // Stream chunks
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for (const chunk of manifest.chunks) {
            const chunkUrl = `https://content.silvergrail.com/videos/${videoId}/${chunk.filename}`
            console.log(`Fetching chunk: ${chunkUrl}`)
            
            const chunkResponse = await fetch(chunkUrl)
            
            if (!chunkResponse.ok) {
              console.warn(`Chunk ${chunk.filename} not found, status: ${chunkResponse.status}`)
              continue
            }
            
            const chunkData = await chunkResponse.arrayBuffer()
            controller.enqueue(new Uint8Array(chunkData))
          }
          controller.close()
        } catch (error) {
          console.error('Error streaming chunks:', error)
          controller.error(error)
        }
      }
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'video/webm',
        'Content-Length': manifest.totalSize.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (error) {
    console.error('Error streaming video:', error)
    return NextResponse.json({ error: 'Failed to stream video' }, { status: 500 })
  }
}