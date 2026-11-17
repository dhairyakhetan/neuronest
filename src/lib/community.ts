import { supabase, friendlyError } from './supabase';
import type { CommunityMember, FeedComment, FeedPost } from './database.types';
import type { Topic } from '../data/community';
import type { Tone } from '../data/content';

export type { CommunityMember, FeedComment, FeedPost };

export interface CircleInfo {
  id: string;
  slug: string;
  name: string;
  description: string;
  tone: Tone;
  member_count: number;
}

export interface CommunityStats {
  members: number;
  posts: number;
  circles: CircleInfo[];
}

type R<T> = { data: T; error?: undefined } | { data?: undefined; error: string };

async function wrap<T>(p: PromiseLike<{ data: T | null; error: { message: string; code?: string } | null }>, fallback: T): Promise<R<T>> {
  const { data, error } = await p;
  if (error) return { error: friendlyError(error) };
  return { data: data ?? fallback };
}

/* ---------------------------------------------------------------- reads */

export async function fetchStats(): Promise<R<CommunityStats>> {
  const { data, error } = await supabase.rpc('community_stats');
  if (error) return { error: friendlyError(error) };
  const d = (data ?? {}) as unknown as CommunityStats;
  return { data: { members: Number(d.members ?? 0), posts: Number(d.posts ?? 0), circles: d.circles ?? [] } };
}

export interface FeedQuery {
  circleId?: string | null;
  topic?: Topic | null;
  savedOnly?: boolean;
  authorId?: string | null;
  before?: string | null;
  limit?: number;
}

export function fetchFeed(q: FeedQuery = {}) {
  return wrap(
    supabase.rpc('community_feed', {
      p_circle: q.circleId ?? undefined,
      p_topic: q.topic ?? undefined,
      p_saved_only: q.savedOnly ?? false,
      p_author: q.authorId ?? undefined,
      p_before: q.before ?? undefined,
      p_limit: q.limit ?? 20,
    }),
    [] as FeedPost[],
  );
}

export const fetchComments = (postId: string) => wrap(supabase.rpc('post_comments', { p_post: postId }), [] as FeedComment[]);

export const fetchMembers = (search?: string) =>
  wrap(supabase.rpc('community_members', { p_search: search?.trim() || undefined, p_limit: 60 }), [] as CommunityMember[]);

export async function fetchMyCircleIds(userId: string): Promise<R<string[]>> {
  const r = await wrap(supabase.from('circle_members').select('circle_id').eq('user_id', userId), [] as { circle_id: string }[]);
  return r.error ? r : { data: r.data!.map((x) => x.circle_id) };
}

export async function countMyPosts(userId: string): Promise<number> {
  const { count } = await supabase.from('posts').select('id', { count: 'exact', head: true }).eq('author_id', userId);
  return count ?? 0;
}

/* --------------------------------------------------------------- writes */

async function run(p: PromiseLike<{ error: { message: string; code?: string } | null }>): Promise<{ error?: string }> {
  const { error } = await p;
  return error ? { error: friendlyError(error) } : {};
}

export const createPost = (p: { body: string; topic: Topic; circleId?: string | null; anonymous: boolean }) =>
  run(supabase.from('posts').insert({ body: p.body.trim(), topic: p.topic, circle_id: p.circleId || null, is_anonymous: p.anonymous }));

export const deletePost = (id: string) => run(supabase.from('posts').delete().eq('id', id));

export const setSupport = (postId: string, on: boolean, userId: string) =>
  on ? run(supabase.from('post_reactions').insert({ post_id: postId })) : run(supabase.from('post_reactions').delete().eq('post_id', postId).eq('user_id', userId));

export const setSaved = (postId: string, on: boolean, userId: string) =>
  on ? run(supabase.from('post_saves').insert({ post_id: postId })) : run(supabase.from('post_saves').delete().eq('post_id', postId).eq('user_id', userId));

export const addComment = (postId: string, body: string, anonymous: boolean) =>
  run(supabase.from('comments').insert({ post_id: postId, body: body.trim(), is_anonymous: anonymous }));

export const deleteComment = (id: string) => run(supabase.from('comments').delete().eq('id', id));

export async function reportPost(postId: string, reason: string) {
  const { error } = await supabase.from('post_reports').insert({ post_id: postId, reason });
  if (error && error.code !== '23505') return { error: friendlyError(error) }; // already reported is fine
  return {};
}

export const joinCircle = (circleId: string) => run(supabase.from('circle_members').insert({ circle_id: circleId }));
export const leaveCircle = (circleId: string, userId: string) => run(supabase.from('circle_members').delete().eq('circle_id', circleId).eq('user_id', userId));

export const requestConnection = (otherId: string) => run(supabase.from('connections').insert({ addressee_id: otherId }));

export const acceptConnection = (requesterId: string, me: string) =>
  run(supabase.from('connections').update({ status: 'accepted', responded_at: new Date().toISOString() }).eq('requester_id', requesterId).eq('addressee_id', me));

export const removeConnection = (otherId: string, me: string) =>
  run(
    supabase
      .from('connections')
      .delete()
      .or(`and(requester_id.eq.${me},addressee_id.eq.${otherId}),and(requester_id.eq.${otherId},addressee_id.eq.${me})`),
  );
