insert into public.circles (slug, name, description, tone, sort_order) values
  ('new-to-the-journey',  'New to the Journey',               'Just noticed a delay or got a new evaluation? Start here — no question is too small.', 'coral',  1),
  ('speech-journeys',     'Late Talkers and Speech Journeys', 'For families supporting speech and language — share strategies, small wins and therapy tips.', 'purple', 2),
  ('autism-parents-india','Autism Parents India',             'A warm space for parents of autistic children across India.', 'mint',   3),
  ('adhd-family-hub',     'ADHD Family Hub',                  'Routines, focus strategies, school conversations and lots of encouragement.', 'coral',  4),
  ('sensory-friendly',    'Sensory-Friendly Living',          'Calm corners, outings, clothing, food and everything sensory.', 'butter', 5),
  ('inclusive-schools',   'Inclusive Schools Network',        'Navigating admissions, support plans and working with teachers.', 'purple', 6),
  ('dads-in-the-nest',    'Dads in the Nest',                 'A circle for fathers to share, ask and support each other.', 'mint',   7),
  ('hindi-speakers',      'हिंदी में बात करें · Hindi Speakers', 'Share and support each other in Hindi.', 'butter', 8)
on conflict (slug) do nothing;
