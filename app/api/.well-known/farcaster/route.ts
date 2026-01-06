import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

/**
 * Serve Farcaster Mini App manifest
 * Required for Talent Protocol to recognize this as a Farcaster Mini App
 */
export async function GET() {
    try {
        const manifestPath = path.join(process.cwd(), 'public', '.well-known', 'farcaster.json')
        const manifestData = await fs.promises.readFile(manifestPath, 'utf8')
        const manifest = JSON.parse(manifestData)

        return NextResponse.json(manifest, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600',
            },
        })
    } catch (error) {
        console.error('Error serving Farcaster manifest:', error)
        return NextResponse.json(
            { error: 'Manifest not found' },
            { status: 404 }
        )
    }
}
