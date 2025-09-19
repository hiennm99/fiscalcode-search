// src/services/searchService.ts
import { createClient } from '@supabase/supabase-js'

// Cấu hình Supabase - thay thế với thông tin thực của bạn
const supabase = createClient(
    'https://hbsickdgdwshuvdcadgq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhic2lja2RnZHdzaHV2ZGNhZGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzQzMzIsImV4cCI6MjA3Mzg1MDMzMn0.bwM6cB8GSSKGsx1lI-bxSj3ObNvRpIhxnWuQ8c8dyDI'
)
export interface BaseEntity {
    id?: number;
    source_system: string;
    collected_date: string;
    created_date: string;
    fiscal_code: string;
    name: string;
    is_company: boolean;
    gender?: string;
    date_of_birth?: string;
    country_of_birth?: string;
    region_of_birth?: string;
    province_of_birth?: string;
    city_of_birth?: string;
    is_deceased?: boolean;
    date_of_death?: string;
    entity_notes?: string;
    street?: string;
    locality?: string;
    city?: string;
    province?: string;
    region?: string;
    postcode?: string;
    country?: string;
    bank_name?: string;
    account_number?: string;
}

export interface Entity extends BaseEntity {
    loan_id?: number;
}

export interface JobInfo {
    id?: number;
    source_system: string;
    collected_date: string;
    created_date: string;
    fiscal_code: string;
    job_position?: string;
    job_employer_name?: string;
    job_monthly_income?: number;
    job_start_date?: string;
    job_end_date?: string;
    job_legal_city?: string;
    job_legal_province?: string;
    finance_position?: string;
    finance_bank_account?: string;
}

export interface SearchResults {
    entities: Entity[];
    guarantors: Entity[];
    jobs: JobInfo[];
    joints: Entity[];
}

export class FiscalCodeSearchService {

    // Tìm kiếm với LIKE pattern cho partial matching
    static async searchByFiscalCode(fiscalCode: string): Promise<SearchResults> {
        try {
            console.log('Searching for fiscal code:', fiscalCode);

            // Tạo pattern cho tìm kiếm LIKE
            const searchPattern = `%${fiscalCode.toUpperCase()}%`;
            console.log('Search pattern:', searchPattern);

            // Test simple query first
            console.log('Testing simple select from entities...');
            const testQuery = await supabase.from('entities').select('fiscal_code').limit(5);
            console.log('Test query result:', testQuery);

            // Thực hiện tất cả queries song song
            const [entitiesResult, guarantorsResult, jobsResult, jointsResult] = await Promise.all([
                // Entities table
                supabase
                    .from('entities')
                    .select('*')
                    .ilike('fiscal_code', searchPattern),

                // Guarantors table
                supabase
                    .from('guarantors')
                    .select('*')
                    .ilike('fiscal_code', searchPattern),

                // Jobs table
                supabase
                    .from('jobs')
                    .select('*')
                    .ilike('fiscal_code', searchPattern),

                // Joints table
                supabase
                    .from('joints')
                    .select('*')
                    .ilike('fiscal_code', searchPattern)
            ]);

            // Kiểm tra lỗi
            if (entitiesResult.error) {
                console.error('Entities query error:', entitiesResult.error);
            }
            if (guarantorsResult.error) {
                console.error('Guarantors query error:', guarantorsResult.error);
            }
            if (jobsResult.error) {
                console.error('Jobs query error:', jobsResult.error);
            }
            if (jointsResult.error) {
                console.error('Joints query error:', jointsResult.error);
            }

            const results: SearchResults = {
                entities: entitiesResult.data || [],
                guarantors: guarantorsResult.data || [],
                jobs: jobsResult.data || [],
                joints: jointsResult.data || []
            };

            console.log('Search results:', results);
            return results;

        } catch (error) {
            console.error('Search service error:', error);
            throw new Error('Errore durante la ricerca nel database');
        }
    }

    // Tìm kiếm chính xác (exact match)
    static async searchExactFiscalCode(fiscalCode: string): Promise<SearchResults> {
        try {
            console.log('Exact search for fiscal code:', fiscalCode);

            // Test with the exact value from your database
            console.log('Testing exact match with:', fiscalCode.toUpperCase());

            const [entitiesResult, guarantorsResult, jobsResult, jointsResult] = await Promise.all([
                supabase.from('entities').select('*').eq('fiscal_code', fiscalCode.toUpperCase()),
                supabase.from('guarantors').select('*').eq('fiscal_code', fiscalCode.toUpperCase()),
                supabase.from('jobs').select('*').eq('fiscal_code', fiscalCode.toUpperCase()),
                supabase.from('joints').select('*').eq('fiscal_code', fiscalCode.toUpperCase())
            ]);

            console.log('Exact search results:');
            console.log('- Entities:', entitiesResult);
            console.log('- Guarantors:', guarantorsResult);
            console.log('- Jobs:', jobsResult);
            console.log('- Joints:', jointsResult);

            return {
                entities: entitiesResult.data || [],
                guarantors: guarantorsResult.data || [],
                jobs: jobsResult.data || [],
                joints: jointsResult.data || []
            };

        } catch (error) {
            console.error('Exact search error:', error);
            throw new Error('Errore durante la ricerca esatta nel database');
        }
    }

    // Thêm method debug để kiểm tra dữ liệu
    static async debugSearch(fiscalCode: string): Promise<any> {
        try {
            // 1. Kiểm tra tất cả fiscal codes trong entities
            const allCodes = await supabase.from('entities').select('fiscal_code').limit(10);
            console.log('All fiscal codes in database:', allCodes.data);

            // 2. Thử nhiều cách tìm kiếm
            const exactSearch = await supabase.from('entities').select('*').eq('fiscal_code', fiscalCode);
            const likeSearch = await supabase.from('entities').select('*').like('fiscal_code', `%${fiscalCode}%`);
            const ilikeSearch = await supabase.from('entities').select('*').ilike('fiscal_code', `%${fiscalCode}%`);

            console.log('Debug results for:', fiscalCode);
            console.log('- Exact (.eq):', exactSearch);
            console.log('- Like (.like):', likeSearch);
            console.log('- ILike (.ilike):', ilikeSearch);

            return {
                allCodes: allCodes.data,
                exactSearch: exactSearch.data,
                likeSearch: likeSearch.data,
                ilikeSearch: ilikeSearch.data
            };
        } catch (error) {
            console.error('Debug search error:', error);
            return null;
        }
    }

    // Kiểm tra kết nối database
    static async testConnection(): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('entities')
                .select('count')
                .limit(1);

            if (error) {
                console.error('Database connection test failed:', error);
                return false;
            }

            console.log('Database connection successful');
            return true;
        } catch (error) {
            console.error('Database connection error:', error);
            return false;
        }
    }
}