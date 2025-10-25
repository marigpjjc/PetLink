// Cliente de Supabase para el FRONTEND

import { createClient } from '@supabase/supabase-js';

// Credenciales directas (ES SEGURO, la anon key es pública)
const SUPABASE_URL = 'https://wnqbazvzarypvgirqnef.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducWJhenZ6YXJ5cHZnaXJxbmVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzYyOTMsImV4cCI6MjA3NDQ1MjI5M30.QhZj1SAPP5nB5DZ8aBKLPHrT7DiWXzTzjGgWQsWb-w4';

// Crear cliente
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;