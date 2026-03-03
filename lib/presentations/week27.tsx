import { Presentation } from './types';
import AnimationTitleSlide from '@/components/slides/AnimationTitleSlide';
import FrameConceptSlide from '@/components/slides/FrameConceptSlide';
import WalkCycleSlide from '@/components/slides/WalkCycleSlide';
import VideoLinkSlide from '@/components/slides/VideoLinkSlide';
import ThreeColumnSlide from '@/components/slides/ThreeColumnSlide';

export const animationFlipbook: Presentation = {
  id: 'week27-animation',
  title: 'Animation',
  description: 'Introduction to animation and flipbook project',
  week: 27,
  slides: [
    // Slide 1 — Title
    {
      type: 'custom',
      content: {
        component: AnimationTitleSlide,
        props: {},
      },
    },

    // Slide 2 — What Is Animation?
    {
      type: 'text',
      content: {
        heading: { fr: "C'est quoi l'animation ?", en: 'What Is Animation?' },
        text: {
          fr: "L'animation, c'est quand on fait plein de dessins qui se ressemblent presque, mais chacun est un tout petit peu différent.\n\nQuand on les montre très vite, nos yeux sont trompés et on voit du mouvement !",
          en: "Animation is when you make a bunch of drawings that are almost the same, but each one is a tiny bit different.\n\nWhen you show them really fast, your eyes are tricked into seeing movement!",
        },
        alignment: 'center',
      },
    },

    // Slide 3 — What's a Frame?
    {
      type: 'custom',
      content: {
        component: FrameConceptSlide,
        props: {
          title: { fr: "C'est quoi un frame ?", en: "What's a Frame?" },
          description: {
            fr: 'Un frame, c\'est un seul dessin dans une animation. Les films montrent 24 frames chaque seconde !',
            en: 'A frame is one single drawing in an animation. Movies show 24 frames every single second!',
          },
          frameCount: 5,
        },
      },
    },

    // Slide 4 — Stick Figure Walk Cycle
    {
      type: 'custom',
      content: {
        component: WalkCycleSlide,
        props: {
          title: { fr: 'Voyez par vous-mêmes !', en: 'See It In Action!' },
        },
      },
    },

    // Slide 5 — A Little History
    {
      type: 'text',
      content: {
        heading: { fr: 'Comment ça a commencé', en: 'How It Started' },
        text: {
          fr: "Il y a presque 100 ans, Walt Disney et son équipe ont créé l'un des tout premiers dessins animés avec du son.\n\n🎬 Il s'appelait Steamboat Willie et la star était Mickey Mouse.\n\n✏️ Chaque image était dessinée à la main — des milliers de dessins pour seulement quelques minutes !",
          en: "Almost 100 years ago, Walt Disney and his team made one of the very first cartoons with sound.\n\n🎬 It was called Steamboat Willie and it starred Mickey Mouse.\n\n✏️ Every single frame was drawn by hand — thousands of drawings for just a few minutes!",
        },
        alignment: 'left',
      },
    },

    // Slide 6 — Steamboat Willie Video
    {
      type: 'custom',
      content: {
        component: VideoLinkSlide,
        props: {
          title: { fr: 'Regardons : Steamboat Willie (1928)', en: "Let's Watch: Steamboat Willie (1928)" },
          description: {
            fr: 'Le tout premier dessin animé de Mickey Mouse !',
            en: 'The very first Mickey Mouse cartoon!',
          },
          url: 'https://youtu.be/I5pG1wbRKOg',
          embed: true,
          emoji: '🐭',
        },
      },
    },

    // Slide 7 — Andymation Video
    {
      type: 'custom',
      content: {
        component: VideoLinkSlide,
        props: {
          title: { fr: 'Regardons : Comment faire un flipbook', en: "Let's Watch: How to Make a Flipbook" },
          description: {
            fr: "Andy Bailey est un animateur professionnel qui crée d'incroyables flipbooks.",
            en: 'Andy Bailey is a professional animator who makes incredible flipbooks.',
          },
          url: 'https://youtu.be/Un-BdBSOGKY',
          emoji: '📖',
        },
      },
    },

    // Slide 8 — Live Demo
    {
      type: 'text',
      content: {
        heading: { fr: 'Démonstration en direct !', en: 'Live Demo!' },
        text: { fr: '👀 Regardez bien...', en: '👀 Watch closely...' },
        alignment: 'center',
      },
    },

    // Slide 9 — Your Flipbook Project (3 Steps)
    {
      type: 'custom',
      content: {
        component: ThreeColumnSlide,
        props: {
          title: { fr: 'Votre projet de flipbook', en: 'Your Flipbook Project' },
          columns: [
            { emoji: '📋', text: { fr: 'Storyboard\nPlanifiez votre animation comme une BD', en: 'Storyboard\nPlan your animation like a comic strip' } },
            { emoji: '✏️', text: { fr: 'Crayon\nDessinez chaque image au crayon', en: 'Pencil\nDraw each frame in pencil' } },
            { emoji: '🖍️', text: { fr: 'Feutres\nColoriez pour rendre le tout vif et coloré', en: 'Markers\nColor it in bold and bright' } },
          ],
        },
      },
    },

    // Slide 10 — Guidelines
    {
      type: 'bullets',
      content: {
        title: { fr: 'Consignes', en: 'Guidelines' },
        bullets: [
          {
            fr: '📏 Votre animation doit durer environ 5 secondes (20–30 dessins)',
            en: '📏 Your animation should be about 5 seconds long (20–30 drawings)',
          },
          {
            fr: '👌 Restez simple ! Une seule action principale',
            en: '👌 Keep it simple! One main action',
          },
          {
            fr: '💡 Idées : une balle qui rebondit, une fleur qui pousse, un poisson qui nage, une fusée qui décolle, un soleil qui se lève, une étoile qui explose',
            en: '💡 Ideas: a ball bouncing, a flower growing, a fish swimming, a rocket taking off, a sun rising, a star that bursts',
          },
        ],
      },
    },

    // Slide 11 — Start Brainstorming
    {
      type: 'text',
      content: {
        heading: { fr: 'Commencez à réfléchir !', en: 'Start Brainstorming!' },
        text: {
          fr: '🚀 Votre animation sera sur quel sujet ?\n\nPrenez votre crayon et commencez à dessiner vos idées !',
          en: '🚀 What will YOUR animation be about?\n\nGrab your pencil and start sketching ideas!',
        },
        alignment: 'center',
      },
    },
  ],
};

export const week27Presentations = [animationFlipbook];
