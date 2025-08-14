# Presentation System Documentation

## Overview
This directory contains the presentation system for ArtLila's lesson content. Each week can have multiple presentations that are displayed in a standardized viewer.

## Structure

### Files
- `types.ts` - TypeScript interfaces defining presentation and slide structures
- `week1.tsx`, `week2.tsx`, etc. - Presentation data for each week
- `index.ts` - Main export file that aggregates all presentations

## Slide Types

### 1. Title Slide
- Large title with optional subtitle and date
- Used for presentation openings and section breaks

### 2. Text Slide
- Body text with optional heading
- Configurable text alignment

### 3. Bullet Slide
- Bulleted or numbered lists
- Title with list items

### 4. Image Slide
- Display images with optional captions
- Configurable sizes (full, large, medium, small)

### 5. Split Slide
- Two-column layout
- Each side can contain text, bullets, or images

### 6. Custom Slide
- For complex custom React components
- Maximum flexibility for unique content

## Usage

### Adding a New Presentation
1. Create or edit the week file (e.g., `week1.tsx`)
2. Define your presentation using the Presentation interface
3. Add slides in order using the appropriate slide types
4. Export the presentation from the week file

### Example Structure
```typescript
const presentation: Presentation = {
  id: 'week1-intro',
  title: 'Introduction to Art',
  description: 'First lesson on basic art concepts',
  week: 1,
  slides: [
    {
      type: 'title',
      content: {
        title: 'Welcome to Art Class',
        subtitle: 'Week 1',
        date: 'September 2024'
      }
    },
    // More slides...
  ]
};
```

## Navigation
- Arrow keys: Previous/Next slide
- Spacebar: Next slide
- ESC: Exit fullscreen
- F: Toggle fullscreen