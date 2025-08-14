// Bilingual text type - can be either a string (French only) or an object with both languages
export type BilingualText = string | { fr: string; en: string };

export interface Presentation {
  id: string;
  title: string;
  description: string;
  week: number;
  slides: Slide[];
}

export type SlideType = 'title' | 'text' | 'bullets' | 'image' | 'split' | 'custom';

export interface BaseSlide {
  type: SlideType;
  notes?: string;
}

export interface TitleSlide extends BaseSlide {
  type: 'title';
  content: {
    title: BilingualText;
    subtitle?: BilingualText;
    date?: BilingualText;
  };
}

export interface TextSlide extends BaseSlide {
  type: 'text';
  content: {
    heading?: BilingualText;
    text: BilingualText;
    alignment?: 'left' | 'center' | 'right';
  };
}

export interface BulletSlide extends BaseSlide {
  type: 'bullets';
  content: {
    title: BilingualText;
    bullets: BilingualText[];
    numbered?: boolean;
  };
}

export interface ImageSlide extends BaseSlide {
  type: 'image';
  content: {
    title?: BilingualText;
    imageUrl: string;
    caption?: BilingualText;
    size?: 'full' | 'large' | 'medium' | 'small';
  };
}

export interface SplitSlide extends BaseSlide {
  type: 'split';
  content: {
    title?: BilingualText;
    left: {
      type: 'text' | 'bullets' | 'image';
      content: any;
    };
    right: {
      type: 'text' | 'bullets' | 'image';
      content: any;
    };
  };
}

export interface CustomSlide extends BaseSlide {
  type: 'custom';
  content: {
    component: React.ComponentType<any>;
    props?: any;
  };
}

export type Slide = TitleSlide | TextSlide | BulletSlide | ImageSlide | SplitSlide | CustomSlide;

export interface WeekPresentations {
  week: number;
  presentations: Presentation[];
}