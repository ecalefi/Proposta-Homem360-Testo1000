import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// Usando variáveis de ambiente ou fallback para local
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Flag para modo demo (sem backend)
export const IS_DEMO_MODE = true;

/**
 * SQL SCHEMA REFERENCE
 * Execute este SQL no Supabase SQL Editor:
 * 
 * 1. Acesse: https://supabase.com/dashboard/project/wgnedvfzwczybumzbjgo/sql
 * 2. Cole o conteúdo de database/supabase_schema.sql
 * 3. Clique em "Run"
 * 4. Cole o conteúdo de database/supabase_seed.sql
 * 5. Clique em "Run"
 * 6. Verifique as tabelas em: Table Editor
 */
export const SQL_SCHEMA_INSTRUCTIONS = `
-- Schema completo disponível em:
-- ~/projetos/Projeto360/database/supabase_schema.sql
-- ~/projetos/Projeto360/database/supabase_seed.sql
`;
