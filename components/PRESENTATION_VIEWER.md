# PresentationViewer Component

## Overview
The PresentationViewer is the main component for displaying presentations in a fullscreen, classroom-friendly format.

## Features

### Navigation
- **Arrow Keys**: Navigate between slides (← Previous, → Next)
- **Spacebar**: Go to next slide
- **Click Areas**: Left 1/3 of screen for previous, right 1/3 for next
- **On-screen Buttons**: Previous/Next navigation buttons

### Display Modes
- **Normal Mode**: Shows controls and optional teacher notes
- **Fullscreen Mode**: Maximizes presentation for classroom display
- **Toggle**: Press 'F' key or click fullscreen button

### Visual Feedback
- **Slide Counter**: Shows current slide number and total
- **Progress Bar**: Visual indicator of progress through presentation
- **Smooth Transitions**: Animated slide changes using Framer Motion

### Teacher Features
- **Notes**: Optional teacher notes displayed in normal mode
- **Exit Button**: Close presentation and return to lesson page
- **Keyboard Shortcuts**: ESC to exit fullscreen or close presentation

## Usage

```tsx
import PresentationViewer from '@/components/PresentationViewer';
import { presentation } from '@/lib/presentations/week1';

function PresentationPage() {
  return (
    <PresentationViewer
      presentation={presentation}
      onExit={() => router.back()}
    />
  );
}
```

## Keyboard Shortcuts
- **→ / Space**: Next slide
- **←**: Previous slide
- **F**: Toggle fullscreen
- **ESC**: Exit fullscreen / Close presentation

## Responsive Design
- Works on smartboards, tablets, and phones
- Touch-friendly navigation areas
- Scalable typography for different screen sizes