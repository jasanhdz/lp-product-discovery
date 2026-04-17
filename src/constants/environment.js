export const ENV = {
  API_URL: process.env.REACT_APP_API_URL || '',
  DUMMY_JWT_SIGNATURE: process.env.REACT_APP_DUMMY_JWT_SIGNATURE || 'x',
  ENVIRONMENT: process.env.REACT_APP_ENV || 'development',
  SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || ''
}
