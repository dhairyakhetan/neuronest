/**
 * Pushes NeuroNest's Supabase Auth settings: site URL, allowed redirect URLs,
 * password length and the branded email templates in supabase/templates/.
 *
 *   SUPABASE_ACCESS_TOKEN=<personal access token> node scripts/apply-auth-config.mjs
 *   node scripts/apply-auth-config.mjs --print   # print the JSON payload instead
 *
 * Create a token at https://supabase.com/dashboard/account/tokens
 */
import { readFileSync } from 'node:fs';

const PROJECT_REF = 'mrtpjraipdkekibtbdzs';
const SITE = 'https://neuronest-official.vercel.app';
const tpl = (name) => readFileSync(new URL(`../supabase/templates/${name}.html`, import.meta.url), 'utf8');

export const payload = {
  site_url: SITE,
  uri_allow_list: [`${SITE}/**`, 'http://localhost:5173/**', 'http://localhost:4173/**'].join(','),
  password_min_length: 8,
  mailer_subjects_confirmation: 'Confirm your NeuroNest account',
  mailer_templates_confirmation_content: tpl('confirmation'),
  mailer_subjects_recovery: 'Reset your NeuroNest password',
  mailer_templates_recovery_content: tpl('recovery'),
  mailer_subjects_magic_link: 'Your NeuroNest sign-in link',
  mailer_templates_magic_link_content: tpl('magic_link'),
  mailer_subjects_email_change: 'Confirm your new email for NeuroNest',
  mailer_templates_email_change_content: tpl('email_change'),
  mailer_subjects_invite: 'You’re invited to join NeuroNest',
  mailer_templates_invite_content: tpl('invite'),
  mailer_subjects_reauthentication: '{{ .Token }} is your NeuroNest verification code',
  mailer_templates_reauthentication_content: tpl('reauthentication'),
};

if (process.argv.includes('--print')) {
  process.stdout.write(JSON.stringify(payload));
} else {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    console.error('Set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)');
    process.exit(1);
  }
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  console.log(res.status, res.ok ? 'Auth settings and email templates updated.' : await res.text());
  if (!res.ok) process.exit(1);
}
