/**
 * Development Check content.
 * Milestone items are paraphrased from the CDC's public-domain
 * "Learn the Signs. Act Early." developmental milestone checklists (2022 revision).
 * Each item is something most children (about 3 in 4) can do by that age —
 * so a "not yet" is a reason to talk to a professional, not a diagnosis.
 */
import { Brain, Footprints, HeartHandshake, MessageCircle, type LucideIcon } from 'lucide-react';
import type { Tone } from './content';

export type DomainId = 'social' | 'language' | 'cognitive' | 'movement';
export type Answer = 'yes' | 'sometimes' | 'no';
export type Gender = 'girl' | 'boy' | 'unspecified';

export interface Domain {
  id: DomainId;
  title: string;
  short: string;
  icon: LucideIcon;
  tone: Tone;
  specialists: string[]; // therapist specialty ids
  specialistLabel: string;
  activityCategory: string;
  tip: string;
}

export const DOMAINS: Domain[] = [
  {
    id: 'social', title: 'Social and Emotional', short: 'Social', icon: HeartHandshake, tone: 'coral',
    specialists: ['devpaed', 'psych', 'behaviour'], specialistLabel: 'a developmental paediatrician or child psychologist',
    activityCategory: 'Social Interaction',
    tip: 'Turn-taking games, naming feelings out loud, and short playdates help build social confidence.',
  },
  {
    id: 'language', title: 'Language and Communication', short: 'Language', icon: MessageCircle, tone: 'purple',
    specialists: ['speech'], specialistLabel: 'a speech-language therapist',
    activityCategory: 'Communication',
    tip: 'Narrate everyday moments, read together daily, and pause to give your child time to respond.',
  },
  {
    id: 'cognitive', title: 'Learning and Thinking', short: 'Learning', icon: Brain, tone: 'mint',
    specialists: ['devpaed', 'special-ed'], specialistLabel: 'a developmental paediatrician or special educator',
    activityCategory: 'Attention and Focus',
    tip: 'Simple puzzles, sorting games and pretend play build problem-solving and attention.',
  },
  {
    id: 'movement', title: 'Movement and Physical', short: 'Movement', icon: Footprints, tone: 'butter',
    specialists: ['ot', 'physio'], specialistLabel: 'an occupational therapist or paediatric physiotherapist',
    activityCategory: 'Motor Development',
    tip: 'Daily active play — climbing, throwing, drawing and building — strengthens big and small movements.',
  },
];

export interface Band {
  months: number;
  label: string;
  items: Record<DomainId, string[]>;
}

