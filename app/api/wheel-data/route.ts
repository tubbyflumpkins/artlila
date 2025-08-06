import { NextResponse } from 'next/server';
import { loadTopics, loadConstraints } from '@/lib/loadWheelData';
import fs from 'fs';
import path from 'path';

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

export async function POST(request: Request) {
  try {
    const { topics, constraints } = await request.json();
    
    const topicsPath = path.join(process.cwd(), 'WheelContents', 'topics.txt');
    const constraintsPath = path.join(process.cwd(), 'WheelContents', 'constraints.txt');
    
    // Write the updated content to files
    fs.writeFileSync(topicsPath, topics, 'utf-8');
    fs.writeFileSync(constraintsPath, constraints, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving wheel data:', error);
    return NextResponse.json(
      { error: 'Failed to save wheel data' },
      { status: 500 }
    );
  }
}