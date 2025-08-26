import { NextResponse } from 'next/server';
import { loadTopics, loadConstraints } from '@/lib/loadWheelData';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') as 'fr' | 'en' | null;
    
    const topics = loadTopics(language || 'fr');
    const constraints = loadConstraints(language || 'fr');
    
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
    const { topics, constraints, topicsEn, constraintsEn } = await request.json();
    
    // French files (original)
    const topicsPath = path.join(process.cwd(), 'WheelContents', 'topics.txt');
    const constraintsPath = path.join(process.cwd(), 'WheelContents', 'constraints.txt');
    
    // English files
    const topicsEnPath = path.join(process.cwd(), 'WheelContents', 'topics-en.txt');
    const constraintsEnPath = path.join(process.cwd(), 'WheelContents', 'constraints-en.txt');
    
    // Write the updated content to files
    fs.writeFileSync(topicsPath, topics, 'utf-8');
    fs.writeFileSync(constraintsPath, constraints, 'utf-8');
    
    // Write English content if provided
    if (topicsEn !== undefined) {
      fs.writeFileSync(topicsEnPath, topicsEn, 'utf-8');
    }
    if (constraintsEn !== undefined) {
      fs.writeFileSync(constraintsEnPath, constraintsEn, 'utf-8');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving wheel data:', error);
    return NextResponse.json(
      { error: 'Failed to save wheel data' },
      { status: 500 }
    );
  }
}