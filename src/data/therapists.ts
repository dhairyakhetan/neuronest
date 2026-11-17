/**
 * Therapist Connect — prototype directory.
 * Every profile below is an ILLUSTRATIVE SAMPLE for demonstrating the product,
 * not a real practitioner. The UI labels them as such.
 */
import type { Tone } from './content';

export interface Specialty {
  id: string;
  label: string;
  short: string;
  tone: Tone;
  helpsWith: string;
}

export const SPECIALTIES: Specialty[] = [
  { id: 'speech', label: 'Speech and Language Therapy', short: 'Speech', tone: 'purple', helpsWith: 'Late talking, articulation, understanding language, social communication, AAC.' },
  { id: 'ot', label: 'Occupational Therapy', short: 'Occupational', tone: 'mint', helpsWith: 'Sensory processing, fine motor skills, handwriting, self-care and daily routines.' },
  { id: 'behaviour', label: 'Behaviour Therapy', short: 'Behaviour', tone: 'coral', helpsWith: 'Meltdowns, routines, positive behaviour support and parent coaching.' },
  { id: 'psych', label: 'Child Psychology', short: 'Psychology', tone: 'purple', helpsWith: 'Emotional regulation, anxiety, social skills and developmental assessment.' },
  { id: 'devpaed', label: 'Developmental Paediatrics', short: 'Dev. Paediatrics', tone: 'mint', helpsWith: 'Formal developmental evaluation, diagnosis and care planning.' },
  { id: 'physio', label: 'Paediatric Physiotherapy', short: 'Physio', tone: 'butter', helpsWith: 'Walking, balance, muscle tone, coordination and gross motor delays.' },
  { id: 'special-ed', label: 'Special Education', short: 'Special Ed', tone: 'coral', helpsWith: 'Learning support, school readiness, reading and individual education plans.' },
];

export const specialty = (id: string) => SPECIALTIES.find((s) => s.id === id)!;

export interface Therapist {
  id: string;
  name: string;
  credentials: string;
  specialties: string[];
  city: string;
  modes: ('Online' | 'In-person')[];
  languages: string[];
  years: number;
  fee: number;
  ages: string;
  focus: string[];
  bio: string;
  approach: string;
  weekdays: number[]; // 0 = Sunday
  times: string[];
}

