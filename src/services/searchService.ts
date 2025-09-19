// Thêm vào component
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'YOUR_SUPABASE_URL',
    'YOUR_SUPABASE_ANON_KEY'
)

// Trong handleSearch function
let fiscalCode;
const searchResults = await Promise.all([
    supabase.from('entities').select('*').eq('fiscal_code', fiscalCode),
    supabase.from('guarantors').select('*').eq('fiscal_code', fiscalCode),
    supabase.from('jobs').select('*').eq('fiscal_code', fiscalCode),
    supabase.from('joints').select('*').eq('fiscal_code', fiscalCode)
]);