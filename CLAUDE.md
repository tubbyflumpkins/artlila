# ArtLila - Claude Code Development Notes

## IMPORTANT: Presentation Creation
**When creating presentations, ALWAYS reference `/PRESENTATIONS.md` for complete guidelines including:**
- Design principles and visual style
- Slide types and when to use them  
- Technical implementation details
- File structure and codebase organization
- Step-by-step creation instructions
- Common patterns and best practices

## Project Overview
ArtLila is an elementary art class companion website featuring:
- A minimalist home page with real-time clock
- Interactive spinning wheels for drawing challenges (Moment Dessin)
- Organized lesson content by week (36 weeks total)
Designed for 1st-5th grade students and displayed on smartboards during art class.

## Tech Stack
- Next.js 14 with App Router and TypeScript
- Tailwind CSS v3 (downgraded from v4 for stability)
- Framer Motion for wheel spinning animations
- Howler.js for sound effects (implemented but needs audio files)
- Canvas Confetti for celebration animations
- File-based content management system

## Current Features

### Navigation Structure
- **Home Page (`/`)**: Minimalist design with centered clock showing HH:MM:SS, navigation buttons
- **Game Page (`/game`)**: Spinning wheel drawing game (Moment Dessin)
- **Lessons Page (`/lessons`)**: Grid of 36 weeks for academic year
- **Week Pages (`/lessons/week-[1-36]`)**: Individual lesson content pages

### Core Functionality (Spinning Wheel Game)
- Two spinning wheels: Topics (what to draw) and Constraints (how to draw)
- SVG-based wheel rendering with radial emoji orientation
- Winner selection aligned to top position (270°)
- Celebration animations with confetti when both wheels complete
- Sound integration setup (missing audio files)

### French Localization
- Complete French translation
- Real-time date/time display: "On est mardi 6 août 2025, il est 2:32:45 PM"
- Updates every second with French locale formatting
- 12-hour time format with bolded date/time portions

### Content Management
- Edit button in bottom right corner
- Modal popup for editing wheel content
- File-based storage in `/WheelContents/` directory
- Comma-separated format: `Text Description, Emoji`
- API endpoints for reading/writing wheel data
- Backward compatibility with pipe separator

### UI/UX Design
- **Home Page**: Minimalist grayscale design, clean typography, subtle animations
- **Game Page**: Colorful gradient background (purple-pink-blue), glass-morphism effects
- **Lessons Pages**: Clean white/gray design, organized grid layout
- Wheel results displayed below each wheel (no popups)
- Responsive design for various screen sizes
- Static red triangle pointing down as wheel indicator

## File Structure
```
/app/
  page.tsx                  # Home page with clock and navigation
  layout.tsx                # French metadata with custom fonts
  /game/
    page.tsx                # Spinning wheel game (moved from root)
  /lessons/
    page.tsx                # Lessons grid (36 weeks)
    /week-[week]/
      page.tsx              # Week page with presentation list
      /[presentationId]/
        page.tsx            # Presentation viewer page
  /api/wheel-data/
    route.ts                # GET/POST endpoints for wheel data
/components/
  SpinningWheel.tsx         # Core wheel component
  EditButton.tsx            # Edit functionality with modal
  PresentationViewer.tsx    # Main presentation display component
  PresentationList.tsx      # Lists presentations for a week
  /slides/                  # Slide type components
    TitleSlide.tsx
    TextSlide.tsx
    BulletSlide.tsx
    ImageSlide.tsx
    SplitSlide.tsx
    CustomSlide.tsx
/WheelContents/
  topics.txt                # Drawing topics in French
  constraints.txt           # Drawing constraints in French
  README.md                 # Content format documentation
/lib/
  wheelData.ts              # Color schemes
  sounds.ts                 # Audio integration setup
  loadWheelData.ts          # File parsing with comma/pipe compatibility
  /presentations/
    types.ts                # TypeScript interfaces for presentations
    week1.tsx               # Week 1 presentations
    README.md               # Presentation system docs
/public/fonts/              # Custom fonts (SOAP and Neue Haas Grotesk)
```

