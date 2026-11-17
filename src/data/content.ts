import {
  Activity, Bell, BookOpen, Brain, CalendarDays, ClipboardCheck, Compass, FolderOpen, Globe, GraduationCap,
  HeartHandshake, Library, MessagesSquare, Mic, NotebookPen, Puzzle, Share2, Sparkles, Stethoscope, Target,
  TrendingUp, Trophy, UserRound, Users, Video, type LucideIcon,
} from 'lucide-react';

export const TAGLINE = 'Every Mind Matters. Every Milestone Counts.';
export const EMAIL = 'neuronest_official@gmail.com';
export const INSTAGRAM = '@neuronest__official';
export const DISCLAIMER =
  'NeuroNest provides supportive observations, personalised guidance, and tools for organising progress. It does not provide medical diagnoses or replace qualified professionals.';

export type Tone = 'purple' | 'mint' | 'coral' | 'butter';

export const TONE: Record<Tone, { bg: string; icon: string; solid: string; text: string }> = {
  purple: { bg: 'bg-lav', icon: 'text-purple', solid: 'bg-purple', text: 'text-purple-dark dark:text-purple-light' },
  mint: { bg: 'bg-mintsoft', icon: 'text-mint', solid: 'bg-mint', text: 'text-mint-dark dark:text-mint-light' },
  coral: { bg: 'bg-peach', icon: 'text-coral', solid: 'bg-coral', text: 'text-coral-dark dark:text-coral' },
  butter: { bg: 'bg-butter', icon: 'text-amber-500', solid: 'bg-amber-400', text: 'text-amber-700 dark:text-amber-300' },
};

/* ------------------------------------------------------------------ features */

export interface Feature {
  title: string;
  short: string;
  detail: string;
  icon: LucideIcon;
  tone: Tone;
  to?: string;
  isNew?: boolean;
}

