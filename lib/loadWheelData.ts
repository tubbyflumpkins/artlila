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
      // Handle both pipe and comma separators for backward compatibility
      const separator = line.includes('|') ? '|' : ',';
      const parts = line.split(separator);
      
      // Take the last part as emoji and everything before as text
      const emoji = parts[parts.length - 1].trim();
      const text = parts.slice(0, -1).join(separator).trim();
      
      return {
        id: index + 1,
        text: text || emoji, // Fallback to emoji if no text
        emoji: emoji
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