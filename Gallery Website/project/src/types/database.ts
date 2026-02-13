export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      media: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_path: string;
          file_type: string;
          file_size: number;
          thumbnail_url: string | null;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title?: string;
          description?: string | null;
          file_path: string;
          file_type: string;
          file_size?: number;
          thumbnail_url?: string | null;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          file_path?: string;
          file_type?: string;
          file_size?: number;
          thumbnail_url?: string | null;
          created_at?: string;
          user_id?: string;
        };
      };
    };
  };
}

export type Media = Database['public']['Tables']['media']['Row'];
