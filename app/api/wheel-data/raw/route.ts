import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const topicsPath = path.join(process.cwd(), 'WheelContents', 'topics.txt');
    const constraintsPath = path.join(process.cwd(), 'WheelContents', 'constraints.txt');
    const topicsEnPath = path.join(process.cwd(), 'WheelContents', 'topics-en.txt');
    const constraintsEnPath = path.join(process.cwd(), 'WheelContents', 'constraints-en.txt');
    
    const topicsContent = fs.readFileSync(topicsPath, 'utf-8');
    const constraintsContent = fs.readFileSync(constraintsPath, 'utf-8');
    
    // Read English content, use empty string if files don't exist yet
    let topicsEnContent = '';
    let constraintsEnContent = '';
    
    if (fs.existsSync(topicsEnPath)) {
      topicsEnContent = fs.readFileSync(topicsEnPath, 'utf-8');
    }
    if (fs.existsSync(constraintsEnPath)) {
      constraintsEnContent = fs.readFileSync(constraintsEnPath, 'utf-8');
    }
    
    return NextResponse.json({
      topics: topicsContent,
      constraints: constraintsContent,
      topicsEn: topicsEnContent,
      constraintsEn: constraintsEnContent
    });
  } catch (error) {
    console.error('Error reading wheel data files:', error);
    return NextResponse.json(
      { error: 'Failed to read wheel data' },
      { status: 500 }
    );
  }
}