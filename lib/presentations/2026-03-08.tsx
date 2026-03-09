import { Presentation } from './types';
import VideoLinkSlide from '@/components/slides/VideoLinkSlide';

export const rubeGoldberg: Presentation = {
  id: '2026-03-08-rube-goldberg',
  title: 'Rube Goldberg Machines',
  description: 'Introduction to Rube Goldberg machines',
  week: 28,
  date: '2026-03-08',
  slides: [
    // Slide 1 — Title
    {
      type: 'title',
      content: {
        title: { fr: 'Les Machines de Rube Goldberg', en: 'Rube Goldberg Machines' },
      },
    },

    // Slide 2 — YouTube Video 1
    {
      type: 'custom',
      content: {
        component: VideoLinkSlide,
        props: {
          title: '',
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
          title: '',
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
          title: '',
          url: 'https://youtu.be/LwDdQ9xKu5s',
          embed: true,
          emoji: '🎨',
        },
      },
    },

    // Slide 7 — Fluffy McCloud's
    {
      type: 'image',
      content: {
        title: "Fluffy McCloud's - Echo Park",
        imageUrl: '/images/2026-03-08/fluffy-mccloud.jpg',
        size: 'large',
      },
    },

    // Slide 8 — Your Project
    {
      type: 'title',
      content: {
        title: { fr: 'Votre Projet', en: 'Your Project' },
        subtitle: { fr: 'Créer une machine Rube Goldberg', en: 'Create a Rube Goldberg machine' },
      },
    },
  ],
};

export const date20260308Presentations = [rubeGoldberg];
