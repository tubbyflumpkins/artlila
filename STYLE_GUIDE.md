# ArtLila Style Guide

## Typography

### Font Families

#### Primary Font - Neue Haas Grotesk Display
- **Font:** Neue Haas Grotesk Display Pro
- **Usage:** All text including titles, headers, body text, subtitles, buttons, navigation, and all content
- **Weights Available:**
  - XXThin (100)
  - XThin (150)
  - Thin (200)
  - Light (300)
  - Roman/Regular (400)
  - Medium (500)
  - Bold (700)
  - Black (900)

### Type Scale

#### Headings (Neue Haas Grotesk)
- **H1:** 4rem (64px) - Main page titles - Font weight: Bold (700)
- **H2:** 3rem (48px) - Section headers - Font weight: Bold (700)
- **H3:** 2.25rem (36px) - Subsection headers - Font weight: Medium (500)
- **H4:** 1.875rem (30px) - Card headers - Font weight: Medium (500)

#### Body Text (Neue Haas Grotesk)
- **Large:** 1.25rem (20px) - Subtitles, important text
- **Regular:** 1rem (16px) - Body paragraphs
- **Small:** 0.875rem (14px) - Captions, metadata
- **XSmall:** 0.75rem (12px) - Labels, hints

### Font Weights
- **Titles:** Bold (700) for H1/H2, Medium (500) for H3/H4
- **Body Text:**
  - Light (300) - Large display text
  - Regular (400) - Standard body text
  - Medium (500) - Emphasis, buttons
  - Bold (700) - Strong emphasis, main headings

## Color Palette

### Grayscale (Primary Palette)
- **Gray-50:** `#F9FAFB` - Background
- **Gray-100:** `#F3F4F6` - Light backgrounds
- **Gray-200:** `#E5E7EB` - Borders
- **Gray-300:** `#D1D5DB` - Disabled borders
- **Gray-400:** `#9CA3AF` - Placeholder text
- **Gray-500:** `#6B7280` - Secondary text
- **Gray-600:** `#4B5563` - Body text
- **Gray-700:** `#374151` - Primary text
- **Gray-800:** `#1F2937` - Headers
- **Gray-900:** `#111827` - Black text

### Accent Colors (Minimal Use)
- **Blue-600:** `#2563EB` - Links, interactive elements (optional)
- **Red-500:** `#EF4444` - Errors, alerts (if needed)

## Layout Principles

### Spacing
- Base unit: 0.25rem (4px)
- Common spacings: 8px, 16px, 24px, 32px, 48px, 64px, 96px
- Consistent padding: 32px (desktop), 16px (mobile)

### Container Widths
- **Max width:** 1280px (max-w-7xl)
- **Content width:** 1024px (max-w-4xl)
- **Narrow content:** 768px (max-w-3xl)

### Border Radius
- **Small:** 0.375rem (6px) - Buttons
- **Medium:** 0.5rem (8px) - Cards
- **Large:** 0.75rem (12px) - Modals

## Component Styles

### Buttons
- **Font:** Neue Haas Grotesk Medium (500)
- **Size:** 1rem (16px)
- **Padding:** 12px 24px (standard), 16px 32px (large)
- **Border:** 2px solid gray-300
- **Hover:** Border changes to gray-400, subtle shadow

### Cards
- **Background:** White
- **Border:** 1px solid gray-200
- **Shadow:** None (default), shadow-lg (hover)
- **Padding:** 32px

### Navigation
- **Font:** Neue Haas Grotesk Regular
- **Size:** 1rem (16px)
- **Color:** Gray-600 (default), Gray-800 (hover)

## Animation Guidelines

### Transitions
- **Duration:** 200ms (fast), 300ms (normal), 500ms (slow)
- **Easing:** ease-in-out (default)
- **Properties:** Primarily transform, opacity, border-color

### Motion
- **Entrance:** Fade in with subtle scale (0.9 → 1)
- **Exit:** Fade out
- **Hover:** Subtle scale (1 → 1.05) or shadow increase

## Responsive Design

### Breakpoints
- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md-lg)
- **Desktop:** > 1024px (lg+)

### Typography Scaling
- Reduce heading sizes by 20% on mobile
- Maintain body text size across devices
- Increase touch targets on mobile (min 44px)

## Implementation Notes

### CSS Classes (Tailwind)

#### Title (Neue Haas)
```css
font-neue-haas text-6xl font-bold text-gray-800
```

#### Subtitle (Neue Haas)
```css
font-neue-haas text-xl font-light text-gray-600
```

#### Body Text
```css
font-neue-haas text-base text-gray-700
```

#### Button
```css
font-neue-haas font-medium text-gray-700 hover:text-gray-900
```

### Font Face Declarations
Fonts should be loaded using Next.js local font feature for optimal performance.