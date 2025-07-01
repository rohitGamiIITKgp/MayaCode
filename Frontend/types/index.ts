export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type IconName =
  | 'code'
  | 'globe'
  | 'mobile'
  | 'database'
  | 'gamepad'
  | 'server'
  | 'graduation-cap'
  | 'trophy'
  | 'star'
  | 'fire'
  | 'user'
  | 'bell'
  | 'lock'
  | 'question-circle'
  | 'info-circle'
  | 'chevron-right';

export interface Challenge {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  points: number;
}

export interface Stat {
  id: number;
  title: string;
  value: string;
  icon: IconName;
}

export interface Setting {
  id: number;
  title: string;
  icon: IconName;
}

export interface Category {
  id: number;
  title: string;
  icon: IconName;
  courses: number;
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  students: number;
  image: any;
} 