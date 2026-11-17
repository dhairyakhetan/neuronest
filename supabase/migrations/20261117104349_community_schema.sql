-- =====================================================================
-- NeuroNest · Parent Community
-- Members-only community. Every table has RLS. Other people's posts and
-- comments are read only through SECURITY DEFINER functions that mask the
-- author of anonymous content, so anonymity holds at the database level.
-- =====================================================================

-- ---------------------------------------------------------------- helpers
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------- profiles
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 60),
  role         text not null default 'Parent or Caregiver'
               check (role in ('Parent or Caregiver','Teacher or Educator','Therapist or Specialist','School or Organisation')),
  city         text check (city is null or char_length(city) <= 60),
  context      text check (context is null or char_length(context) <= 80),
  bio          text check (bio is null or char_length(bio) <= 280),
  tags         text[] not null default '{}' check (cardinality(tags) <= 8),
  languages    text[] not null default '{}' check (cardinality(languages) <= 8),
  interests    text[] not null default '{}',
  language     text not null default 'English',
  experience   text not null default 'simple' check (experience in ('simple','detailed')),
  onboarded    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "Members can view member profiles" on public.profiles
  for select to authenticated using (true);
create policy "Users can create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users can update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Create a profile automatically for every new auth user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  v_role text := new.raw_user_meta_data ->> 'role';
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    left(coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(coalesce(new.email, ''), '@', 1), 'Parent'), 60),
    case when v_role in ('Parent or Caregiver','Teacher or Educator','Therapist or Specialist','School or Organisation')
         then v_role else 'Parent or Caregiver' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- circles
create table public.circles (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text not null,
  tone        text not null default 'purple' check (tone in ('purple','mint','coral','butter')),
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.circles enable row level security;
create policy "Anyone can view circles" on public.circles
  for select to anon, authenticated using (true);

create table public.circle_members (
  circle_id uuid not null references public.circles (id) on delete cascade,
  user_id   uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, user_id)
);
create index circle_members_user_id_idx on public.circle_members (user_id);
alter table public.circle_members enable row level security;
create policy "Members can see circle membership" on public.circle_members
  for select to authenticated using (true);
create policy "Users can join circles" on public.circle_members
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can leave circles" on public.circle_members
  for delete to authenticated using ((select auth.uid()) = user_id);

-- ------------------------------------------------------------------ posts
create table public.posts (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  is_anonymous boolean not null default false,
  topic        text not null check (topic in ('Wins and Milestones','Questions','Tips and Strategies','Sensory and Routines','School and Inclusion','Self-Care')),
  circle_id    uuid references public.circles (id) on delete set null,
  body         text not null check (char_length(btrim(body)) between 1 and 2000),
  hidden       boolean not null default false,  -- set by moderators
  created_at   timestamptz not null default now()
);
create index posts_created_at_idx on public.posts (created_at desc);
create index posts_circle_created_idx on public.posts (circle_id, created_at desc);
create index posts_author_id_idx on public.posts (author_id);
alter table public.posts enable row level security;

-- Direct reads are limited to your own posts; everyone else's go through community_feed()
create policy "Authors can read their own posts" on public.posts
  for select to authenticated using ((select auth.uid()) = author_id);
create policy "Members can create posts" on public.posts
  for insert to authenticated with check (
    (select auth.uid()) = author_id
    and hidden = false
    and (circle_id is null or exists (
      select 1 from public.circle_members m
      where m.circle_id = posts.circle_id and m.user_id = (select auth.uid())
    ))
  );
create policy "Authors can delete their own posts" on public.posts
  for delete to authenticated using ((select auth.uid()) = author_id);

-- --------------------------------------------------------------- comments
create table public.comments (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.posts (id) on delete cascade,
  author_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  is_anonymous boolean not null default false,
  body         text not null check (char_length(btrim(body)) between 1 and 1000),
  hidden       boolean not null default false,
  created_at   timestamptz not null default now()
);
create index comments_post_created_idx on public.comments (post_id, created_at);
create index comments_author_id_idx on public.comments (author_id);
alter table public.comments enable row level security;
create policy "Authors can read their own comments" on public.comments
  for select to authenticated using ((select auth.uid()) = author_id);
create policy "Members can comment" on public.comments
  for insert to authenticated with check ((select auth.uid()) = author_id and hidden = false);
create policy "Authors can delete their own comments" on public.comments
  for delete to authenticated using ((select auth.uid()) = author_id);