export const BANDS: Band[] = [
  {
    months: 6, label: '6 months',
    items: {
      social: ['Recognises familiar people', 'Likes looking at their reflection in a mirror', 'Laughs'],
      language: ['Takes turns making sounds with you', 'Blows “raspberries” (sticks tongue out and blows)', 'Makes squealing noises'],
      cognitive: ['Puts things in their mouth to explore them', 'Reaches to grab a toy they want', 'Closes lips to show they don’t want more food'],
      movement: ['Rolls from tummy to back', 'Pushes up with straight arms when on tummy', 'Leans on hands for support when sitting'],
    },
  },
  {
    months: 9, label: '9 months',
    items: {
      social: ['Is shy, clingy or fearful around strangers', 'Shows several facial expressions (happy, sad, angry, surprised)', 'Looks when you call their name', 'Reacts when you leave (looks, reaches for you, or cries)', 'Smiles or laughs during peek-a-boo'],
      language: ['Makes different sounds like “mamamama” and “babababa”', 'Lifts arms up to be picked up'],
      cognitive: ['Looks for objects when they drop out of sight', 'Bangs two things together'],
      movement: ['Gets into a sitting position without help', 'Moves things from one hand to the other', 'Uses fingers to “rake” food towards themself', 'Sits without support'],
    },
  },
  {
    months: 12, label: '12 months',
    items: {
      social: ['Plays games with you, like pat-a-cake'],
      language: ['Waves “bye-bye”', 'Calls a parent “mama”, “dada” or another special name', 'Understands “no” (pauses or stops when you say it)'],
      cognitive: ['Puts something in a container, like a block in a cup', 'Looks for things they saw you hide, like a toy under a blanket'],
      movement: ['Pulls up to stand', 'Walks while holding on to furniture', 'Drinks from an open cup that you hold', 'Picks up small things between thumb and pointer finger'],
    },
  },
  {
    months: 15, label: '15 months',
    items: {
      social: ['Copies other children while playing', 'Shows you an object they like', 'Claps when excited', 'Hugs a stuffed toy or doll', 'Shows you affection (hugs, cuddles or kisses)'],
      language: ['Tries to say one or two words besides “mama” or “dada”', 'Looks at a familiar object when you name it', 'Follows directions given with a gesture and words', 'Points to ask for something or to get help'],
      cognitive: ['Tries to use things the right way, like a phone, cup or book', 'Stacks at least two small objects, like blocks'],
      movement: ['Takes a few steps on their own', 'Uses fingers to feed themself some food'],
    },
  },
  {
    months: 18, label: '18 months',
    items: {
      social: ['Moves away from you but looks back to make sure you’re close', 'Points to show you something interesting', 'Puts hands out for you to wash them', 'Looks at a few pages in a book with you', 'Helps with dressing by pushing an arm through a sleeve'],
      language: ['Tries to say three or more words besides “mama” or “dada”', 'Follows one-step directions without gestures, like “Give it to me”'],
      cognitive: ['Copies you doing chores, like sweeping', 'Plays with toys in a simple way, like pushing a toy car'],
      movement: ['Walks without holding on', 'Scribbles', 'Drinks from an open cup (some spills are fine)', 'Tries to use a spoon', 'Climbs on and off a couch or chair without help'],
    },
  },
  {
    months: 24, label: '2 years',
    items: {
      social: ['Notices when others are hurt or upset', 'Looks at your face to see how to react in a new situation'],
      language: ['Points to things in a book when you ask', 'Says at least two words together, like “more milk”', 'Points to at least two body parts when asked', 'Uses gestures beyond waving and pointing, like blowing a kiss or nodding'],
      cognitive: ['Holds something in one hand while using the other', 'Tries to use switches, knobs or buttons on a toy', 'Plays with more than one toy at the same time'],
      movement: ['Kicks a ball', 'Runs', 'Walks up a few stairs (with or without help)', 'Eats with a spoon'],
    },
  },
  {
    months: 30, label: '2½ years',
    items: {
      social: ['Plays next to other children and sometimes with them', 'Shows you what they can do, saying “Look at me!”', 'Follows simple routines, like helping tidy up when asked'],
      language: ['Says about 50 words', 'Says two or more words together, including an action word, like “doggie run”', 'Names things in a book when you point and ask', 'Uses words like “I”, “me” or “we”'],
      cognitive: ['Uses things to pretend, like feeding a block to a doll', 'Shows simple problem-solving, like standing on a stool to reach something', 'Follows two-step instructions, like “Put the toy down and close the door”', 'Knows at least one colour, like pointing to a red crayon when asked'],
      movement: ['Twists things with their hands, like doorknobs or lids', 'Takes some clothes off without help', 'Jumps off the ground with both feet', 'Turns book pages one at a time'],
    },
  },
  {
    months: 36, label: '3 years',
    items: {
      social: ['Calms down within 10 minutes after you leave (like at drop-off)', 'Notices other children and joins them to play'],
      language: ['Has a back-and-forth conversation of at least two exchanges', 'Asks “who”, “what”, “where” or “why” questions', 'Says what action is happening in a picture or book', 'Says their first name when asked', 'Talks well enough for others to understand most of the time'],
      cognitive: ['Draws a circle after you show how', 'Avoids touching hot objects when you warn them'],
      movement: ['Strings items together, like large beads', 'Puts on some clothes without help', 'Uses a fork'],
    },
  },
  {
    months: 48, label: '4 years',
    items: {
      social: ['Pretends to be something else during play (a teacher, superhero, dog)', 'Asks to go play with other children', 'Comforts others who are hurt or sad', 'Avoids danger, like not jumping from tall heights', 'Likes to be a “helper”', 'Changes behaviour based on where they are (library vs playground)'],
      language: ['Says sentences with four or more words', 'Says some words from a song, story or rhyme', 'Talks about at least one thing that happened during their day', 'Answers simple questions like “What is a coat for?”'],
      cognitive: ['Names a few colours of items', 'Tells what comes next in a well-known story', 'Draws a person with three or more body parts'],
      movement: ['Catches a large ball most of the time', 'Serves food or pours water with supervision', 'Unbuttons some buttons', 'Holds a crayon between fingers and thumb (not a fist)'],
    },
  },
  {
    months: 60, label: '5 years',
    items: {
      social: ['Follows rules and takes turns when playing with other children', 'Sings, dances or acts for you', 'Does simple chores at home, like matching socks'],
      language: ['Tells a story with at least two events', 'Answers simple questions about a story after you read it', 'Keeps a conversation going for more than three exchanges', 'Uses or recognises simple rhymes (bat–cat, ball–tall)'],
      cognitive: ['Counts to 10', 'Names some numbers between 1 and 5 when you point to them', 'Uses time words like “yesterday”, “tomorrow”, “morning” or “night”', 'Pays attention for 5–10 minutes during activities', 'Writes some letters of their name', 'Names some letters when you point to them'],
      movement: ['Buttons some buttons', 'Hops on one foot'],
    },
  },
];

