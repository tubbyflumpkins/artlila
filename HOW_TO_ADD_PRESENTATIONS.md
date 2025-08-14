# How to Add New Presentations

## Quick Guide

To add a new presentation to any week, follow these steps:

### 1. Create or Edit Week File

Navigate to `/lib/presentations/` and create or edit the week file (e.g., `week2.tsx`):

```typescript
import { Presentation } from './types';

export const myNewPresentation: Presentation = {
  id: 'week2-unique-id',
  title: 'Presentation Title',
  description: 'Brief description',
  week: 2,
  slides: [
    // Add slides here
  ]
};

export const week2Presentations = [myNewPresentation];
```

### 2. Add Slides

Use these slide types:

#### Title Slide
```typescript
{
  type: 'title',
  content: {
    title: 'Main Title',
    subtitle: 'Optional Subtitle',
    date: 'Optional Date'
  },
  notes: 'Optional teacher notes'
}
```

#### Text Slide
```typescript
{
  type: 'text',
  content: {
    heading: 'Optional Heading',
    text: 'Your text content here.\nUse \\n for line breaks.',
    alignment: 'center' // or 'left', 'right'
  }
}
```

#### Bullet Slide
```typescript
{
  type: 'bullets',
  content: {
    title: 'List Title',
    bullets: [
      'First point',
      'Second point',
      'Third point'
    ],
    numbered: false // true for numbered list
  }
}
```

#### Image Slide
```typescript
{
  type: 'image',
  content: {
    title: 'Optional Title',
    imageUrl: '/path/to/image.jpg',
    caption: 'Optional caption',
    size: 'large' // or 'full', 'medium', 'small'
  }
}
```

#### Split Slide
```typescript
{
  type: 'split',
  content: {
    title: 'Optional Title',
    left: {
      type: 'text',
      content: 'Left side content'
    },
    right: {
      type: 'bullets',
      content: ['Point 1', 'Point 2']
    }
  }
}
```

### 3. Update Week Page

Edit `/app/lessons/week-[week]/page.tsx` to import your presentations:

```typescript
import { week2Presentations } from '@/lib/presentations/week2';

// In getPresentationsForWeek function:
case '2':
  return week2Presentations;
```

## Example: Complete Presentation

```typescript
export const artTechniques: Presentation = {
  id: 'week2-techniques',
  title: 'Techniques Artistiques',
  description: 'Explorer différentes techniques de dessin',
  week: 2,
  slides: [
    {
      type: 'title',
      content: {
        title: 'Techniques de Dessin',
        subtitle: 'Semaine 2',
        date: 'Septembre 2024'
      }
    },
    {
      type: 'text',
      content: {
        heading: 'Objectif du Jour',
        text: 'Apprendre trois nouvelles techniques pour améliorer nos dessins.',
        alignment: 'center'
      }
    },
    {
      type: 'bullets',
      content: {
        title: 'Techniques à Explorer',
        bullets: [
          'Hachures pour les ombres',
          'Estompage pour les dégradés',
          'Pointillisme pour les textures'
        ]
      }
    },
    {
      type: 'split',
      content: {
        title: 'Matériel Nécessaire',
        left: {
          type: 'bullets',
          content: [
            'Crayons HB et 2B',
            'Gomme',
            'Estompe'
          ]
        },
        right: {
          type: 'text',
          content: 'Assurez-vous d\'avoir tout le matériel avant de commencer.'
        }
      }
    }
  ]
};
```

## Tips

1. **Unique IDs**: Always use unique presentation IDs (e.g., 'week2-intro', 'week2-colors')
2. **Teacher Notes**: Add notes to slides for reminders during presentation
3. **Images**: Place images in `/public/images/` and reference as `/images/filename.jpg`
4. **Testing**: Test presentations in fullscreen mode before class
5. **Navigation**: Use keyboard shortcuts (arrows, F for fullscreen, ESC to exit)

## Keyboard Shortcuts During Presentation

- **→ / Space**: Next slide
- **←**: Previous slide
- **F**: Toggle fullscreen
- **ESC**: Exit fullscreen or close presentation