export interface FeatureCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  tone: Tone;
  summary: string;
  features: Feature[];
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'guidance',
    name: 'Guidance',
    icon: Compass,
    tone: 'purple',
    summary: 'AI Care Companion, Learning Plans, Daily Routines, Smart Reminders',
    features: [
      { title: 'AI Care Companion', icon: Sparkles, tone: 'purple', to: '/companion', short: 'A companion that helps you plan, organise, and discover relevant tools', detail: 'The NeuroNest Companion offers guidance across daily routines, learning, and resources — an interactive product experience you can explore throughout this site.' },
      { title: 'AI Learning Plans', icon: Brain, tone: 'mint', to: '/dashboard/learning', short: 'Personalised learning plans adapted to interests and routines', detail: 'Learning plans suggest activities across communication, focus, and routines, adapting as you explore and save activities.' },
      { title: 'Daily Routine Planner', icon: CalendarDays, tone: 'coral', to: '/dashboard/today', short: 'Organise activities and routines for the day in a calm, simple view', detail: "Today's Plan lets you add, reorder, time, and complete activities across categories like Guidance, Learning, Routine, and Speech." },
      { title: 'Smart Reminders', icon: Bell, tone: 'purple', short: 'Gentle reminders to help keep routines and activities on track', detail: 'Reminders help you view and organise upcoming activities and important tasks without feeling pressured.' },
    ],
  },
  {
    id: 'track',
    name: 'Track',
    icon: Target,
    tone: 'mint',
    summary: 'Milestone Intelligence, Development Check, Behaviour Tracking, Progress, Child Profile',
    features: [
      { title: 'Milestone Intelligence', icon: Target, tone: 'mint', to: '/dashboard/milestones', short: 'Record and organise observations and milestones in one place', detail: 'Milestone Intelligence helps you capture meaningful moments with categories, dates, and notes — organised for conversations with qualified professionals.' },
      { title: 'Development Check', icon: ClipboardCheck, tone: 'coral', to: '/development-check', isNew: true, short: 'An age-based milestone check that flags possible delays early', detail: 'Answer simple questions about what your child does today across social, language, learning and movement skills. NeuroNest flags areas worth discussing with a professional and recommends next steps and the right specialists. It screens — it does not diagnose.' },
      { title: 'Behaviour Tracking', icon: Activity, tone: 'purple', to: '/dashboard/milestones', short: 'Track routines and behaviours over time, gently', detail: 'Observations can be filtered by category — Communication, Learning, Routine, Social Interaction, Motor Skills, Sleep, Food Preferences, and more.' },
      { title: 'Progress', icon: TrendingUp, tone: 'mint', to: '/dashboard/progress', short: 'See genuine activity history and recorded observations', detail: 'Progress shows only information you genuinely enter — recorded observations, completed activities, and routine history. No fake charts or predictions.' },
      { title: 'Child Profile', icon: UserRound, tone: 'coral', to: '/dashboard/profile', short: 'A profile that adapts as you explore activities and routines', detail: 'Your profile holds your role, preferred language, and experience preference — no sensitive medical or developmental information required.' },
    ],
  },
  {
    id: 'learn',
    name: 'Learn',
    icon: BookOpen,
    tone: 'coral',
    summary: 'Adaptive Activities, Speech Coach, Activity Library, Rewards & Streaks',
    features: [
      { title: 'Adaptive Activities', icon: Puzzle, tone: 'coral', to: '/dashboard/learning', short: 'Practical activities across communication, focus, and routines', detail: 'Browse activities by category, open instructions, save for later, and mark as completed — without comparisons or fake completion percentages.' },
      { title: 'Speech Coach', icon: Mic, tone: 'purple', to: '/dashboard/speech', short: 'Guided speech-practice activities with visual instructions', detail: 'The Speech Coach offers guided practice activities. Voice-based practice is a future product capability — this prototype shows the experience without clinical assessment.' },
      { title: 'Rewards & Streaks', icon: Trophy, tone: 'butter', to: '/dashboard/rewards', isNew: true, short: 'Earn Nest Stars, badges and streaks for daily activities and lessons', detail: 'Every completed plan item, learning activity and speech lesson earns Nest Stars. Keep a daily streak, level up from Hatchling to Sky Guardian, unlock badges, and set real-world reward goals together — celebrating effort, never comparing children.' },
      { title: 'Activity Library', icon: Library, tone: 'mint', to: '/dashboard/learning', short: 'A growing library of activities you can save and organise', detail: 'Save activities to your library and mark them as completed. Your library is yours — no fake data, no comparisons between children.' },
    ],
  },
  {
    id: 'connect',
    name: 'Connect',
    icon: Users,
    tone: 'purple',
    summary: 'Therapist Connect, Parent Community, Therapy Companion, Shared Care Circle',
    features: [
      { title: 'Therapist Connect', icon: Stethoscope, tone: 'purple', to: '/therapists', isNew: true, short: 'Find specialists, request consultations, and share progress with consent', detail: 'Browse speech, occupational, behaviour and other child-development specialists by language, city and session type. Request a consultation and choose exactly what to share — consent comes first, every time.' },
      { title: 'Parent Community', icon: MessagesSquare, tone: 'coral', to: '/community', isNew: true, short: 'Connect with parents who understand the journey', detail: 'Share wins, ask questions, join circles of parents walking a similar path, and build connections — a moderated, inclusive space to belong.' },
      { title: 'Therapy Companion', icon: NotebookPen, tone: 'mint', short: 'Tools to help organise and reflect on therapy sessions', detail: 'A future companion designed to help families prepare for and reflect on sessions with qualified professionals.' },
      { title: 'Shared Care Circle', icon: Share2, tone: 'purple', to: '/dashboard/care-network', short: 'Explore sharing preferences for a connected support circle', detail: 'The Shared Care Circle is a future capability for coordinating support among parents, caregivers, teachers, and therapists.' },
    ],
  },
  {
    id: 'support',
    name: 'Support',
    icon: HeartHandshake,
    tone: 'butter',
    summary: 'Multilingual, Resource Hub, AI Video Observation',
    features: [
      { title: 'Multilingual', icon: Globe, tone: 'coral', short: 'Designed to support families across languages', detail: 'NeuroNest is being designed with multilingual support in mind, so more families can access guidance in their preferred language.' },
      { title: 'Resource Hub', icon: FolderOpen, tone: 'purple', to: '/resources', short: 'Guides, activities, and support topics for families', detail: 'The Resource Library Preview covers Daily Routines, Learning Activities, Communication and Speech, Caregiver Support, Inclusive Education, and more.' },
      { title: 'AI Video Observation', icon: Video, tone: 'mint', short: 'Organise video observations for informed conversations', detail: 'Video observations are designed to help users organise observations and support informed conversations with qualified professionals. They do not provide medical diagnoses.' },
    ],
  },
];

/* ------------------------------------------------------------- ecosystem */