## Development History

### Initial Setup
- Created Next.js project with TypeScript
- Implemented basic spinning wheel mechanics
- Added Framer Motion animations

### Arrow/Peg Design Challenges
- Multiple failed attempts at animated arrow/peg design
- User feedback: "not even close", "still pointing up"
- Settled on simple static red triangle pointing down

### Winner Selection Fix
- Fixed misaligned winner calculation
- Changed from rightmost to topmost position selection
- Corrected angle calculation to target 270° (top)

### Content System Evolution
- Started with pipe separator (`|`)
- Switched to comma separator (`,`) per user preference
- Maintained backward compatibility
- Added comprehensive edit functionality

### Localization & UI Polish
- Translated all content to French
- Added real-time clock display
- Improved modal positioning to prevent cut-off
- Enhanced visual design with glass effects

### Navigation Restructure
- Created minimalist home page with centered clock (HH:MM:SS format)
- Moved spinning wheel game from root to `/game` route
- Added lessons section with 36-week grid organization
- Implemented individual week pages for lesson content
- Maintained consistent design language across sections

### Presentation System (Latest Update)
- Built comprehensive presentation framework for lessons
- Created 7+ slide types: BackgroundImageTitle, Text, Bullets, Image, BubbleSlide, ThreeColumnSlide, SketchTimeSlide, Custom
- Implemented PresentationViewer with fullscreen support
- **150% scaling in fullscreen mode** while maintaining exact layout (no reflow)
- Added keyboard navigation (arrows, spacebar, F for fullscreen)
- Created Week 1 presentation with custom interactive slides
- Integrated presentations into week pages with list view
- Fixed z-index issues with controls overlay (z-50 for controls)
- Removed A/B/C testing system, keeping only the final modified version

## Known Issues & TODOs

### Missing Features
1. **Sound Effects** - Howler.js integrated but missing audio files:
   - Tick sound during spinning
   - Drumroll buildup effect  
   - Celebration sound on completion
   - Need to add actual audio files to `/public/sounds/`

