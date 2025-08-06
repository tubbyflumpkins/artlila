import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const topicsPath = path.join(process.cwd(), 'WheelContents', 'topics.txt');
    const constraintsPath = path.join(process.cwd(), 'WheelContents', 'constraints.txt');
    
    const topicsContent = fs.readFileSync(topicsPath, 'utf-8');
    const constraintsContent = fs.readFileSync(constraintsPath, 'utf-8');
    
    return NextResponse.json({
      topics: topicsContent,
      constraints: constraintsContent
    });
  } catch (error) {
    console.error('Error reading wheel data files:', error);
    return NextResponse.json(
      { error: 'Failed to read wheel data' },
      { status: 500 }
    );
  }
}