import 'dotenv/config'
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(' Faltan variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase conectado correctamente');

export default supabase;