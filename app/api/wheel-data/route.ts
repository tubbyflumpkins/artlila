import { NextResponse } from 'next/server';
import { loadTopics, loadConstraints } from '@/lib/loadWheelData';

export async function GET() {
  try {
    const topics = loadTopics();
    const constraints = loadConstraints();
    
    return NextResponse.json({
      topics,
      constraints
    });
  } catch (error) {
    console.error('Error loading wheel data:', error);
    return NextResponse.json(
      { error: 'Failed to load wheel data' },
      { status: 500 }
    );
  }
}