# ArtLila Presentation Guidelines

## Overview
This document contains guidelines for creating educational presentations for Dylan's elementary art class (Arts Plastiques). These presentations are displayed on smartboards for 1st-5th grade students.

## Design Principles

### Visual Style
- **Clean and minimalist** - Avoid clutter, use plenty of whitespace
- **Bold and readable** - Large text sizes that scale well (text-3xl minimum for body text)
- **Colorful but not overwhelming** - Use gradients and colors strategically
- **Engaging for children** - Include emojis, animations, and interactive elements

### Typography
- **Titles**: Use Cooper font (font-cooper) for main headings
- **Body text**: Use Neue Haas font (font-neue-haas) for all other text
- **Size hierarchy**:
  - Main titles: text-6xl to text-8xl
  - Subtitles: text-3xl to text-5xl  
  - Body text: text-xl to text-3xl
  - Small text: text-base to text-xl
- **Font weights**: Use font-bold for emphasis, font-light for secondary text

### Color Palette
- **Text colors**: Primarily gray-800 for dark text, white for text on images
- **Backgrounds**: Light gradients (gray-50 to gray-100) or colorful gradients for special slides
- **Accent colors**: Use Tailwind color-500 variants (purple-500, yellow-500, pink-500, etc.)
- **Always ensure contrast** - Text must be clearly readable against backgrounds

## Slide Types

### 1. BackgroundImageTitleSlide
**Use for**: Opening slides, dramatic introductions
**Structure**:
```typescript
{
  title: string,
  subtitle?: string,
  backgroundImage: string
}
```
**Best practices**: 
- Use high-quality, full-bleed images
- Ensure text has drop-shadow for readability
- Keep text minimal

### 2. BubbleSlide
**Use for**: Presenting related concepts, personal information, fun facts
**Structure**:
```typescript
{
  title?: string,
  bubbles: Array<{
    text: string,
    emoji?: string,
    color: string, // Use Tailwind classes like 'bg-purple-500'
    size?: 'small' | 'medium' | 'large'
  }>
}
```
**Best practices**:
- Limit to 5-6 bubbles maximum
- Vary bubble sizes for visual interest
- Use contrasting colors that don't clash with gray background
- Center title above bubbles, not at top of screen

### 3. ThreeColumnSlide
**Use for**: Comparing concepts, showing categories, presenting options
**Structure**:
```typescript
{
  title?: string,
  columns: [
    { emoji: string, text: string },
    { emoji: string, text: string },
    { emoji: string, text: string }
  ]
}
```
**Best practices**:
- Always use exactly 3 columns
- Keep text concise in each column
- Use relevant, large emojis (text-6xl to text-7xl)

### 4. ImageSlide
**Use for**: Showing artwork, photos, visual examples
**Structure**:
```typescript
{
  title?: string,
  imageUrl: string,
  caption?: string,
  size?: 'small' | 'medium' | 'large' | 'full'
}
```
**Best practices**:
- Scale images appropriately (50% reduction works well for portraits)
- Include titles for context
- Use 'large' size as default

### 5. BulletSlide
**Use for**: Lists, steps, traditional information
**Structure**:
```typescript
{
  title: string,
  bullets: string[],
  numbered?: boolean
}
```
**Best practices**:
- Avoid when possible - prefer visual alternatives
- Limit to 4-5 bullets maximum
- Use numbered lists for sequential steps

### 6. TextSlide
**Use for**: Important messages, quotes, simple announcements
**Structure**:
```typescript
{
  heading?: string,
  text: string,
  alignment?: 'left' | 'center' | 'right'
}
```
**Best practices**:
- Center alignment for announcements
- Keep text brief and impactful
- Use for closing slides or transitions

### 7. Custom Slides (SketchTimeSlide, etc.)
**Use for**: Specific recurring activities, interactive elements
**Best practices**:
- Create custom components for frequently used formats
- Include interactive elements where appropriate
- Maintain consistent styling with other slides

## Content Guidelines

