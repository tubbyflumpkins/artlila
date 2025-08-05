import fs from 'fs';
import path from 'path';

export interface WheelSegment {
  id: number;
  text: string;
  emoji: string;
}

function parseWheelFile(filePath: string): WheelSegment[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
      const [text, emoji] = line.split('|');
      return {
        id: index + 1,
        text: text.trim(),
        emoji: emoji.trim()
      };
    });
  } catch (error) {
    console.error(`Error reading wheel file ${filePath}:`, error);
    return [];
  }
}

export function loadTopics(): WheelSegment[] {
  const topicsPath = path.join(process.cwd(), 'WheelContents', 'topics.txt');
  return parseWheelFile(topicsPath);
}

export function loadConstraints(): WheelSegment[] {
  const constraintsPath = path.join(process.cwd(), 'WheelContents', 'constraints.txt');
  return parseWheelFile(constraintsPath);
}