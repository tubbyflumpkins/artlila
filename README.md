# ArtLila - Elementary Art Class Companion

An interactive web application designed for elementary art classes (grades 1-5) to make sketch time more engaging and fun!

## Features

- 🎨 **Two Interactive Spinning Wheels**
  - Topic Wheel: 40+ drawing subjects (animals, vehicles, emotions, etc.)
  - Constraint Wheel: 30+ creative challenges (one line, shapes only, time limits, etc.)
  
- 🎮 **Gamified Experience**
  - Realistic Wheel of Fortune style mechanics
  - Click/touch to spin each wheel
  - Animated pointer with peg-hitting effects
  - Sound effects (ticking, drumroll, celebration)
  - Confetti celebration when both wheels stop
  
- 📱 **Touch-Friendly Design**
  - Optimized for smartboards and tablets
  - Large, colorful interface perfect for classroom visibility
  - Responsive design works on all devices

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/artlila.git
cd artlila
```

2. Install dependencies:
```bash
npm install
```

3. Add sound files (optional but recommended):
   - Add `tick.mp3`, `celebration.mp3`, and `drumroll.mp3` to `/public/sounds/`
   - See `/public/sounds/README.md` for free sound sources

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with one click!

## Usage in the Classroom

1. Display the website on your smartboard at the start of art class
2. Have a student come up and spin both wheels
3. The class gets 10-15 minutes to sketch based on the random combination
4. Examples:
   - Draw "Ocean Creatures" + "Use only circles"
   - Draw "Robots" + "Draw it melting"
   - Draw "Weather" + "Non-dominant hand"

## Customization

You can easily customize the wheels by editing `/lib/wheelData.ts`:
- Add or remove topics
- Add or remove constraints
- Change colors
- Modify emojis

## Technologies Used

- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Howler.js (sound effects)
- Canvas Confetti

## License

MIT License - feel free to use this in your classroom!

## Contributing

Feel free to submit issues and enhancement requests!