### Language & Bilingual Support
- **Primary language**: French
- **Bilingual system**: All presentations support French/English toggle
- **Language toggle**: 
  - Button in controls bar with 🇫🇷 and 🇺🇸 flags
  - Keyboard shortcut: Press "L" to toggle
  - Toggle state persists throughout presentation
- **Tone**: Friendly, encouraging, age-appropriate
- **Clarity**: Simple, clear instructions that 6-11 year olds can understand

### Implementing Bilingual Content

#### Basic Usage
Text can be either:
1. **String only** (backward compatible, assumes French):
```typescript
title: 'Bienvenue!'
```

2. **Bilingual object**:
```typescript
title: { fr: 'Bienvenue!', en: 'Welcome!' }
```

#### Example Implementations

**Standard Slide Types:**
```typescript
{
  type: 'text',
  content: {
    heading: { fr: 'Essayez maintenant', en: 'Try it now' },
    text: { 
      fr: 'Écrivez votre nom sur les carnets', 
      en: 'Write your name on the notebooks' 
    },
    alignment: 'center'
  }
}

{
  type: 'image',
  content: {
    title: { fr: 'Moi au LILA, 2006', en: 'Me at LILA, 2006' },
    imageUrl: '/images/week_1/photo.jpg',
    caption: { fr: 'Première année', en: 'First year' }
  }
}
```

**Custom Components:**
```typescript
{
  type: 'custom',
  content: {
    component: BubbleSlide,
    props: {
      title: { fr: 'Qui suis-je?', en: 'Who am I?' },
      bubbles: [
        { 
          text: { fr: 'Peintre', en: 'Painter' }, 
          emoji: '🎨', 
          color: 'bg-blue-500' 
        }
      ]
    }
  }
}
```

#### Helper Functions
The system uses helper functions from `/lib/presentations/bilingualHelpers.ts`:
```typescript
import { getText } from '@/lib/presentations/bilingualHelpers';

// In your component:
{getText(title, language)}
```

#### Language-Specific Content in Custom Components
For components with hardcoded text (like SketchTimeSlide), use conditional rendering:
```typescript
const instructions = language === 'fr' ? [
  { title: 'Fais tourner les roues', subtitle: '(Instructions en français)' }
] : [
  { title: 'Spin the wheels', subtitle: '(Instructions in English)' }
];

const buttonText = language === 'fr' ? 'C\'EST PARTI!' : 'LET\'S GO!';
```

### Structure
1. **Opening**: Always start with an engaging visual (BackgroundImageTitleSlide)
2. **Introduction**: Present yourself or the topic (BubbleSlide works well)
3. **Content**: Mix slide types to maintain engagement
4. **Interactive**: Include activities or interactive elements
5. **Closing**: Clear call-to-action or summary

### Best Practices
- **No bullet points when possible** - Use visual layouts instead
- **Include emojis** - They help with comprehension and engagement
- **Vary slide types** - Don't use the same format repeatedly
- **Keep it short** - 6-8 slides maximum for most presentations
- **Test readability** - Ensure text is visible from back of classroom

## Technical Implementation

### File Structure
```
/app/
  /lessons/
    /[week]/
      page.tsx                    # Week overview page
      /[presentationId]/
        page.tsx                  # Presentation viewer page
/components/
  PresentationViewer.tsx          # Main presentation container
  /slides/
    index.ts                      # Exports all slide types
    BackgroundImageTitleSlide.tsx # Individual slide components
    BubbleSlide.tsx
    ThreeColumnSlide.tsx
    ImageSlide.tsx
    BulletSlide.tsx
    TextSlide.tsx
    CustomSlide.tsx
    SketchTimeSlide.tsx          # Custom activity slides
/lib/
  /presentations/
    types.ts                      # TypeScript interfaces
    week1.tsx                     # Week 1 presentations
    week2.tsx                     # Week 2 presentations (etc.)
```

### How the Presentation System Works

#### 1. PresentationViewer Component
The main container that handles:
- Slide navigation (keyboard and buttons)
- Fullscreen functionality
- 150% scaling in fullscreen mode
- Progress tracking
- Controls overlay

