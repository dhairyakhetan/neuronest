// Generated from the Supabase schema (project: neuronest). Regenerate after schema changes.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Rel = { foreignKeyName: string; columns: string[]; isOneToOne: boolean; referencedRelation: string; referencedColumns: string[] };

export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.18' };
  public: {
    Tables: {
      circle_members: {
        Row: { circle_id: string; joined_at: string; user_id: string };
        Insert: { circle_id: string; joined_at?: string; user_id?: string };
        Update: { circle_id?: string; joined_at?: string; user_id?: string };
        Relationships: Rel[];
      };
      circles: {
        Row: { created_at: string; description: string; id: string; name: string; slug: string; sort_order: number; tone: string };
        Insert: { created_at?: string; description: string; id?: string; name: string; slug: string; sort_order?: number; tone?: string };
        Update: { created_at?: string; description?: string; id?: string; name?: string; slug?: string; sort_order?: number; tone?: string };
        Relationships: Rel[];
      };
      comments: {
        Row: { author_id: string; body: string; created_at: string; hidden: boolean; id: string; is_anonymous: boolean; post_id: string };
        Insert: { author_id?: string; body: string; created_at?: string; hidden?: boolean; id?: string; is_anonymous?: boolean; post_id: string };
        Update: { author_id?: string; body?: string; created_at?: string; hidden?: boolean; id?: string; is_anonymous?: boolean; post_id?: string };
        Relationships: Rel[];
      };
      connections: {
        Row: { addressee_id: string; created_at: string; requester_id: string; responded_at: string | null; status: string };
        Insert: { addressee_id: string; created_at?: string; requester_id?: string; responded_at?: string | null; status?: string };
        Update: { addressee_id?: string; created_at?: string; requester_id?: string; responded_at?: string | null; status?: string };
        Relationships: Rel[];
      };
      post_reactions: {
        Row: { created_at: string; post_id: string; user_id: string };
        Insert: { created_at?: string; post_id: string; user_id?: string };
        Update: { created_at?: string; post_id?: string; user_id?: string };
        Relationships: Rel[];
      };
      post_reports: {
        Row: { created_at: string; id: string; post_id: string; reason: string; reporter_id: string; status: string };
        Insert: { created_at?: string; id?: string; post_id: string; reason?: string; reporter_id?: string; status?: string };
        Update: { created_at?: string; id?: string; post_id?: string; reason?: string; reporter_id?: string; status?: string };
        Relationships: Rel[];
      };
      post_saves: {
        Row: { created_at: string; post_id: string; user_id: string };
        Insert: { created_at?: string; post_id: string; user_id?: string };
        Update: { created_at?: string; post_id?: string; user_id?: string };
        Relationships: Rel[];
      };
      posts: {
        Row: { author_id: string; body: string; circle_id: string | null; created_at: string; hidden: boolean; id: string; is_anonymous: boolean; topic: string };
        Insert: { author_id?: string; body: string; circle_id?: string | null; created_at?: string; hidden?: boolean; id?: string; is_anonymous?: boolean; topic: string };
        Update: { author_id?: string; body?: string; circle_id?: string | null; created_at?: string; hidden?: boolean; id?: string; is_anonymous?: boolean; topic?: string };
        Relationships: Rel[];
      };
      profiles: {
        Row: {
          bio: string | null; city: string | null; context: string | null; created_at: string; display_name: string; experience: string; id: string;
          interests: string[]; language: string; languages: string[]; onboarded: boolean; role: string; tags: string[]; updated_at: string;
        };
        Insert: {
          bio?: string | null; city?: string | null; context?: string | null; created_at?: string; display_name: string; experience?: string; id: string;
          interests?: string[]; language?: string; languages?: string[]; onboarded?: boolean; role?: string; tags?: string[]; updated_at?: string;
        };
        Update: {
          bio?: string | null; city?: string | null; context?: string | null; created_at?: string; display_name?: string; experience?: string; id?: string;
          interests?: string[]; language?: string; languages?: string[]; onboarded?: boolean; role?: string; tags?: string[]; updated_at?: string;
        };
        Relationships: Rel[];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      community_feed: {
        Args: { p_author?: string; p_before?: string; p_circle?: string; p_limit?: number; p_saved_only?: boolean; p_topic?: string };
        Returns: {
          author_city: string | null; author_context: string | null; author_id: string | null; author_name: string; body: string; circle_id: string | null;
          circle_name: string | null; comment_count: number; created_at: string; id: string; is_anonymous: boolean; is_mine: boolean; saved_by_me: boolean;
          support_count: number; supported_by_me: boolean; topic: string;
        }[];
      };
      community_members: {
        Args: { p_limit?: number; p_search?: string };
        Returns: {
          bio: string | null; city: string | null; connection_status: 'pending' | 'accepted' | null; context: string | null; display_name: string; id: string;
          languages: string[]; requested_by_me: boolean | null; role: string; shared_circles: number; tags: string[];
        }[];
      };
      community_stats: { Args: never; Returns: Json };
      delete_my_account: { Args: never; Returns: undefined };
      post_comments: {
        Args: { p_post: string };
        Returns: { author_id: string | null; author_name: string; body: string; created_at: string; id: string; is_anonymous: boolean; is_mine: boolean }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type FeedPost = Database['public']['Functions']['community_feed']['Returns'][number];
export type FeedComment = Database['public']['Functions']['post_comments']['Returns'][number];
export type CommunityMember = Database['public']['Functions']['community_members']['Returns'][number];
