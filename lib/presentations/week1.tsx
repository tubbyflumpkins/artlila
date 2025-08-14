import { Presentation } from './types';
import BackgroundImageTitleSlide from '@/components/slides/BackgroundImageTitleSlide';
import BubbleSlide from '@/components/slides/BubbleSlide';
import ThreeColumnSlide from '@/components/slides/ThreeColumnSlide';
import SketchTimeSlide from '@/components/slides/SketchTimeSlide';

export const welcomeToArtClass: Presentation = {
  id: 'week1-welcome',
  title: 'Bienvenue en classe d\'art!',
  description: 'Introduction à la classe d\'art - Première semaine',
  week: 1,
  slides: [
    {
      type: 'custom',
      content: {
        component: BackgroundImageTitleSlide,
        props: {
          title: { fr: 'Bienvenue!', en: 'Welcome!' },
          subtitle: { fr: 'Arts Plastiques', en: 'Art Class' },
          backgroundImage: '/images/week_1/Blue III by Joan Miro.jpg'
        }
      }
    },
    {
      type: 'custom',
      content: {
        component: BubbleSlide,
        props: {
          title: { fr: 'Qui suis-je? 🎨', en: 'Who am I? 🎨' },
          bubbles: [
            { text: 'LILA 2017', emoji: '🎓', color: 'bg-purple-500', size: 'medium' },
            { text: { fr: 'Franco-Américain', en: 'French-American' }, emoji: '🇫🇷', color: 'bg-yellow-500', size: 'small' },
            { text: 'Designer', emoji: '✏️', color: 'bg-pink-500', size: 'medium' },
            { text: { fr: 'Peintre', en: 'Painter' }, emoji: '🖌️', color: 'bg-green-500', size: 'large' },
            { text: { fr: 'Anthropologue', en: 'Anthropologist' }, emoji: '📚', color: 'bg-orange-500', size: 'small' }
          ]
        }
      }
    },
    {
      type: 'image',
      content: {
        title: { fr: 'Moi au LILA, 2006', en: 'Me at LILA, 2006' },
        imageUrl: '/images/week_1/IMG_2755..jpeg',
        size: 'large'
      }
    },
    {
      type: 'custom',
      content: {
        component: ThreeColumnSlide,
        props: {
          title: { fr: 'Ce que nous ferons cette année', en: 'What we\'ll do this year' },
          columns: [
            { emoji: '👥', text: { fr: 'Projets collaboratifs', en: 'Collaborative projects' } },
            { emoji: '🎨', text: { fr: 'Large gamme de matériaux et de styles', en: 'Wide range of materials and styles' } },
            { emoji: '⭐', text: { fr: 'Artistes en vedette', en: 'Featured artists' } }
          ]
        }
      }
    },
    {
      type: 'custom',
      content: {
        component: SketchTimeSlide,
        props: {
          subtitle: { fr: 'Comment chaque classe commence:', en: 'How each class begins:' },
          title: { fr: 'Moment Dessin - Sketch Time!', en: 'Sketch Time!' }
        }
      }
    },
    {
      type: 'text',
      content: {
        heading: { fr: 'Essayez maintenant', en: 'Try it now' },
        text: { fr: 'Avant de commencer - écrivez votre nom sur les carnets de croquis\n\n🎨 Activité de croquis', en: 'Before we start - write your name on the sketchbooks\n\n🎨 Sketching activity' },
        alignment: 'center'
      }
    }
  ]
};

// Export all presentations for week 1
export const week1Presentations = [welcomeToArtClass];