### Potential Improvements
1. Add more diverse topics and constraints
2. Consider animation improvements for wheel spinning
3. Mobile optimization testing
4. Accessibility features (keyboard navigation, screen reader support)
5. Add export/print functionality for presentations
6. Implement presenter mode with notes visible only to teacher
7. Add timer functionality for timed activities
8. Support for embedded videos in presentations
9. Create presentation templates for common lesson types

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
git checkout staging # Switch to staging branch
git checkout main    # Switch to main branch
```

## Deployment
- Configured for Vercel deployment
- Repository: https://github.com/tubbyflumpkins/artlila
- Staging branch for development, main branch for production

## User Feedback Patterns
- Strong preference for simplicity over complex animations
- Visual alignment critical for user trust in random selection
- French localization important for classroom use
- Edit functionality essential for teacher customization

## Technical Implementation Details

### Wheel Mechanics
- Segments calculated dynamically based on content length
- Winner selection uses modulo math: `Math.floor(topAngle / segmentAngle) % segments.length`
- Rotation normalization: `(270 - normalizedRotation + 360) % 360`
- SVG text positioning with radial orientation using transform-origin

### State Management
```typescript
const [selectedTopic, setSelectedTopic] = useState<WheelSegment | null>(null);
const [isSpinningTopic, setIsSpinningTopic] = useState(false);
const [wheelData, setWheelData] = useState<{ topics: WheelSegment[], constraints: WheelSegment[] }>();
const [currentDateTime, setCurrentDateTime] = useState(new Date());
```

### Content Format Evolution
- **Original:** `Text|Emoji` (pipe separator)
- **Current:** `Text Description, Emoji` (comma separator)  
- **Parser:** Handles both formats automatically for backward compatibility
- **Encoding:** UTF-8 with proper French character support

### Git Workflow
- `main` branch: Production-ready code
- `staging` branch: Development and testing
- Commit pattern: Descriptive messages with Claude Code attribution
- All major features merged staging → main before push

## Error Resolution History

### Tailwind CSS v4 Issues
- **Problem:** Incompatibility with Next.js setup
- **Solution:** Downgraded to Tailwind CSS v3
- **Files affected:** `package.json`, `tailwind.config.js`

### Hydration Errors
- **Problem:** Server/client SVG coordinate mismatch
- **Solution:** Rounded all SVG coordinates to prevent floating-point differences
- **Files affected:** `SpinningWheel.tsx`

### Modal Cut-off Issues  
- **Problem:** Edit modal extending beyond viewport on mobile
- **Solution:** Changed from absolute positioning to responsive inset classes
- **Fix:** `className="fixed inset-4 lg:inset-12 ..."`

### Winner Selection Misalignment
- **Problem:** Visual winner didn't match selected item
- **Solution:** Corrected angle calculation to target top position (270°)
- **Critical fix:** Ensures user trust in randomization fairness

## Content Guidelines

### Topics (40 items)
- Age-appropriate subjects for elementary students
- Mix of familiar (pets, food) and imaginative (dragons, aliens)
- Covers various categories: animals, fantasy, objects, places
- French translations maintain kid-friendly language

### Constraints (31 items)
- Artistic challenges that enhance creativity
- Physical constraints (non-dominant hand, eyes closed)
- Style constraints (only circles, continuous line)
- Time/size constraints (30 seconds, thumb-sized, huge)
- Emotional/character constraints (happy, angry, dancing)

## Performance Considerations
- Wheel data loaded once on mount, cached in state
- Timer updates limited to 1-second intervals
- Confetti particles limited to 100 for performance
- SVG rendering optimized with minimal DOM updates
- File I/O only on content editing, not during normal use

## Browser Compatibility
- Modern browsers with ES6+ support
- SVG support required for wheel rendering
- Touch events for mobile/tablet interaction
- CSS Grid and Flexbox for responsive layout

## Security Notes
- File system access limited to designated `/WheelContents/` directory
- Input validation on content editing (basic sanitization)
- No external API calls during normal operation
- Static file serving only for wheel content

## Next Priority: Sound Implementation
The sound system is wired up but needs actual audio files. Current setup expects:
- `/public/sounds/tick.mp3` - Wheel spinning sound
- `/public/sounds/drumroll.mp3` - Build-up effect  
- `/public/sounds/celebration.mp3` - Winner celebration

### Sound Integration Status
- Howler.js library installed and configured
- Audio initialization in `useEffect` hook
- Event triggers properly placed in wheel completion logic
- Missing only the actual audio files

## Presentation System Usage

### Adding New Presentations
1. Create or edit week file in `/lib/presentations/weekX.tsx`
2. Define presentation with unique ID, title, description
3. Add slides using available types (title, text, bullets, image, split, custom)
4. Export presentations array for the week
5. Update week page to import new presentations

### Presentation Controls
- **Navigation:** Arrow keys, spacebar, click areas
- **Fullscreen:** F key or button (ESC to exit)
- **Teacher Notes:** Visible in normal mode, hidden in fullscreen
- **Progress:** Visual bar and slide counter

### Example Presentation Structure
```typescript
{
  id: 'week1-intro',
  title: 'Introduction à l\'Art',
  description: 'First lesson on art basics',
  week: 1,
  slides: [/* slide objects */]
}
```

## Future Enhancement Ideas
- **Accessibility:** ARIA labels, keyboard navigation, high contrast mode
- **Analytics:** Track most popular topics/constraints (privacy-conscious)
- **Customization:** Teacher profiles with saved content sets
- **Animation:** Subtle particle effects during wheel spin
- **Mobile:** PWA support for offline classroom use
- **Multilingual:** Easy language switching for different classrooms
- **Presentation Features:** Animation effects, embedded media, interactive elements