export const ECOSYSTEM: { title: string; desc: string; icon: LucideIcon; tone: Tone; to: string }[] = [
  { title: 'AI Care Companion', desc: 'A companion that helps plan, organise, and discover', icon: Sparkles, tone: 'mint', to: '/companion' },
  { title: 'Progress', desc: 'See genuine activity history and recorded observations', icon: TrendingUp, tone: 'mint', to: '/features' },
  { title: 'Multilingual', desc: 'Designed to support families across languages', icon: Globe, tone: 'coral', to: '/features' },
  { title: 'Parent Community', desc: 'Meet parents who understand the journey — share, ask, and belong', icon: Users, tone: 'purple', to: '/community' },
  { title: 'Development Check', desc: 'Flag possible delays early with age-based milestone checks', icon: ClipboardCheck, tone: 'mint', to: '/development-check' },
  { title: 'Learning Activities', desc: 'Adaptive activities across communication, focus, and routines', icon: BookOpen, tone: 'coral', to: '/features' },
  { title: 'Speech Coach', desc: 'Guided speech-practice activities for everyday moments', icon: Mic, tone: 'purple', to: '/features' },
  { title: 'Milestones', desc: 'Organise observations and milestones in one calm space', icon: Target, tone: 'mint', to: '/features' },
  { title: 'Inclusive Education', desc: 'Tools to support inclusive education and collaboration', icon: GraduationCap, tone: 'coral', to: '/features' },
  { title: 'Therapist Connect', desc: 'Find specialists and share progress with consent', icon: Stethoscope, tone: 'purple', to: '/therapists' },
];

/* -------------------------------------------------------------- journey */

export const JOURNEY = [
  { title: 'Create Your Account', short: 'Choose how you plan to use NeuroNest', detail: 'Sign up as a Parent or Caregiver, Teacher or Educator, Therapist or Specialist, or School or Organisation. You can explore NeuroNest and personalise your experience without entering sensitive information during sign-up.' },
  { title: 'Personalise Your Experience', short: 'Select the tools and support areas to explore', detail: 'Choose your interests — Daily Guidance, Learning Activities, Routine Planning, Milestone Tracking, Development Check, Speech Support, Therapist Connect, Parent Community, Resources, and Multilingual Support. You can update these preferences at any time.' },
  { title: 'Explore Guidance and Activities', short: 'Use the companion, activities, routines, and resources', detail: 'Open the NeuroNest Companion for guidance, browse the learning activity library, plan your day, and discover resources — all connected in one ecosystem.' },
  { title: 'Organise Observations and Progress', short: 'Record observations and run a Development Check', detail: 'Add observations with categories and dates, run an age-based Development Check that flags areas worth a closer look, complete activities, and review your genuine progress over time. Checks and observations support conversations with qualified professionals — they do not provide a diagnosis.' },
  { title: 'Build Your Support Ecosystem', short: 'Connect with therapists and other parents', detail: 'Find specialists through Therapist Connect and share progress with consent, meet families on similar journeys in the Parent Community, and explore future collaboration with educators and support services.' },
];

/* ------------------------------------------------------------------ faqs */

