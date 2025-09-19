// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hbsickdgdwshuvdcadgq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhic2lja2RnZHdzaHV2ZGNhZGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzQzMzIsImV4cCI6MjA3Mzg1MDMzMn0.bwM6cB8GSSKGsx1lI-bxSj3ObNvRpIhxnWuQ8c8dyDI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Database {
    public: {
        Tables: {
            entities: {
                Row: {
                    id: number
                    source_system: string
                    collected_date: string
                    created_date: string
                    fiscal_code: string
                    loan_id?: number
                    name: string
                    is_company: boolean
                    gender?: string
                    date_of_birth?: string
                    country_of_birth?: string
                    region_of_birth?: string
                    province_of_birth?: string
                    city_of_birth?: string
                    is_deceased?: boolean
                    date_of_death?: string
                    entity_notes?: string
                    origin_province?: string
                    origin_city?: string
                    origin_street?: string
                    address_type?: string
                    street?: string
                    locality?: string
                    city?: string
                    province?: string
                    region?: string
                    postcode?: string
                    country?: string
                    similar_score?: number
                    address_notes?: string
                    bank_abi?: string
                    bank_cab?: string
                    bank_name?: string
                    account_number?: string
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['entities']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['entities']['Insert']>
            }
            guarantors: {
                Row: Database['public']['Tables']['entities']['Row']
                Insert: Database['public']['Tables']['entities']['Insert']
                Update: Database['public']['Tables']['entities']['Update']
            }
            joints: {
                Row: Database['public']['Tables']['entities']['Row']
                Insert: Database['public']['Tables']['entities']['Insert']
                Update: Database['public']['Tables']['entities']['Update']
            }
            jobs: {
                Row: {
                    id: number
                    source_system: string
                    collected_date: string
                    created_date: string
                    fiscal_code: string
                    job_position?: string
                    job_employer_phone?: string
                    job_start_date?: string
                    job_end_date?: string
                    job_pension_category?: string
                    job_employer_tax_code?: string
                    job_employer_fax?: string
                    job_income_range?: string
                    job_reference?: string
                    job_employer_vat_number?: string
                    job_monthly_income?: number
                    job_work_activity_notes?: string
                    job_employer_name?: string
                    job_legal_street_type?: string
                    job_legal_street?: string
                    job_legal_address?: string
                    job_legal_street_number?: string
                    job_legal_city?: string
                    job_legal_province?: string
                    job_legal_postcode?: string
                    job_operation_street_type?: string
                    job_operation_street_number?: string
                    job_operation_street?: string
                    job_operation_address?: string
                    job_operation_postcode?: string
                    job_operation_province?: string
                    job_operation_city?: string
                    finance_position?: string
                    finance_supplier_evaluation?: string
                    finance_ongoing_transfers?: boolean
                    finance_ongoing_garnishments?: boolean
                    finance_bank_account?: string
                    finance_garnishment_notes?: string
                    finance_transfer_amount?: number
                    finance_transfer_notes?: string
                    finance_transfer_expiry?: string
                    finance_garnishment_amount?: number
                    finance_garnishment_expiry?: string
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['jobs']['Insert']>
            }
        }
        Functions: {
            search_by_fiscal_code: {
                Args: { search_fiscal_code: string }
                Returns: {
                    entities: Database['public']['Tables']['entities']['Row'][]
                    guarantors: Database['public']['Tables']['guarantors']['Row'][]
                    jobs: Database['public']['Tables']['jobs']['Row'][]
                    joints: Database['public']['Tables']['joints']['Row'][]
                }
            }
        }
    }
}