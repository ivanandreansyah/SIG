
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isFallback = !supabaseUrl || !supabaseAnonKey;

if (isFallback) {
    console.error("__________________________________________________________________________________");
    console.error("WARNING: using PLACEHOLDER Supabase credentials.");
    console.error("Data fetching will fail until .env.local is configured.");
    console.error("__________________________________________________________________________________");
} else {
    console.log("Supabase Client initialized with provided URL:", supabaseUrl);
}

// Fallback to prevent build/runtime crash, will fail on actual data fetch
export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
