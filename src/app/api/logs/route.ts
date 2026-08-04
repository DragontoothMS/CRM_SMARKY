import { NextRequest, NextResponse } from 'next/server'
import { readLogs, clearLogs } from '@/lib/logger-server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const lines = parseInt(searchParams.get('lines') || '100', 10)
  const logs = readLogs(lines)
  return NextResponse.json({ logs })
}

export async function DELETE() {
  clearLogs()
  return NextResponse.json({ success: true })
}