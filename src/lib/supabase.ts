import { createClient } from '@supabase/supabase-js';

// ملاحظة: يجب عليك استبدال هذه القيم من مشروع Supabase الخاص بك
// 1. اذهب إلى supabase.com وأنشئ مشروعاً مجانياً
// 2. من الإعدادات (API)، انسخ الـ URL والـ Anon Key
const supabaseUrl = 'https://ciuczjgcseokjafxaudv.supabase.co';
const supabaseKey = 'sb_publishable_9BY82vRIgaaMnpS1_tc-Dw__doZ6RbV';

export const supabase = createClient(supabaseUrl, supabaseKey);