export const THERAPISTS: Therapist[] = [
  {
    id: 't1', name: 'Dr. Ananya Rao', credentials: 'MASLP · Speech-Language Pathologist', specialties: ['speech'], city: 'Bengaluru',
    modes: ['Online', 'In-person'], languages: ['English', 'Kannada', 'Hindi'], years: 11, fee: 1200, ages: '1–10 years',
    focus: ['Late talkers', 'Autism', 'AAC'], weekdays: [1, 2, 4, 5], times: ['10:00', '11:30', '16:00'],
    bio: 'Works with toddlers and young children who are late to talk or find communication hard, using play-based, family-centred therapy.',
    approach: 'Coaches parents to turn everyday routines — bath time, meals, play — into communication practice between sessions.',
  },
  {
    id: 't2', name: 'Kabir Mehta', credentials: 'MOT · Occupational Therapist', specialties: ['ot'], city: 'Mumbai',
    modes: ['In-person'], languages: ['English', 'Hindi', 'Marathi'], years: 8, fee: 1500, ages: '2–12 years',
    focus: ['Sensory processing', 'Fine motor', 'Handwriting'], weekdays: [1, 3, 5, 6], times: ['09:30', '12:00', '17:00'],
    bio: 'Helps children build the sensory, motor and self-care skills they need to feel confident at home and school.',
    approach: 'Builds a personalised “sensory diet” with families and sets small, practical goals reviewed every month.',
  },
  {
    id: 't3', name: 'Dr. Farah Siddiqui', credentials: 'MD Paediatrics · Developmental Paediatrician', specialties: ['devpaed'], city: 'Hyderabad',
    modes: ['Online', 'In-person'], languages: ['English', 'Hindi', 'Telugu'], years: 15, fee: 2000, ages: '0–8 years',
    focus: ['Developmental evaluation', 'Autism', 'ADHD'], weekdays: [2, 4, 6], times: ['10:30', '14:00'],
    bio: 'Provides comprehensive developmental evaluations and coordinates care plans with therapists and schools.',
    approach: 'Reviews observations and screening results families bring, then explains findings in plain language with a clear plan.',
  },
  {
    id: 't4', name: 'Rohan Iyer', credentials: 'BCBA · Behaviour Therapist', specialties: ['behaviour'], city: 'Chennai',
    modes: ['Online', 'In-person'], languages: ['English', 'Tamil'], years: 7, fee: 1400, ages: '2–14 years',
    focus: ['Positive behaviour support', 'Routines', 'Parent coaching'], weekdays: [1, 2, 3, 4], times: ['11:00', '15:30', '18:00'],
    bio: 'Supports families with meltdowns, transitions and building new skills through compassionate, child-led strategies.',
    approach: 'Focuses on understanding what a behaviour communicates, then teaches alternatives that work for the whole family.',
  },
  {
    id: 't5', name: 'Dr. Meenakshi Pillai', credentials: 'PhD · Clinical Child Psychologist', specialties: ['psych'], city: 'Kochi',
    modes: ['Online'], languages: ['English', 'Malayalam', 'Tamil'], years: 12, fee: 1800, ages: '3–16 years',
    focus: ['Anxiety', 'Emotional regulation', 'Social skills'], weekdays: [1, 3, 4, 6], times: ['10:00', '13:00', '19:00'],
    bio: 'Helps children understand big feelings and build social confidence, and supports parents through the journey.',
    approach: 'Uses play, stories and visual tools to help children name and manage emotions, with regular parent check-ins.',
  },
  {
    id: 't6', name: 'Sneha Kulkarni', credentials: 'MPT (Paeds) · Paediatric Physiotherapist', specialties: ['physio'], city: 'Pune',
    modes: ['In-person'], languages: ['English', 'Marathi', 'Hindi'], years: 9, fee: 1100, ages: '0–10 years',
    focus: ['Gross motor delay', 'Low muscle tone', 'Balance'], weekdays: [1, 2, 3, 5], times: ['09:00', '11:00', '16:30'],
    bio: 'Supports babies and children with sitting, crawling, walking, balance and coordination.',
    approach: 'Turns exercises into games and gives families a simple home programme that fits into daily play.',
  },
  {
    id: 't7', name: 'Arjun Banerjee', credentials: 'MASLP · Speech-Language Pathologist', specialties: ['speech'], city: 'Kolkata',
    modes: ['Online', 'In-person'], languages: ['English', 'Bengali', 'Hindi'], years: 6, fee: 1000, ages: '2–12 years',
    focus: ['Articulation', 'Stammering', 'Language delay'], weekdays: [2, 3, 5, 6], times: ['10:30', '17:00', '18:30'],
    bio: 'Helps children speak clearly and confidently, with a special interest in fluency and sound development.',
    approach: 'Short, playful sessions with home practice cards so progress continues between visits.',
  },
  {
    id: 't8', name: 'Priyanka Sethi', credentials: 'M.Ed (Special Education)', specialties: ['special-ed'], city: 'Delhi',
    modes: ['Online', 'In-person'], languages: ['English', 'Hindi', 'Punjabi'], years: 10, fee: 900, ages: '4–14 years',
    focus: ['Learning differences', 'School readiness', 'Dyslexia support'], weekdays: [1, 2, 4, 5], times: ['15:00', '16:30', '18:00'],
    bio: 'Partners with families and schools to build individual learning plans that play to each child’s strengths.',
    approach: 'Multi-sensory teaching methods and close coordination with class teachers.',
  },
  {
    id: 't9', name: 'Dr. Vikram Shah', credentials: 'MD, DNB · Developmental Paediatrician', specialties: ['devpaed'], city: 'Ahmedabad',
    modes: ['In-person'], languages: ['English', 'Gujarati', 'Hindi'], years: 18, fee: 2200, ages: '0–12 years',
    focus: ['Early intervention', 'Developmental delay', 'Care planning'], weekdays: [1, 3, 5], times: ['10:00', '12:30'],
    bio: 'Leads early-intervention care, from first concerns through to coordinated therapy plans.',
    approach: 'Believes in acting early and keeping parents at the centre of every decision.',
  },
  {
    id: 't10', name: 'Lakshmi Narayanan', credentials: 'MOT · Occupational Therapist', specialties: ['ot', 'behaviour'], city: 'Chennai',
    modes: ['Online'], languages: ['English', 'Tamil', 'Telugu'], years: 5, fee: 1000, ages: '2–10 years',
    focus: ['Daily living skills', 'Sensory regulation', 'Play skills'], weekdays: [2, 4, 6], times: ['09:30', '14:30', '17:30'],
    bio: 'Online-first OT who coaches parents to support sensory regulation and independence at home.',
    approach: 'Video-guided home sessions — you practise with your child while she guides you in real time.',
  },
  {
    id: 't11', name: 'Dr. Imran Qureshi', credentials: 'M.Phil · Rehabilitation Psychologist', specialties: ['psych', 'special-ed'], city: 'Lucknow',
    modes: ['Online', 'In-person'], languages: ['English', 'Hindi', 'Arabic'], years: 13, fee: 1300, ages: '3–16 years',
    focus: ['ADHD', 'Attention', 'Learning assessment'], weekdays: [1, 2, 3, 6], times: ['11:00', '16:00'],
    bio: 'Supports children with attention and learning differences, and their families, with practical strategies.',
    approach: 'Combines structured assessment with home and classroom strategies that are realistic to follow.',
  },
  {
    id: 't12', name: 'Neha Joshi', credentials: 'MASLP · Speech-Language Pathologist', specialties: ['speech', 'ot'], city: 'Jaipur',
    modes: ['Online'], languages: ['English', 'Hindi', 'Gujarati'], years: 4, fee: 800, ages: '1–8 years',
    focus: ['Feeding', 'Early communication', 'Oral motor'], weekdays: [1, 3, 4, 5], times: ['10:00', '13:30', '17:00'],
    bio: 'Supports early communication and feeding challenges in babies and toddlers.',
    approach: 'Gentle, responsive therapy that follows the child’s lead and builds on what already works.',
  },
];

export const CITIES = Array.from(new Set(THERAPISTS.map((t) => t.city))).sort();
export const THERAPIST_LANGUAGES = Array.from(new Set(THERAPISTS.flatMap((t) => t.languages))).sort();

export interface Slot { date: string; time: string; ts: number }

/** Next available slots over the coming `days` days, computed from today. */
export function upcomingSlots(t: Therapist, days = 10): Slot[] {
  const out: Slot[] = [];
  const now = new Date();
  for (let d = 1; d <= days; d++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);
    if (!t.weekdays.includes(day.getDay())) continue;
    for (const time of t.times) {
      const [h, m] = time.split(':').map(Number);
      const ts = new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m).getTime();
      out.push({ date: day.toISOString().slice(0, 10), time, ts });
    }
  }
  return out;
}

export function formatSlot(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const day = sameDay(d, tomorrow) ? 'Tomorrow' : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  return `${day}, ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
}

export const formatFee = (n: number) => `₹${n.toLocaleString('en-IN')}`;
