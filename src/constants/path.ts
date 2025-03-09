const validateEnvVar = (key: string, value: string | undefined): string => {
    if (!value) throw new Error(`${key} environment variable is not defined`);
    return value;
  };
  
export const SUPABASE_URL = validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = validateEnvVar('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY);