/**
 * Parent Community — static vocabulary.
 * Members, circles, posts and comments live in Supabase (see src/lib/community.ts).
 */
import type { Tone } from './content';

export const TOPICS = ['Wins and Milestones', 'Questions', 'Tips and Strategies', 'Sensory and Routines', 'School and Inclusion', 'Self-Care'] as const;
export type Topic = (typeof TOPICS)[number];

export const TOPIC_TONE: Record<Topic, Tone> = {
  'Wins and Milestones': 'mint',
  Questions: 'purple',
  'Tips and Strategies': 'coral',
  'Sensory and Routines': 'butter',
  'School and Inclusion': 'purple',
  'Self-Care': 'coral',
};

export const GUIDELINES = [
  'Be kind — everyone here is doing their best.',
  'Share experiences, not medical advice.',
  "Protect your child's privacy: no full names, schools or photos.",
  'Respect every family’s choices and language preferences.',
  'Report anything that feels unsafe — moderators review every report.',
];

export const REPORT_REASONS = [
  'Unkind or disrespectful',
  'Shares a child’s private information',
  'Medical misinformation',
  'Spam or advertising',
  'Something else',
];

export const COMMUNITY_TAGS = [
  'Speech journey', 'Autism', 'ADHD', 'Sensory', 'Early intervention', 'New to the journey', 'School and inclusion',
  'Feeding', 'Sleep', 'Dad', 'Grandparent', 'Therapy at home', 'Visual schedules', 'Self-care',
];