export interface Concern {
  id: string;
  label: string;
  domain: DomainId | null;
  special?: 'regression' | 'hearing';
}

export const CONCERNS: Concern[] = [
  { id: 'speech', label: 'Speech and talking', domain: 'language' },
  { id: 'understanding', label: 'Understanding words or instructions', domain: 'language' },
  { id: 'social', label: 'Social interaction or eye contact', domain: 'social' },
  { id: 'emotions', label: 'Emotions, meltdowns or behaviour', domain: 'social' },
  { id: 'attention', label: 'Attention and focus', domain: 'cognitive' },
  { id: 'learning', label: 'Learning and play', domain: 'cognitive' },
  { id: 'gross', label: 'Walking, balance or coordination', domain: 'movement' },
  { id: 'fine', label: 'Using hands (grasping, drawing)', domain: 'movement' },
  { id: 'sensory', label: 'Sensory sensitivities', domain: null },
  { id: 'sleep', label: 'Sleep', domain: null },
  { id: 'eating', label: 'Eating or feeding', domain: null },
  { id: 'hearing', label: 'Hearing or vision', domain: null, special: 'hearing' },
  { id: 'regression', label: 'Lost skills they used to have', domain: null, special: 'regression' },
];

/** Pick the most recent checkpoint the child has already passed. */
export function bandFor(months: number): Band | null {
  if (months < 6) return null;
  let pick = BANDS[0]!;
  for (const b of BANDS) if (months >= b.months) pick = b;
  return pick;
}

export function ageLabel(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m === 1 ? '' : 's'}`;
  return `${y} year${y === 1 ? '' : 's'}${m ? ` ${m} month${m === 1 ? '' : 's'}` : ''}`;
}

export function pronouns(g: Gender) {
  if (g === 'girl') return { they: 'she', them: 'her', their: 'her', does: 'does' };
  if (g === 'boy') return { they: 'he', them: 'him', their: 'his', does: 'does' };
  return { they: 'they', them: 'them', their: 'their', does: 'do' };
}

export type DomainStatus = 'onpar' | 'watch' | 'flag';

export interface DomainResult {
  id: DomainId;
  status: DomainStatus;
  score: number; // 0–100, share of milestones present (sometimes = half)
  yes: number;
  sometimes: number;
  no: number;
  missing: string[];
  emerging: string[];
  concerned: boolean;
}

export interface CheckRecord {
  id: string;
  createdAt: number;
  child: { name: string; gender: Gender; months: number; correctedMonths: number; preterm: boolean };
  concerns: string[];
  otherConcern: string;
  band: number;
  answers: Record<string, Answer>;
  results: DomainResult[];
  overall: 'onpar' | 'watch' | 'flag' | 'urgent';
}

export const answerKey = (d: DomainId, i: number) => `${d}:${i}`;

export function evaluate(band: Band, answers: Record<string, Answer>, concerns: string[]) {
  const concernedDomains = new Set(CONCERNS.filter((c) => concerns.includes(c.id) && c.domain).map((c) => c.domain));
  const results: DomainResult[] = DOMAINS.map((d) => {
    const items = band.items[d.id];
    let yes = 0, sometimes = 0, no = 0;
    const missing: string[] = [];
    const emerging: string[] = [];
    items.forEach((label, i) => {
      const a = answers[answerKey(d.id, i)];
      if (a === 'yes') yes++;
      else if (a === 'sometimes') { sometimes++; emerging.push(label); }
      else { no++; missing.push(label); }
    });
    const score = Math.round(((yes + sometimes * 0.5) / items.length) * 100);
    const status: DomainStatus = no > 0 ? 'flag' : sometimes > 0 ? 'watch' : 'onpar';
    return { id: d.id, status, score, yes, sometimes, no, missing, emerging, concerned: concernedDomains.has(d.id) };
  });
  const overall: CheckRecord['overall'] = concerns.includes('regression')
    ? 'urgent'
    : results.some((r) => r.status === 'flag')
      ? 'flag'
      : results.some((r) => r.status === 'watch' || r.concerned)
        ? 'watch'
        : 'onpar';
  return { results, overall };
}

export function nextBand(months: number) {
  return BANDS.find((b) => b.months > months) ?? null;
}