Key features:
```typescript
// Captures container dimensions when not fullscreen
const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

// In fullscreen, applies transform scale
style={isFullscreen && containerDimensions.width > 0 ? {
  width: `${containerDimensions.width}px`,
  height: `${containerDimensions.height}px`,
  transform: 'scale(1.5)',
  transformOrigin: 'center center'
} : {}}
```

#### 2. Slide Type System
Each slide type is defined in the TypeScript interface:
```typescript
// In /lib/presentations/types.ts
export type Slide = 
  | TitleSlide 
  | TextSlide 
  | BulletSlide 
  | ImageSlide 
  | SplitSlide 
  | CustomSlide;

// Custom slides use this pattern:
export interface CustomSlide {
  type: 'custom';
  content: {
    component: React.ComponentType<any>;
    props: any;
  };
}
```

#### 3. Creating a New Presentation

**Step 1**: Create the presentation file
```typescript
// /lib/presentations/week2.tsx
import { Presentation } from './types';
import BackgroundImageTitleSlide from '@/components/slides/BackgroundImageTitleSlide';
import BubbleSlide from '@/components/slides/BubbleSlide';

export const myNewPresentation: Presentation = {
  id: 'week2-colors',  // Must be unique
  title: 'Les Couleurs',
  description: 'Introduction aux couleurs primaires',
  week: 2,
  slides: [
    {
      type: 'custom',
      content: {
        component: BackgroundImageTitleSlide,
        props: {
          title: 'Les Couleurs',
          subtitle: 'Semaine 2',
          backgroundImage: '/images/week_2/colors.jpg'
        }
      }
    },
    {
      type: 'bullets',
      content: {
        title: 'Couleurs Primaires',
        bullets: ['Rouge', 'Bleu', 'Jaune']
      }
    }
    // More slides...
  ]
};

// Export all week 2 presentations
export const week2Presentations = [myNewPresentation];
```

**Step 2**: Update the presentation page to include your week
```typescript
// In /app/lessons/[week]/[presentationId]/page.tsx
const getPresentationsForWeek = (week: string): Presentation[] => {
  switch (week) {
    case '1':
      return week1Presentations;
    case '2':
      return week2Presentations;  // Add this
    default:
      return [];
  }
};
```

**Step 3**: Add week to the lessons grid
```typescript
// In /app/lessons/page.tsx
// The grid already shows 36 weeks, presentations will appear when added
```

### Creating Custom Slide Components

**Step 1**: Create the component
```typescript
// /components/slides/MyCustomSlide.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface MyCustomSlideProps {
  title?: string;
  // Add your props
}

export default function MyCustomSlide({ title }: MyCustomSlideProps) {
  return (
    <div className="h-full w-full p-8">
      {/* Your slide content */}
    </div>
  );
}
```

**Step 2**: Use in a presentation
```typescript
import MyCustomSlide from '@/components/slides/MyCustomSlide';

slides: [
  {
    type: 'custom',
    content: {
      component: MyCustomSlide,
      props: {
        title: 'Mon Titre'
      }
    }
  }
]
```

### Important Implementation Details

#### Responsive Classes
Always use responsive Tailwind classes:
```typescript
// Good
className="text-3xl md:text-4xl lg:text-5xl"

// Bad (won't scale properly)
className="text-5xl"
```

#### Color Classes
For dynamic colors, use inline styles or predefined mappings:
```typescript
// Good - inline style
style={{ backgroundColor: '#a855f7' }}

// Good - color mapping
const colorMap = {
  'bg-purple-500': '#a855f7',
  'bg-yellow-500': '#eab308'
};

// Bad - dynamic Tailwind class (will be purged)
className={`bg-${color}-500`}
```

#### Z-Index Hierarchy
- Slide content: No z-index or z-10
- Controls bar: z-50
- Modal/overlays: z-50 or higher

#### Animation Patterns
Use Framer Motion for consistency:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Adding Images
1. Place images in `/public/images/week_N/`
2. Reference with absolute paths: `/images/week_1/example.jpg`
3. Use Next.js Image component when possible for optimization

