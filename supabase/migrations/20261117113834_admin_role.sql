-- =====================================================================
-- Admin role: moderation (hide/delete any post or comment), report queue,
-- member overview, and an "Admin" badge in the community.
-- Admin emails are data (public.admin_emails), never stored in migrations.
-- =====================================================================

create table public.admins (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  granted_at timestamptz not null default now()
);
alter table public.admins enable row level security;
-- who is an admin is public to members (it's shown as a badge); only the database can grant it
create policy "Members can see who is an admin" on public.admins
  for select to authenticated using (true);

-- Emails that automatically become admins when they sign up. No policies: invisible to the API.
create table public.admin_emails (
  email    text primary key check (email = lower(email)),
  added_at timestamptz not null default now()
);
alter table public.admin_emails enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

-- grant admin on sign-up for allow-listed emails
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

  if exists (select 1 from public.admin_emails e where e.email = lower(new.email)) then
    insert into public.admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------- posts
drop policy "Authors can read their own posts" on public.posts;
create policy "Authors and admins can read posts directly" on public.posts
  for select to authenticated using ((select auth.uid()) = author_id or (select public.is_admin()));
drop policy "Authors can delete their own posts" on public.posts;
create policy "Authors and admins can delete posts" on public.posts
  for delete to authenticated using ((select auth.uid()) = author_id or (select public.is_admin()));
create policy "Admins can hide posts" on public.posts
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
revoke update on public.posts from anon, authenticated;
grant update (hidden) on public.posts to authenticated;

-- ------------------------------------------------------------- comments
drop policy "Authors can read their own comments" on public.comments;
create policy "Authors and admins can read comments directly" on public.comments
  for select to authenticated using ((select auth.uid()) = author_id or (select public.is_admin()));
drop policy "Authors can delete their own comments" on public.comments;
create policy "Authors and admins can delete comments" on public.comments
  for delete to authenticated using ((select auth.uid()) = author_id or (select public.is_admin()));
create policy "Admins can hide comments" on public.comments
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
revoke update on public.comments from anon, authenticated;
grant update (hidden) on public.comments to authenticated;

-- -------------------------------------------------------------- reports
drop policy "Users see their own reports" on public.post_reports;
create policy "Reporters and admins can see reports" on public.post_reports
  for select to authenticated using ((select auth.uid()) = reporter_id or (select public.is_admin()));
create policy "Admins can resolve reports" on public.post_reports
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
revoke update on public.post_reports from anon, authenticated;
grant update (status) on public.post_reports to authenticated;

-- ------------------------------------------- read APIs (+ admin badge)
drop function public.community_feed(uuid, text, boolean, uuid, timestamptz, int);
create function public.community_feed(
  p_circle     uuid        default null,
  p_topic      text        default null,
  p_saved_only boolean     default false,
  p_author     uuid        default null,
  p_before     timestamptz default null,
  p_limit      int         default 20
)
returns table (
  id uuid, body text, topic text, circle_id uuid, circle_name text, created_at timestamptz,
  is_anonymous boolean, author_id uuid, author_name text, author_context text, author_city text, author_is_admin boolean,
  support_count bigint, comment_count bigint, supported_by_me boolean, saved_by_me boolean, is_mine boolean
)
language sql stable security definer set search_path = '' as $$
  select
    p.id, p.body, p.topic, p.circle_id, c.name, p.created_at, p.is_anonymous,
    case when p.is_anonymous then null else p.author_id end,
    case when p.is_anonymous then 'Anonymous parent' else pr.display_name end,
    case when p.is_anonymous then null else pr.context end,
    case when p.is_anonymous then null else pr.city end,
    not p.is_anonymous and exists (select 1 from public.admins a where a.user_id = p.author_id),
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

drop function public.post_comments(uuid);
create function public.post_comments(p_post uuid)
returns table (id uuid, body text, created_at timestamptz, is_anonymous boolean, author_id uuid, author_name text, author_is_admin boolean, is_mine boolean)
language sql stable security definer set search_path = '' as $$
  select
    cm.id, cm.body, cm.created_at, cm.is_anonymous,
    case when cm.is_anonymous then null else cm.author_id end,
    case when cm.is_anonymous then 'Anonymous parent' else pr.display_name end,
    not cm.is_anonymous and exists (select 1 from public.admins a where a.user_id = cm.author_id),
    cm.author_id = auth.uid()
  from public.comments cm
  join public.profiles pr on pr.id = cm.author_id
  join public.posts p on p.id = cm.post_id
  where auth.uid() is not null and not cm.hidden and not p.hidden and cm.post_id = p_post
  order by cm.created_at asc
  limit 200;
$$;

drop function public.community_members(text, int);
create function public.community_members(p_search text default null, p_limit int default 60)
returns table (
  id uuid, display_name text, role text, city text, context text, bio text, tags text[], languages text[],
  shared_circles bigint, connection_status text, requested_by_me boolean, is_admin boolean
)
language sql stable set search_path = '' as $$
  select
    pr.id, pr.display_name, pr.role, pr.city, pr.context, pr.bio, pr.tags, pr.languages,
    (select count(*) from public.circle_members a
       join public.circle_members b on b.circle_id = a.circle_id and b.user_id = auth.uid()
      where a.user_id = pr.id),
    cn.status,
    cn.requester_id = auth.uid(),
    exists (select 1 from public.admins ad where ad.user_id = pr.id)
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

-- Admin dashboard data (admins only).
create or replace function public.admin_overview()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.admins a where a.user_id = auth.uid()) then
    raise exception 'Admins only' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'members',      (select count(*) from public.profiles),
    'signups_7d',   (select count(*) from public.profiles where created_at > now() - interval '7 days'),
    'posts',        (select count(*) from public.posts),
    'hidden_posts', (select count(*) from public.posts where hidden),
    'comments',     (select count(*) from public.comments),
    'open_reports', (select count(*) from public.post_reports where status = 'open'),
    'member_list',  coalesce((
      select jsonb_agg(m order by m ->> 'joined' desc) from (
        select jsonb_build_object(
          'id', p.id, 'name', p.display_name, 'email', u.email, 'role', p.role, 'city', p.city,
          'joined', p.created_at, 'last_sign_in', u.last_sign_in_at,
          'posts', (select count(*) from public.posts x where x.author_id = p.id),
          'is_admin', exists (select 1 from public.admins a where a.user_id = p.id)
        ) as m
        from public.profiles p join auth.users u on u.id = p.id
        order by p.created_at desc
        limit 200
      ) s
    ), '[]'::jsonb)
  );
end;
$$;

revoke execute on function public.community_feed(uuid, text, boolean, uuid, timestamptz, int) from public, anon;
revoke execute on function public.post_comments(uuid) from public, anon;
revoke execute on function public.community_members(text, int) from public, anon;
revoke execute on function public.admin_overview() from public, anon;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.community_feed(uuid, text, boolean, uuid, timestamptz, int) to authenticated;
grant execute on function public.post_comments(uuid) to authenticated;
grant execute on function public.community_members(text, int) to authenticated;
grant execute on function public.admin_overview() to authenticated;
grant execute on function public.is_admin() to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