export const FAQS: { q: string; a: string }[] = [
  { q: 'What is NeuroNest?', a: 'NeuroNest is an AI-powered support ecosystem designed to help neurodiverse children and their families access personalised guidance, support everyday learning and routines, organise observations and milestones, discover practical resources, and connect with relevant care and education professionals.' },
  { q: 'Who is NeuroNest designed for?', a: 'NeuroNest is designed for parents and caregivers, teachers and educators, therapists and specialists, and schools or organisations seeking personalised support, learning tools, progress organisation, and care connections for neurodiverse children and families.' },
  { q: 'Does NeuroNest diagnose autism, ADHD, dyslexia, speech delays, or other conditions?', a: 'No. NeuroNest provides supportive guidance and tools. The Development Check is a screening checklist — it flags areas that may be worth discussing with a qualified professional, but it does not provide medical diagnoses or replace professional assessment.' },
  { q: 'How does the Development Check flag delays?', a: "You answer age-based questions about what your child does today across four areas: social and emotional, language and communication, learning and thinking, and movement. Items are adapted from the CDC's public “Learn the Signs. Act Early.” milestone checklists. When a milestone isn't there yet, NeuroNest flags that area, explains what it means, and suggests next steps and the kind of specialist to talk to." },
  { q: 'Does NeuroNest replace therapists or other professionals?', a: 'No. NeuroNest is designed to complement and support conversations with qualified professionals — not to replace therapists, doctors, educators, or other specialists.' },
  { q: 'How can I connect with a therapist?', a: 'Use Therapist Connect to browse child-development specialists by specialty, language, city and session type, then request a consultation and choose exactly what you share. In this prototype, therapist profiles are illustrative samples and requests are stored only in your browser.' },
  { q: 'What is the Parent Community?', a: 'A members-only space where parents and caregivers share wins, ask questions (anonymously if they prefer), join circles built around shared experiences, and connect with each other. Posts are only visible to signed-in members, and any post can be reported for moderators to review. Creating an account is free.' },
  { q: 'How do rewards work?', a: 'Completing daily plan items, learning activities, speech lessons, observations and Development Checks earns Nest Stars. Stars build daily streaks, unlock badges and level up your nest. Parents can set real-world reward goals (like a park trip) and redeem stars when they are reached. Rewards celebrate effort — there are no leaderboards or comparisons between children.' },
  { q: 'How does the NeuroNest Companion work?', a: 'The NeuroNest Companion is an interactive product experience of the AI Care Companion. It offers guidance across daily routines, learning, and resources. The full companion is currently under development — this website demonstrates how it could work.' },
  { q: 'What is Milestone Intelligence?', a: 'Milestone Intelligence helps families record and organise observations and milestones in one place, with categories, dates, and notes. Observations can help organise information and support conversations with qualified professionals. They do not provide a diagnosis.' },
  { q: 'What can be organised through NeuroNest?', a: 'Through NeuroNest you can organise daily activities and routines, observations and milestones, Development Check results, learning activities, speech-practice activities, resources, therapist requests, and community connections.' },
  { q: 'Does NeuroNest use AI video observation?', a: 'Yes, AI Video Observation is a planned feature. Video observations are designed to help users organise observations and support informed conversations with qualified professionals. They do not provide medical diagnoses.' },
  { q: 'Is the AI assistant available as a full product?', a: 'Not yet. The NeuroNest Companion is currently an interactive product demonstration. The full companion is under development.' },
  { q: 'Will NeuroNest support multiple languages?', a: 'Yes. NeuroNest is being designed with multilingual support in mind, so more families can access guidance in their preferred language.' },
  { q: 'Is NeuroNest currently available?', a: 'NeuroNest is a startup venture currently under development. This website demonstrates the product vision and interactive previews of future capabilities.' },
  { q: 'How much will NeuroNest cost?', a: 'Pricing is to be announced. NeuroNest is developing accessible ways to bring its tools together. You can join the early-interest list on the Pricing page to stay informed.' },
  { q: 'How is personal information handled?', a: 'Your account and community activity (profile, posts, comments, circles and connections) are stored securely with NeuroNest and protected so members only see what they should — anonymous posts never reveal who wrote them. Plans, observations, Development Check results and rewards stay only in your browser. Never share your child’s full name, school or photos. You can delete your account and all your community content at any time from Dashboard → Privacy.' },
  { q: 'How can I contact the NeuroNest team?', a: `You can reach the NeuroNest team by email at ${EMAIL} or on Instagram at ${INSTAGRAM}. You can also use the contact form on the Contact page.` },
];

/* ------------------------------------------------------------- resources */

export const RESOURCE_CATEGORIES = ['Daily Routines', 'Learning Activities', 'Communication and Speech', 'Caregiver Support', 'Inclusive Education', 'Understanding Neurodiversity', 'Professional Support'];

