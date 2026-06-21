import { createClient } from '@supabase/supabase-js';

// ملاحظة: يجب عليك استبدال هذه القيم من مشروع Supabase الخاص بك
// 1. اذهب إلى supabase.com وأنشئ مشروعاً مجانياً
// 2. من الإعدادات (API)، انسخ الـ URL والـ Anon Key
const supabaseUrl = 'https://ciuczjgcseokjafxaudv.supabase.co';
const supabaseKey = 'https://ciuczjgcseokjafxaudv.supabase.co/rest/v1/';

export const supabase = createClient(supabaseUrl, supabaseKey);
