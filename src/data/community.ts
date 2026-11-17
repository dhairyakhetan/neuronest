/**
 * Parent Community — prototype seed content.
 * Members and posts are ILLUSTRATIVE SAMPLES that show how the community works;
 * the UI labels them as such. Anything a visitor posts is stored only in their browser.
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

export interface Member {
  id: string;
  name: string;
  city: string;
  context: string;
  interests: string[];
  languages: string[];
  circles: string[];
  tone: Tone;
}

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Priya S.', city: 'Mumbai', context: 'Parent of a 3-year-old', interests: ['Speech journey', 'Play-based learning'], languages: ['English', 'Hindi', 'Marathi'], circles: ['c1', 'c2'], tone: 'purple' },
  { id: 'm2', name: 'Rahul D.', city: 'Bengaluru', context: 'Dad of a 6-year-old', interests: ['Transitions', 'Visual schedules'], languages: ['English', 'Kannada'], circles: ['c2', 'c6'], tone: 'mint' },
  { id: 'm3', name: 'Anjali K.', city: 'Pune', context: 'Parent of a 5-year-old', interests: ['Sensory-friendly home', 'OT at home'], languages: ['English', 'Marathi'], circles: ['c4'], tone: 'coral' },
  { id: 'm4', name: 'Meera V.', city: 'Hyderabad', context: 'Parent of an 8-year-old', interests: ['Inclusive schools', 'Advocacy'], languages: ['English', 'Telugu'], circles: ['c5', 'c3'], tone: 'butter' },
  { id: 'm5', name: 'Karan M.', city: 'Delhi', context: 'Dad of a 4-year-old', interests: ['Sensory', 'Haircuts & outings'], languages: ['English', 'Hindi', 'Punjabi'], circles: ['c4', 'c6'], tone: 'purple' },
  { id: 'm6', name: 'Fatima R.', city: 'Lucknow', context: 'Parent of a 7-year-old', interests: ['ADHD', 'Homework routines'], languages: ['English', 'Hindi'], circles: ['c3'], tone: 'mint' },
  { id: 'm7', name: 'Divya N.', city: 'Chennai', context: 'Parent of a 2-year-old', interests: ['Early intervention', 'New to the journey'], languages: ['English', 'Tamil'], circles: ['c7', 'c1'], tone: 'coral' },
  { id: 'm8', name: 'Sunil P.', city: 'Kochi', context: 'Grandparent and caregiver', interests: ['Caregiver wellbeing', 'Storytelling'], languages: ['English', 'Malayalam'], circles: ['c8'], tone: 'butter' },
  { id: 'm9', name: 'Neelam G.', city: 'Jaipur', context: 'Parent of twins, 3 years', interests: ['Feeding', 'Sleep routines'], languages: ['Hindi', 'English'], circles: ['c8', 'c4'], tone: 'purple' },
];

export interface Circle {
  id: string;
  name: string;
  desc: string;
  members: number;
  tone: Tone;
}

export const CIRCLES: Circle[] = [
  { id: 'c1', name: 'Late Talkers and Speech Journeys', desc: 'For families supporting speech and language — share strategies, small wins and therapy tips.', members: 1240, tone: 'purple' },
  { id: 'c2', name: 'Autism Parents India', desc: 'A warm space for parents of autistic children across India.', members: 2310, tone: 'mint' },
  { id: 'c3', name: 'ADHD Family Hub', desc: 'Routines, focus strategies, school conversations and lots of encouragement.', members: 980, tone: 'coral' },
  { id: 'c4', name: 'Sensory-Friendly Living', desc: 'Calm corners, outings, clothing, food and everything sensory.', members: 1530, tone: 'butter' },
  { id: 'c5', name: 'Inclusive Schools Network', desc: 'Navigating admissions, support plans and working with teachers.', members: 760, tone: 'purple' },
  { id: 'c6', name: 'Dads in the Nest', desc: 'A circle for fathers to share, ask and support each other.', members: 420, tone: 'mint' },
  { id: 'c7', name: 'New to the Journey', desc: 'Just noticed a delay or got a new evaluation? Start here — no question is too small.', members: 1890, tone: 'coral' },
  { id: 'c8', name: 'हिंदी में बात करें · Hindi Speakers', desc: 'Share and support each other in Hindi.', members: 640, tone: 'butter' },
];

export interface Comment {
  id: string;
  authorId: string; // member id or 'me'
  authorName: string;
  text: string;
  ts: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorContext: string;
  anonymous?: boolean;
  topic: Topic;
  circleId?: string;
  text: string;
  ts: number;
  likes: number;
  comments: Comment[];
  sample?: boolean;
}

const H = 3600_000;

/** Seed posts get fresh-looking timestamps relative to the visitor's first load. */
export function seedPosts(now = Date.now()): Post[] {
  return [
    {
      id: 'p1', authorId: 'm1', authorName: 'Priya S.', authorContext: 'Parent of a 3-year-old · Mumbai', topic: 'Wins and Milestones', circleId: 'c1', ts: now - 2 * H, likes: 48, sample: true,
      text: "Aarav said “more juice” at breakfast today — his first two-word phrase! Eight months of speech therapy and a LOT of patience. To anyone in the early days: the small steps really do add up.",
      comments: [
        { id: 'p1c1', authorId: 'm7', authorName: 'Divya N.', text: 'This made my morning. We are just starting therapy and needed to hear this.', ts: now - 1.5 * H },
        { id: 'p1c2', authorId: 'm5', authorName: 'Karan M.', text: 'Huge! Celebrate it properly 🎉', ts: now - H },
      ],
    },
    {
      id: 'p2', authorId: 'm2', authorName: 'Rahul D.', authorContext: 'Dad of a 6-year-old · Bengaluru', topic: 'Questions', circleId: 'c6', ts: now - 5 * H, likes: 21, sample: true,
      text: 'How do you prepare your child for a new school year? Ours finds transitions really hard. Visual schedules work at home, but school is a different story. Any ideas for the first week?',
      comments: [
        { id: 'p2c1', authorId: 'm4', authorName: 'Meera V.', text: 'We asked for photos of the new classroom and teacher a week early and made a little “first day” picture story. It helped a lot.', ts: now - 4 * H },
      ],
    },
    {
      id: 'p3', authorId: 'm3', authorName: 'Anjali K.', authorContext: 'Parent of a 5-year-old · Pune', topic: 'Sensory and Routines', circleId: 'c4', ts: now - 9 * H, likes: 63, sample: true,
      text: 'Our calm-down corner: a small tent, noise-cancelling headphones, a soft blanket and a few fidgets. It took a few weeks, but now my daughter goes there on her own when things feel too loud. Happy to share what we tried first.',
      comments: [],
    },
    {
      id: 'p4', authorId: 'anon', authorName: 'Anonymous parent', authorContext: 'Member', anonymous: true, topic: 'Self-Care', ts: now - 20 * H, likes: 87, sample: true,
      text: 'Some days I feel like I am failing at everything — work, therapy homework, being patient. Does it get easier? Just needed to say it somewhere safe.',
      comments: [
        { id: 'p4c1', authorId: 'm8', authorName: 'Sunil P.', text: 'You are not failing. You are carrying a lot. It does get lighter, especially once you find your people. We are here.', ts: now - 19 * H },
        { id: 'p4c2', authorId: 'm6', authorName: 'Fatima R.', text: 'Felt this so much last year. Taking one evening a week for myself changed everything. Be kind to yourself.', ts: now - 18 * H },
      ],
    },
    {
      id: 'p5', authorId: 'm4', authorName: 'Meera V.', authorContext: 'Parent of an 8-year-old · Hyderabad', topic: 'School and Inclusion', circleId: 'c5', ts: now - 30 * H, likes: 39, sample: true,
      text: 'Our support plan was approved at school today — extra time for written work, a quiet space when needed, and a weekly check-in with the class teacher. Happy to share what we asked for and how we framed it.',
      comments: [],
    },
    {
      id: 'p6', authorId: 'm5', authorName: 'Karan M.', authorContext: 'Dad of a 4-year-old · Delhi', topic: 'Tips and Strategies', circleId: 'c4', ts: now - 46 * H, likes: 54, sample: true,
      text: 'Haircuts used to be impossible. What finally worked: a barber who lets us visit first, practising with buzzing clippers at home, and a favourite video on the phone. Three meltdown-free haircuts in a row!',
      comments: [
        { id: 'p6c1', authorId: 'm9', authorName: 'Neelam G.', text: 'Saving this. Haircut day is our hardest day of the month.', ts: now - 40 * H },
      ],
    },
    {
      id: 'p7', authorId: 'm7', authorName: 'Divya N.', authorContext: 'Parent of a 2-year-old · Chennai', topic: 'Questions', circleId: 'c7', ts: now - 70 * H, likes: 17, sample: true,
      text: 'Our paediatrician suggested a developmental evaluation for our son. I am nervous. What should I expect, and what should I bring?',
      comments: [
        { id: 'p7c1', authorId: 'm1', authorName: 'Priya S.', text: 'Bring notes or videos of things you have noticed at home — it really helped our doctor. And write your questions down beforehand!', ts: now - 68 * H },
      ],
    },
  ];
}

export const GUIDELINES = [
  'Be kind — everyone here is doing their best.',
  'Share experiences, not medical advice.',
  "Protect your child's privacy: no full names, schools or photos.",
  'Respect every family’s choices and language preferences.',
  'Report anything that feels unsafe — moderators review every report.',
];
