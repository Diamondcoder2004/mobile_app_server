import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUBABASE_URL || 'http://localhost:3007';
const supabaseKey = process.env.SUPABASE_KEY; // Используйте переменные окружения!

export const supabase = createClient(supabaseUrl, supabaseKey);