export const RESOURCES = [
  { id: 'r1', category: 'Daily Routines', title: 'Building Gentle Morning Routines', desc: 'Practical ideas for creating calm, predictable morning routines that work for your family', mins: 4 },
  { id: 'r2', category: 'Daily Routines', title: 'Transition Strategies for Everyday Moments', desc: 'Simple transition techniques to help move between activities with less stress', mins: 5 },
  { id: 'r3', category: 'Learning Activities', title: 'Sensory-Friendly Activity Ideas', desc: 'A collection of adaptable activities that engage different senses and learning styles', mins: 6 },
  { id: 'r4', category: 'Learning Activities', title: 'Attention and Focus Activities', desc: 'Activities designed to gently support attention and focus through play', mins: 5 },
  { id: 'r5', category: 'Communication and Speech', title: 'Encouraging Communication at Home', desc: 'Everyday strategies to support communication in natural family moments', mins: 4 },
  { id: 'r6', category: 'Communication and Speech', title: 'Speech Practice Through Play', desc: 'Playful speech-practice ideas that fit into daily routines', mins: 5 },
  { id: 'r7', category: 'Caregiver Support', title: 'Self-Care for Caregivers', desc: 'Gentle reminders and practices for caregiver wellbeing', mins: 4 },
  { id: 'r8', category: 'Caregiver Support', title: 'Finding Support Networks', desc: 'How to identify and build a support network that works for your family', mins: 5 },
  { id: 'r9', category: 'Inclusive Education', title: 'Inclusive Classroom Strategies', desc: 'Approaches for creating inclusive learning environments', mins: 6 },
  { id: 'r10', category: 'Inclusive Education', title: 'Supporting Diverse Learners', desc: 'Tools and mindsets for supporting diverse learning needs in group settings', mins: 5 },
  { id: 'r11', category: 'Understanding Neurodiversity', title: 'Understanding Neurodiversity', desc: 'A welcoming introduction to neurodiversity and what it means for families', mins: 7 },
  { id: 'r12', category: 'Understanding Neurodiversity', title: 'Language Around Neurodiversity', desc: 'Inclusive language tips for everyday conversations', mins: 4 },
  { id: 'r13', category: 'Professional Support', title: 'Working with Therapists', desc: 'How to prepare for and make the most of sessions with qualified professionals', mins: 5 },
  { id: 'r14', category: 'Professional Support', title: 'Questions to Ask Professionals', desc: 'A helpful list of questions to guide conversations with specialists', mins: 4 },
];

/* ------------------------------------------------------------ activities */

export const ACTIVITY_CATEGORIES = ['Communication', 'Attention and Focus', 'Everyday Routines', 'Motor Development', 'Social Interaction', 'Creative Learning'];

export const ACTIVITIES = [
  { id: 'a1', title: 'Story Conversation Cards', category: 'Communication', duration: '10 min', instructions: 'Pick a card with a simple scene. Take turns describing what you see and asking each other questions about the story. Keep it relaxed — there are no wrong answers.' },
  { id: 'a2', title: 'Feelings Charades', category: 'Communication', duration: '8 min', instructions: 'Act out an emotion without words while the other guesses. Start with happy, sad, surprised, and curious. Talk about when you each feel that way.' },
  { id: 'a3', title: 'Focus Timer Treasure Hunt', category: 'Attention and Focus', duration: '5 min', instructions: 'Set a 3-minute timer. Find and collect 5 small objects of a chosen color before the timer ends. Celebrate the effort, not just the result.' },
  { id: 'a4', title: 'Pattern Building Blocks', category: 'Attention and Focus', duration: '10 min', instructions: 'Build a simple color pattern with blocks. Take turns adding to it. Talk about what comes next and why.' },
  { id: 'a5', title: 'Morning Checklist Maker', category: 'Everyday Routines', duration: '12 min', instructions: 'Together, draw 4 morning steps on paper. Put them in order. Try following them tomorrow morning and adjust what feels right.' },
  { id: 'a6', title: 'Calm Down Jar', category: 'Everyday Routines', duration: '15 min', instructions: 'Fill a clear bottle with water, glitter, and a drop of food coloring. Shake it and watch it settle together. Talk about how feelings settle too.' },
  { id: 'a7', title: 'Bean Bag Toss', category: 'Motor Development', duration: '10 min', instructions: 'Set up 3 targets at different distances. Take turns tossing bean bags. Count how many land in each target.' },
  { id: 'a8', title: 'Balance Walk Line', category: 'Motor Development', duration: '8 min', instructions: 'Place a string on the floor. Walk along it slowly, then try backward, then with arms out. Take turns and encourage each other.' },
  { id: 'a9', title: 'Turn-Taking Game', category: 'Social Interaction', duration: '15 min', instructions: 'Play a simple board or card game. Focus on taking turns, waiting, and saying "good turn" to each other.' },
  { id: 'a10', title: 'Kindness Bingo', category: 'Social Interaction', duration: 'Ongoing', instructions: 'Make a 3x3 grid of kind actions (smile, help, share, listen). Cross one off each time you do it this week.' },
  { id: 'a11', title: 'Color Mixing Art', category: 'Creative Learning', duration: '15 min', instructions: 'Mix two paint colors and name the new color. Paint something that color reminds you of. There are no wrong names.' },
  { id: 'a12', title: 'Sound Story', category: 'Creative Learning', duration: '12 min', instructions: 'Pick 3 objects that make different sounds. Create a short story using those sounds as the soundtrack.' },
];