-- ------------------------------------------------- reactions, saves, reports
create table public.post_reactions (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index post_reactions_user_id_idx on public.post_reactions (user_id);
alter table public.post_reactions enable row level security;
create policy "Users see their own reactions" on public.post_reactions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can react" on public.post_reactions
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can remove their reaction" on public.post_reactions
  for delete to authenticated using ((select auth.uid()) = user_id);

create table public.post_saves (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index post_saves_user_id_idx on public.post_saves (user_id);
alter table public.post_saves enable row level security;
create policy "Users see their own saves" on public.post_saves
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can save posts" on public.post_saves
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can unsave posts" on public.post_saves
  for delete to authenticated using ((select auth.uid()) = user_id);

create table public.post_reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reason      text not null default 'Reported from feed' check (char_length(reason) <= 500),
  status      text not null default 'open' check (status in ('open','reviewed','actioned')),
  created_at  timestamptz not null default now(),
  unique (post_id, reporter_id)
);
create index post_reports_reporter_id_idx on public.post_reports (reporter_id);
alter table public.post_reports enable row level security;
create policy "Users see their own reports" on public.post_reports
  for select to authenticated using ((select auth.uid()) = reporter_id);
create policy "Users can report posts" on public.post_reports
  for insert to authenticated with check ((select auth.uid()) = reporter_id and status = 'open');

-- ------------------------------------------------------------ connections
create table public.connections (
  requester_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  addressee_id uuid not null references public.profiles (id) on delete cascade,
  status       text not null default 'pending' check (status in ('pending','accepted')),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  primary key (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);
create unique index connections_pair_idx on public.connections (least(requester_id, addressee_id), greatest(requester_id, addressee_id));
create index connections_addressee_id_idx on public.connections (addressee_id);
alter table public.connections enable row level security;
create policy "People in a connection can see it" on public.connections
  for select to authenticated using ((select auth.uid()) in (requester_id, addressee_id));
create policy "Users can send connection requests" on public.connections
  for insert to authenticated with check ((select auth.uid()) = requester_id and status = 'pending');
create policy "Addressee can accept a request" on public.connections
  for update to authenticated using ((select auth.uid()) = addressee_id)
  with check ((select auth.uid()) = addressee_id and status = 'accepted');
create policy "Either person can remove a connection" on public.connections
  for delete to authenticated using ((select auth.uid()) in (requester_id, addressee_id));
-- only status/responded_at may change on accept
revoke update on public.connections from anon, authenticated;
grant update (status, responded_at) on public.connections to authenticated;

-- --------------------------------------------------------- rate limiting
create or replace function public.enforce_post_rate_limit()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (select count(*) from public.posts p
      where p.author_id = new.author_id and p.created_at > now() - interval '1 hour') >= 10 then
    raise exception 'You''ve posted a lot in the last hour — please take a short break and try again soon.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger posts_rate_limit before insert on public.posts
  for each row execute function public.enforce_post_rate_limit();

create or replace function public.enforce_comment_rate_limit()
returns trigger language plpgsql set search_path = '' as $$
begin
  if (select count(*) from public.comments c
      where c.author_id = new.author_id and c.created_at > now() - interval '1 hour') >= 60 then
    raise exception 'You''re commenting very quickly — please wait a little and try again.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger comments_rate_limit before insert on public.comments
  for each row execute function public.enforce_comment_rate_limit();

-- ============================================================== read APIs

-- Feed for signed-in members. Masks the author of anonymous posts.
create or replace function public.community_feed(
  p_circle     uuid        default null,
  p_topic      text        default null,
  p_saved_only boolean     default false,
  p_author     uuid        default null,
  p_before     timestamptz default null,
  p_limit      int         default 20
)
returns table (
  id uuid, body text, topic text, circle_id uuid, circle_name text, created_at timestamptz,
  is_anonymous boolean, author_id uuid, author_name text, author_context text, author_city text,
  support_count bigint, comment_count bigint, supported_by_me boolean, saved_by_me boolean, is_mine boolean
)
language sql stable security definer set search_path = '' as $$
  select
    p.id, p.body, p.topic, p.circle_id, c.name, p.created_at, p.is_anonymous,
    case when p.is_anonymous then null else p.author_id end,
    case when p.is_anonymous then 'Anonymous parent' else pr.display_name end,
    case when p.is_anonymous then null else pr.context end,
    case when p.is_anonymous then null else pr.city end,
    (select count(*) from public.post_reactions r where r.post_id = p.id),
    (select count(*) from public.comments cm where cm.post_id = p.id and not cm.hidden),
    exists (select 1 from public.post_reactions r where r.post_id = p.id and r.user_id = auth.uid()),
    exists (select 1 from public.post_saves s where s.post_id = p.id and s.user_id = auth.uid()),
    p.author_id = auth.uid()
  from public.posts p
  join public.profiles pr on pr.id = p.author_id
  left join public.circles c on c.id = p.circle_id
  where auth.uid() is not null
    and not p.hidden
    and (p_circle is null or p.circle_id = p_circle)
    and (p_topic is null or p.topic = p_topic)
    and (not p_saved_only or exists (select 1 from public.post_saves s where s.post_id = p.id and s.user_id = auth.uid()))
    and (p_author is null or (p.author_id = p_author and not p.is_anonymous))
    and (p_before is null or p.created_at < p_before)
  order by p.created_at desc
  limit least(greatest(coalesce(p_limit, 20), 1), 50);
$$;

-- Comments on a post, with anonymous authors masked.
create or replace function public.post_comments(p_post uuid)
returns table (id uuid, body text, created_at timestamptz, is_anonymous boolean, author_id uuid, author_name text, is_mine boolean)
language sql stable security definer set search_path = '' as $$
  select
    cm.id, cm.body, cm.created_at, cm.is_anonymous,
    case when cm.is_anonymous then null else cm.author_id end,
    case when cm.is_anonymous then 'Anonymous parent' else pr.display_name end,
    cm.author_id = auth.uid()
  from public.comments cm
  join public.profiles pr on pr.id = cm.author_id
  join public.posts p on p.id = cm.post_id
  where auth.uid() is not null and not cm.hidden and not p.hidden and cm.post_id = p_post
  order by cm.created_at asc
  limit 200;
$$;

-- Member directory with shared circles and connection state relative to the caller.
-- SECURITY INVOKER: relies on the RLS policies above.
create or replace function public.community_members(p_search text default null, p_limit int default 60)
returns table (
  id uuid, display_name text, role text, city text, context text, bio text, tags text[], languages text[],
  shared_circles bigint, connection_status text, requested_by_me boolean
)
language sql stable set search_path = '' as $$
  select
    pr.id, pr.display_name, pr.role, pr.city, pr.context, pr.bio, pr.tags, pr.languages,
    (select count(*) from public.circle_members a
       join public.circle_members b on b.circle_id = a.circle_id and b.user_id = auth.uid()
      where a.user_id = pr.id),
    cn.status,
    cn.requester_id = auth.uid()
  from public.profiles pr
  left join public.connections cn
    on (cn.requester_id = auth.uid() and cn.addressee_id = pr.id)
    or (cn.addressee_id = auth.uid() and cn.requester_id = pr.id)
  where auth.uid() is not null
    and pr.id <> auth.uid()
    and (
      p_search is null or btrim(p_search) = ''
      or pr.display_name ilike '%' || p_search || '%'
      or pr.city ilike '%' || p_search || '%'
      or pr.context ilike '%' || p_search || '%'
      or array_to_string(pr.tags, ' ') ilike '%' || p_search || '%'
      or array_to_string(pr.languages, ' ') ilike '%' || p_search || '%'
    )
  order by (cn.status is not null) desc, pr.created_at desc
  limit least(greatest(coalesce(p_limit, 60), 1), 100);
$$;

-- Public, aggregate-only stats (safe for logged-out visitors).
create or replace function public.community_stats()
returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'members', (select count(*) from public.profiles),
    'posts',   (select count(*) from public.posts where not hidden),
    'circles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'slug', c.slug, 'name', c.name, 'description', c.description, 'tone', c.tone,
        'member_count', (select count(*) from public.circle_members m where m.circle_id = c.id)
      ) order by c.sort_order, c.name)
      from public.circles c
    ), '[]'::jsonb)
  );
$$;

-- Let a user permanently delete their own account (cascades to all their content).
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then
    raise exception 'Not signed in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- ------------------------------------------------------------- privileges
revoke execute on function public.community_feed(uuid, text, boolean, uuid, timestamptz, int) from public, anon;
revoke execute on function public.post_comments(uuid) from public, anon;
revoke execute on function public.community_members(text, int) from public, anon;
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.community_feed(uuid, text, boolean, uuid, timestamptz, int) to authenticated;
grant execute on function public.post_comments(uuid) to authenticated;
grant execute on function public.community_members(text, int) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
revoke execute on function public.community_stats() from public;
grant execute on function public.community_stats() to anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
