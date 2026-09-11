import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase URL & Anon Key from Vite environment variables
const supabaseUrl = ((import.meta as any).env?.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || '';

// Create client instance if credentials are set, otherwise return null
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && !!supabase;
};