export const SPEECH = [
  { id: 's1', title: 'Slow Sound Stretch', color: '#6C63D9', steps: ['Pick a long vowel sound (like "aaaa" or "oooo").', 'Take a deep breath together.', 'Make the sound slowly for 5 seconds.', 'Repeat 3 times, trying to keep it steady.'] },
  { id: 's2', title: 'Mirror Mouth', color: '#4FC29A', steps: ['Sit facing each other.', 'One person makes a simple mouth shape (smile, open, round lips).', 'The other copies it like a mirror.', 'Swap roles after 5 turns.'] },
  { id: 's3', title: 'Rhyme Pairs', color: '#FF8A72', steps: ['Say a simple word (like "cat").', 'Take turns saying words that rhyme with it.', 'Aim for 3 rhymes each.', 'Celebrate every try — silly rhymes count!'] },
  { id: 's4', title: 'Story Sentence Build', color: '#6C63D9', steps: ['Start with "Once upon a time…".', 'Each person adds one sentence to the story.', 'Take 4 turns each.', 'Read the whole story back together.'] },
];

export const OBSERVATION_CATEGORIES = ['Communication', 'Learning', 'Routine', 'Social Interaction', 'Motor Skills', 'Sleep', 'Food Preferences', 'Emotions and Behaviour', 'Sensory', 'Other'];
export const PLAN_CATEGORIES = ['Guidance', 'Learning', 'Routine', 'Speech'];

/* ------------------------------------------------------------- companion */

export const COMPANION_GREETING =
  "Hi! I'm the NeuroNest Companion — an interactive product demonstration. I can show you how guidance, activities, and support tools could work together. How can I help you explore today?";
export const COMPANION_FALLBACK =
  'The full NeuroNest Companion is currently under development. Explore the website’s features and resources to learn more.';

export const COMPANION_PROMPTS: { label: string; reply: string; to: string; cta: string; keywords: RegExp }[] = [
  { label: "Plan Today's Activities", to: '/dashboard/today', cta: "Open Today's Plan", keywords: /plan|today|routine|schedule|day/i, reply: "I can help you think through a gentle daily plan. Head to Today's Plan in your dashboard — you can add activities, set times, and organise them by category like Guidance, Learning, Routine, or Speech." },
  { label: 'Check Development', to: '/development-check', cta: 'Start a Development Check', keywords: /delay|milestone check|development|screen|test|diagnos|on track|behind|flag/i, reply: "The Development Check walks you through age-based milestones across social, language, learning and movement skills. It flags areas worth discussing with a professional and suggests next steps. It screens — it doesn't diagnose." },
  { label: 'Find a Therapist', to: '/therapists', cta: 'Browse therapists', keywords: /therap|speech therap|occupational|doctor|specialist|expert|psycholog|paediatric|pediatric/i, reply: 'Therapist Connect lets you browse speech, occupational, behaviour and other child-development specialists by language, city and session type. You can request a consultation and choose exactly what to share.' },
  { label: 'Meet Other Parents', to: '/community', cta: 'Visit the community', keywords: /parent|community|friend|connect|other famil|alone|group|circle/i, reply: "You're not alone. The Parent Community is a safe space to share wins, ask questions, and join circles of parents on similar journeys." },
  { label: 'See My Rewards', to: '/dashboard/rewards', cta: 'Open Rewards', keywords: /reward|star|badge|streak|point|level/i, reply: 'Every completed activity and lesson earns Nest Stars. Build a daily streak, unlock badges, and set reward goals your child can work towards — like a trip to the park.' },
  { label: 'Track an Observation', to: '/dashboard/milestones', cta: 'Open Milestones', keywords: /observ|track|record|note/i, reply: 'Observations are a wonderful way to capture meaningful moments. In the Milestones area you can record what you noticed, add a category, date, and optional note. These help organise information for conversations with qualified professionals.' },
  { label: 'Explore Learning Activities', to: '/dashboard/learning', cta: 'Explore activities', keywords: /activit|learn|game|play/i, reply: 'The Learning Activities library offers practical, adaptive activities across Communication, Attention and Focus, Everyday Routines, Motor Development, Social Interaction, and Creative Learning. You can save and mark activities as completed.' },
  { label: 'Understand a Feature', to: '/features', cta: 'See all features', keywords: /feature|what can|how does/i, reply: 'NeuroNest organises features into five categories: Guidance, Track, Learn, Connect, and Support. Each has interactive previews — explore the Features page to see them in action.' },
  { label: 'Find Support Resources', to: '/resources', cta: 'Open resources', keywords: /resource|guide|read|article/i, reply: 'The Resource Library Preview covers Daily Routines, Learning Activities, Communication and Speech, Caregiver Support, Inclusive Education, Understanding Neurodiversity, and Professional Support. You can search and filter by category.' },
];

