import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config Check:', {
    url: supabaseUrl ? 'Defined' : 'UNDEFINED',
    key: supabaseAnonKey ? 'Defined' : 'UNDEFINED'
});

const isSupabaseConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_url' &&
    supabaseUrl.startsWith('https://');

export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: () => ({
            select: () => ({
                eq: () => ({
                    order: () => ({
                        limit: () => Promise.resolve({ data: [], error: null })
                    }),
                    limit: () => Promise.resolve({ data: [], error: null })
                }),
                order: () => ({
                    limit: () => Promise.resolve({ data: [], error: null })
                }),
                limit: () => Promise.resolve({ data: [], error: null })
            })
        }),
        storage: {
            from: () => ({
                upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        }
    } as any;

if (!isSupabaseConfigured) {
    console.error('CRITICAL: Supabase environment variables are missing or invalid!');
}