### Example Full Implementation with Bilingual Support
```typescript
// Complete example of adding a new Week 2 presentation with bilingual content

// 1. Create /lib/presentations/week2.tsx
import { Presentation } from './types';
import BackgroundImageTitleSlide from '@/components/slides/BackgroundImageTitleSlide';
import ThreeColumnSlide from '@/components/slides/ThreeColumnSlide';

export const colorsIntro: Presentation = {
  id: 'week2-colors',
  title: 'Introduction aux Couleurs',
  description: 'Apprendre les couleurs primaires et secondaires',
  week: 2,
  slides: [
    {
      type: 'custom',
      content: {
        component: BackgroundImageTitleSlide,
        props: {
          title: { fr: 'Les Couleurs', en: 'Colors' },
          subtitle: { 
            fr: 'Arts Plastiques - Semaine 2', 
            en: 'Art Class - Week 2' 
          },
          backgroundImage: '/images/week_2/rainbow.jpg'
        }
      }
    },
    {
      type: 'custom',
      content: {
        component: ThreeColumnSlide,
        props: {
          title: { 
            fr: 'Couleurs Primaires', 
            en: 'Primary Colors' 
          },
          columns: [
            { emoji: '🔴', text: { fr: 'Rouge', en: 'Red' } },
            { emoji: '🔵', text: { fr: 'Bleu', en: 'Blue' } },
            { emoji: '🟡', text: { fr: 'Jaune', en: 'Yellow' } }
          ]
        }
      }
    }
  ]
};

export const week2Presentations = [colorsIntro];

// 2. Update /app/lessons/[week]/[presentationId]/page.tsx
// Add case '2': return week2Presentations;

// 3. Add images to /public/images/week_2/
// 4. Test in browser at /lessons/2/week2-colors
// 5. Test language toggle with 'L' key or button
```

## Responsive Scaling

### Current Implementation
- **Windowed mode**: Content displays at base size
- **Fullscreen mode**: Content scales to 150% while maintaining exact layout
- **No reflow**: Text, images, and spacing remain identical, just larger

### Design Considerations
- Design for windowed mode first
- Ensure adequate spacing between elements
- Test both modes before finalizing

## Accessibility Considerations
- **High contrast**: Ensure all text has sufficient contrast
- **Large text**: Minimum text-xl for body content
- **Clear navigation**: Visible controls with hover states
- **Keyboard support**: Arrow keys for navigation, F for fullscreen

## Common Patterns

### "Comment chaque classe commence" (How Each Class Begins)
- Use SketchTimeSlide with spinning wheel visual
- Include clear numbered steps
- Add interactive button to game

### Personal Introduction
- Use BubbleSlide with 5-6 personal facts
- Include relevant emojis
- Vary bubble sizes for visual hierarchy

### Activity Instructions
- Use ThreeColumnSlide or custom visual layouts
- Avoid traditional bullet points
- Include visual examples where possible

## Testing Checklist
- [ ] All text is readable from distance
- [ ] Images load correctly
- [ ] Navigation controls work on all slides
- [ ] Fullscreen scaling works properly
- [ ] Content fits within containers
- [ ] No text overflow or cutoff
- [ ] Animations are smooth
- [ ] Interactive elements function correctly
- [ ] Language toggle works (L key and button)
- [ ] All text switches between French and English
- [ ] Language persists across slides
- [ ] Both flag emojis remain in fixed positions

## Future Enhancements
- Consider adding slide transitions
- Implement presenter notes view
- Add timer functionality for activities
- Create more custom slide types for specific activities
- Add sound effects for younger grades

## Important Notes
- **Always test on actual display size** - Smartboards may have different dimensions
- **Consider attention spans** - Keep individual slides focused and brief
- **Prioritize engagement** - Visual interest trumps information density
- **Remember the audience** - These are elementary school children, not adults

## File Paths
- Images: `/public/images/week_N/`
- Fonts: `/app/fonts/`
- Components: `/components/slides/`
- Presentations: `/lib/presentations/`

## Debugging Tips
- If buttons aren't clickable, check z-index values
- If colors appear wrong, ensure Tailwind classes are not dynamically generated
- If layout breaks, verify responsive classes are properly applied
- If scaling issues occur, check the PresentationViewer transform values