export const COMPANION_DEMOS = [
  { label: 'Daily Guidance', icon: Compass, desc: 'Get a gentle plan for the day with suggested activities and routines', reply: 'Good morning! Here are a few activities you might explore today: a 10-minute communication game, a calming routine check-in, and a speech-practice activity. Would you like to add any to your plan?' },
  { label: 'Learning Plans', icon: Brain, desc: 'Personalised learning plans adapted to interests and routines', reply: 'Based on your interests, here’s a suggested learning path: start with a communication activity, then try a focus exercise, and finish with a creative learning task. You can save any activity to your library.' },
  { label: 'Routine Support', icon: CalendarDays, desc: 'Organise activities and routines for the day', reply: 'Your day has 3 activities planned: Morning routine at 8:00, Learning activity at 10:30, and Speech practice at 4:00. You can reorder, edit, or mark them as complete anytime.' },
  { label: 'Observation Organisation', icon: NotebookPen, desc: 'Record and organise meaningful observations', reply: 'You can add an observation with a category like Communication, Learning, or Social Interaction, add a date, and an optional note. These help organise information for conversations with qualified professionals.' },
  { label: 'Delay Flagging', icon: ClipboardCheck, desc: 'See how a Development Check surfaces areas worth a closer look', reply: 'Your last Development Check flagged Language and Communication for follow-up. A good next step is a conversation with a speech-language therapist — shall I show you therapists who speak your preferred language? You can share the check summary with them, with your consent.' },
  { label: 'Resource Discovery', icon: FolderOpen, desc: 'Find practical guides, activities, and support topics', reply: 'Here are some resource categories you can explore: Daily Routines, Learning Activities, Communication and Speech, Caregiver Support, Inclusive Education, and Understanding Neurodiversity.' },
  { label: 'Care Connections', icon: Users, desc: 'Connect with therapists and other families', reply: 'Therapist Connect helps you find specialists and request consultations, and the Parent Community lets you meet families on similar journeys. In this prototype, profiles and posts are illustrative samples.' },
];

/* --------------------------------------------------------------- account */

export const ROLES = ['Parent or Caregiver', 'Teacher or Educator', 'Therapist or Specialist', 'School or Organisation'] as const;

export const INTERESTS = ['Daily Guidance', 'Learning Activities', 'Routine Planning', 'Milestone Tracking', 'Development Check', 'Speech Support', 'Progress Organisation', 'Therapist Connect', 'Parent Community', 'Rewards and Streaks', 'Care Network', 'Resources', 'Multilingual Support'];

export const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Kannada', 'Malayalam', 'Gujarati', 'Punjabi', 'Spanish', 'Arabic', 'French'];

/* ---------------------------------------------------------------- pricing */

export const PLANS = [
  { name: 'Family', tone: 'purple' as Tone, desc: 'For parents and caregivers exploring personalised guidance, routines, learning activities, resources, and progress organisation', items: ['AI Care Companion', 'Daily routine planner', 'Learning activities', 'Milestone tracking', 'Development Check', 'Rewards and streaks', 'Parent community', 'Resource library'] },
  { name: 'School', tone: 'mint' as Tone, desc: 'For educational institutions exploring tools for collaboration, learning support, and inclusive education', items: ['Collaboration tools', 'Learning support', 'Inclusive education', 'Activity library', 'Progress views', 'Care network'] },
  { name: 'Care Network', tone: 'coral' as Tone, desc: 'For therapy centres and professional support organisations exploring better coordination and family engagement', items: ['Therapist portal', 'Coordination tools', 'Family engagement', 'Session companion', 'Consent-based progress sharing', 'Resource hub'] },
];
