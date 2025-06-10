import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dywcondufemynyjaxpqu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // use public env var

export const supabase = createClient(supabaseUrl, supabaseKey)
