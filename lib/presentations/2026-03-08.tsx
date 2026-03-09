import { Presentation } from './types';
import VideoLinkSlide from '@/components/slides/VideoLinkSlide';

export const rubeGoldberg: Presentation = {
  id: '2026-03-08-rube-goldberg',
  title: 'Rube Goldberg Machines',
  description: 'Introduction to Rube Goldberg machines',
  week: 28,
  slides: [
    // Slide 1 — Title
    {
      type: 'title',
      content: {
        title: { fr: 'Les Machines de Rube Goldberg', en: 'Rube Goldberg Machines' },
        subtitle: { fr: 'Arts Plastiques', en: 'Art Class' },
        date: '8 mars 2026',
      },
    },

    // Slide 2 — YouTube Video 1
    {
      type: 'custom',
      content: {
        component: VideoLinkSlide,
        props: {
          title: { fr: 'Regardons !', en: "Let's Watch!" },
          url: 'https://youtu.be/qybUFnY7Y8w',
          embed: true,
          emoji: '⚙️',
        },
      },
    },

    // Slide 3 — YouTube Video 2
    {
      type: 'custom',
      content: {
        component: VideoLinkSlide,
        props: {
          title: { fr: 'Regardons !', en: "Let's Watch!" },
          url: 'https://youtu.be/2U0BmR6B8fI',
          embed: true,
          emoji: '🔧',
        },
      },
    },

    // Slide 4 — Definition
    {
      type: 'text',
      content: {
        heading: { fr: 'Machine de Rube Goldberg', en: 'Rube Goldberg Machine' },
        text: {
          fr: "Un dispositif intentionnellement surdimensionné, conçu pour accomplir une tâche simple de manière comiquement trop compliquée à travers une réaction en chaîne.",
          en: "An intentionally over-engineered contraption designed to perform a simple task in a comically, overly complicated way through a chain reaction.",
        },
        alignment: 'center',
      },
    },

    // Slide 5 — Machines as Art
    {
      type: 'title',
      content: {
        title: { fr: 'Les Machines comme ART', en: 'Machines as ART' },
      },
    },

    // Slide 6 — YouTube Video 3
    {
      type: 'custom',
      content: {
        component: VideoLinkSlide,
        props: {
          title: { fr: 'Regardons !', en: "Let's Watch!" },
          url: 'https://youtu.be/LwDdQ9xKu5s',
          embed: true,
          emoji: '🎨',
        },
      },
    },
  ],
};

export const date20260308Presentations = [rubeGoldberg];
