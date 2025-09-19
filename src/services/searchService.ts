// src/services/searchService.ts - Fixed version
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://hbsickdgdwshuvdcadgq.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhic2lja2RnZHdzaHV2ZGNhZGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzQzMzIsImV4cCI6MjA3Mzg1MDMzMn0.bwM6cB8GSSKGsx1lI-bxSj3ObNvRpIhxnWuQ8c8dyDI'
)

export interface BaseEntity {
    id?: number;
    source_system: string;
    collected_date: string;
    created_date: string;
    similar_score:string;
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
    origin_street?: string;
    origin_city?: string;
    origin_province?: string;
    address_type?: string;
    address_notes?: string;
    street?: string;
    locality?: string;
    city?: string;
    province?: string;
    region?: string;
    postcode?: string;
    country?: string;
    bank_name?: string;
    bank_cab?: string;
    bank_abi?: string;
    account_number?: string;
    created_at?: string;
    updated_at?: string;
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
    job_income_range?:string;
    job_pension_category?:string;
    job_reference?:string;
    job_start_date?: string;
    job_end_date?: string;
    job_employer_phone?:string;
    job_employer_fax?:string;
    job_employer_tax_code?:string;
    job_employer_vat_number?: string;

    job_work_activity_notes?: string;
    job_legal_street_type?: string;
    job_legal_street?: string;
    job_legal_street_number?: string;
    job_legal_address?: string;
    job_legal_city?: string;
    job_legal_province?: string;
    job_legal_postcode?: string;

    job_operation_street_type?: string;
    job_operation_street?: string;
    job_operation_street_number?: string;
    job_operation_address?: string;
    job_operation_city?: string;
    job_operation_province?: string;
    job_operation_postcode?: string;

    finance_position?: string;
    finance_supplier_evaluation?: string;
    finance_ongoing_transfers?: string;
    finance_ongoing_garnishments?: string;
    finance_transfer_amount?: string;
    finance_transfer_expiry?: string;
    finance_bank_account?: string;
    finance_garnishment_amount?: string;
    finance_garnishment_expiry?: string;
    finance_garnishment_notes?: string;
    finance_transfer_notes?: string;
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
            console.log('🔍 Starting partial search for:', fiscalCode);

            // Chuẩn hóa input
            const cleanedCode = fiscalCode.trim().toUpperCase();
            console.log('📝 Cleaned fiscal code:', cleanedCode);

            if (!cleanedCode) {
                throw new Error('Codice fiscale non può essere vuoto');
            }

            const searchPattern = `%${cleanedCode}%`;
            console.log('🎯 Search pattern:', searchPattern);

            // Step 1: Tìm entities và jobs bằng fiscal_code
            console.log('\n1️⃣ Searching entities and jobs by fiscal_code...');
            const [entitiesResult, jobsResult] = await Promise.all([
                supabase.from('entities').select('*').ilike('fiscal_code', searchPattern),
                supabase.from('jobs').select('*').ilike('fiscal_code', searchPattern)
            ]);

            console.log('- Entities found:', entitiesResult.data?.length || 0);
            console.log('- Jobs found:', jobsResult.data?.length || 0);

            // Step 2: Lấy danh sách loan_id từ entities để tìm guarantors và joints
            const entities = entitiesResult.data || [];
            const loanIds = entities
                .map(entity => entity.loan_id)
                .filter(loanId => loanId != null && loanId !== undefined);

            console.log('\n2️⃣ Found loan_ids from entities:', loanIds);

            let guarantorsResult = { data: [], error: null };
            let jointsResult = { data: [], error: null };

            if (loanIds.length > 0) {
                console.log('🔗 Searching guarantors and joints by loan_id...');
                // @ts-ignore
                [guarantorsResult, jointsResult] = await Promise.all([
                    supabase.from('guarantors').select('*').in('loan_id', loanIds),
                    supabase.from('joints').select('*').in('loan_id', loanIds)
                ]);

                console.log('- Guarantors found:', guarantorsResult.data?.length || 0);
                console.log('- Joints found:', jointsResult.data?.length || 0);
            } else {
                console.log('⚠️ No loan_ids found, skipping guarantors and joints search');
            }

            // Log chi tiết từng kết quả
            console.log('\n📊 Search Results Summary:');
            console.log('- Entities:', entities.length, entitiesResult.error ? '❌' : '✅');
            console.log('- Guarantors:', guarantorsResult.data?.length || 0, guarantorsResult.error ? '❌' : '✅');
            console.log('- Jobs:', jobsResult.data?.length || 0, jobsResult.error ? '❌' : '✅');
            console.log('- Joints:', jointsResult.data?.length || 0, jointsResult.error ? '❌' : '✅');

            // Kiểm tra lỗi chi tiết
            if (entitiesResult.error) console.error('❌ Entities error:', entitiesResult.error);
            if (guarantorsResult.error) console.error('❌ Guarantors error:', guarantorsResult.error);
            if (jobsResult.error) console.error('❌ Jobs error:', jobsResult.error);
            if (jointsResult.error) console.error('❌ Joints error:', jointsResult.error);

            return {
                entities: entities,
                guarantors: guarantorsResult.data || [],
                jobs: jobsResult.data || [],
                joints: jointsResult.data || []
            };

        } catch (error) {
            console.error('💥 Search service error:', error);
            // @ts-ignore
            throw new Error(`Lỗi tìm kiếm: ${error.message}`);
        }
    }

    // Tìm kiếm chính xác (exact match) - IMPROVED with loan_id logic
    static async searchExactFiscalCode(fiscalCode: string): Promise<SearchResults> {
        try {
            console.log('🎯 Starting exact search for:', fiscalCode);

            const cleanedCode = fiscalCode.trim().toUpperCase();
            console.log('📝 Cleaned fiscal code for exact search:', cleanedCode);

            // Step 1: Tìm entities và jobs bằng fiscal_code (exact match)
            console.log('\n1️⃣ Exact search entities and jobs by fiscal_code...');
            const [entitiesResult, jobsResult] = await Promise.all([
                supabase.from('entities').select('*').eq('fiscal_code', cleanedCode),
                supabase.from('jobs').select('*').eq('fiscal_code', cleanedCode)
            ]);

            console.log('- Entities found:', entitiesResult.data?.length || 0);
            console.log('- Jobs found:', jobsResult.data?.length || 0);

            // Step 2: Lấy loan_ids từ entities để tìm guarantors và joints
            const entities = entitiesResult.data || [];
            const loanIds = entities
                .map(entity => entity.loan_id)
                .filter(loanId => loanId != null && loanId !== undefined);

            console.log('\n2️⃣ Found loan_ids from entities:', loanIds);

            let guarantorsResult = { data: [], error: null };
            let jointsResult = { data: [], error: null };

            if (loanIds.length > 0) {
                console.log('🔗 Searching guarantors and joints by loan_id...');
                // @ts-ignore
                [guarantorsResult, jointsResult] = await Promise.all([
                    supabase.from('guarantors').select('*').in('loan_id', loanIds),
                    supabase.from('joints').select('*').in('loan_id', loanIds)
                ]);

                console.log('- Guarantors found:', guarantorsResult.data?.length || 0);
                console.log('- Joints found:', jointsResult.data?.length || 0);
            } else {
                console.log('⚠️ No loan_ids found, skipping guarantors and joints search');
            }

            console.log('\n📊 Exact Search Results:');
            console.log('- Entities:', entities.length);
            console.log('- Guarantors:', guarantorsResult.data?.length || 0);
            console.log('- Jobs:', jobsResult.data?.length || 0);
            console.log('- Joints:', jointsResult.data?.length || 0);

            return {
                entities: entities,
                guarantors: guarantorsResult.data || [],
                jobs: jobsResult.data || [],
                joints: jointsResult.data || []
            };

        } catch (error) {
            console.error('💥 Exact search error:', error);
            // @ts-ignore
            throw new Error(`Lỗi tìm kiếm chính xác: ${error.message}`);
        }
    }

    // ENHANCED DEBUG METHOD with loan_id relationship logic
    static async debugSearch(fiscalCode: string): Promise<any> {
        try {
            console.clear();
            console.log('🚨 === ENHANCED DEBUG SESSION (with loan_id logic) ===');
            console.log('Input fiscal code:', fiscalCode);

            // 1. Kiểm tra kết nối
            console.log('\n1️⃣ Testing database connection...');
            const connectionTest = await supabase.from('entities').select('count').limit(1);
            console.log('Connection test:', connectionTest.error ? '❌ FAILED' : '✅ SUCCESS');
            if (connectionTest.error) {
                console.error('Connection error:', connectionTest.error);
            }

            // 2. Kiểm tra dữ liệu mẫu
            console.log('\n2️⃣ Fetching sample data from all tables...');

            // Sample từ entities
            const sampleEntities = await supabase
                .from('entities')
                .select('fiscal_code, name, loan_id, source_system')
                .limit(3);

            console.log('Sample entities:');
            sampleEntities.data?.forEach((item, index) => {
                console.log(`  ${index + 1}. "${item.fiscal_code}" (${item.name}) [loan_id: ${item.loan_id}] [${item.source_system}]`);
            });

            // Sample từ guarantors
            const sampleGuarantors = await supabase
                .from('guarantors')
                .select('fiscal_code, name, loan_id, source_system')
                .limit(3);

            console.log('Sample guarantors:');
            sampleGuarantors.data?.forEach((item, index) => {
                console.log(`  ${index + 1}. "${item.fiscal_code}" (${item.name}) [loan_id: ${item.loan_id}] [${item.source_system}]`);
            });

            // 3. Test search logic với fiscal code cụ thể
            const cleanedCode = fiscalCode.trim().toUpperCase();
            console.log(`\n3️⃣ Testing search logic for: "${cleanedCode}"`);

            // Step A: Tìm entities
            console.log('\n   Step A: Search entities by fiscal_code...');
            const entitiesExact = await supabase.from('entities').select('*').eq('fiscal_code', cleanedCode);
            const entitiesLike = await supabase.from('entities').select('*').ilike('fiscal_code', `%${cleanedCode}%`);

            console.log(`   - Exact match: ${entitiesExact.data?.length || 0} results`);
            console.log(`   - Like match: ${entitiesLike.data?.length || 0} results`);

            if (entitiesExact.data && entitiesExact.data.length > 0) {
                console.log(`   - First entity: ${entitiesExact.data[0].name} (loan_id: ${entitiesExact.data[0].loan_id})`);
            }

            // Step B: Lấy loan_ids và tìm guarantors/joints
            const foundEntities = entitiesExact.data || entitiesLike.data || [];
            const loanIds = foundEntities
                .map(entity => entity.loan_id)
                .filter(loanId => loanId != null);

            console.log(`\n   Step B: Found loan_ids: [${loanIds.join(', ')}]`);

            if (loanIds.length > 0) {
                console.log('   Searching guarantors and joints by loan_id...');

                const guarantorsByLoanId = await supabase
                    .from('guarantors')
                    .select('*')
                    .in('loan_id', loanIds);

                const jointsByLoanId = await supabase
                    .from('joints')
                    .select('*')
                    .in('loan_id', loanIds);

                console.log(`   - Guarantors by loan_id: ${guarantorsByLoanId.data?.length || 0} results`);
                console.log(`   - Joints by loan_id: ${jointsByLoanId.data?.length || 0} results`);

                if (guarantorsByLoanId.data && guarantorsByLoanId.data.length > 0) {
                    console.log(`   - First guarantor: ${guarantorsByLoanId.data[0].name} (fiscal_code: ${guarantorsByLoanId.data[0].fiscal_code})`);
                }
            } else {
                console.log('   ⚠️ No loan_ids found - no guarantors/joints to search');
            }

            // 4. Test jobs search
            console.log('\n4️⃣ Testing jobs search...');
            const jobsResult = await supabase
                .from('jobs')
                .select('fiscal_code, job_employer_name, job_position')
                .eq('fiscal_code', cleanedCode)
                .limit(3);

            console.log(`Jobs found: ${jobsResult.data?.length || 0}`);
            if (jobsResult.data && jobsResult.data.length > 0) {
                jobsResult.data.forEach((job, index) => {
                    console.log(`  ${index + 1}. ${job.job_employer_name} - ${job.job_position}`);
                });
            }

            // 5. Tìm kiếm tương tự để debug
            console.log('\n5️⃣ Finding similar fiscal codes for debugging...');
            if (cleanedCode.length >= 6) {
                const partial = cleanedCode.substring(0, 6);
                const similarResult = await supabase
                    .from('entities')
                    .select('fiscal_code, name, loan_id')
                    .ilike('fiscal_code', `${partial}%`)
                    .limit(10);

                console.log(`Similar codes starting with "${partial}":`);
                similarResult.data?.forEach(item => {
                    console.log(`  - ${item.fiscal_code} (${item.name}) [loan_id: ${item.loan_id}]`);
                });
            }

            // 6. Kiểm tra relationship giữa entities và guarantors
            console.log('\n6️⃣ Testing loan_id relationships...');

            // Lấy một entity có loan_id
            const entityWithLoan = await supabase
                .from('entities')
                .select('fiscal_code, name, loan_id')
                .not('loan_id', 'is', null)
                .limit(1);

            if (entityWithLoan.data && entityWithLoan.data.length > 0) {
                const testLoanId = entityWithLoan.data[0].loan_id;
                console.log(`Testing with loan_id: ${testLoanId} from entity: ${entityWithLoan.data[0].fiscal_code}`);

                const relatedGuarantors = await supabase
                    .from('guarantors')
                    .select('fiscal_code, name, loan_id')
                    .eq('loan_id', testLoanId);

                const relatedJoints = await supabase
                    .from('joints')
                    .select('fiscal_code, name, loan_id')
                    .eq('loan_id', testLoanId);

                console.log(`  - Related guarantors: ${relatedGuarantors.data?.length || 0}`);
                console.log(`  - Related joints: ${relatedJoints.data?.length || 0}`);
            }

            console.log('\n🏁 === DEBUG SESSION COMPLETE ===');

            return {
                connectionTest: connectionTest.error ? 'FAILED' : 'SUCCESS',
                sampleEntities: sampleEntities.data,
                sampleGuarantors: sampleGuarantors.data,
                inputCode: cleanedCode,
                foundLoanIds: loanIds || []
            };

        } catch (error) {
            console.error('💥 Debug session error:', error);
            // @ts-ignore
            return { error: error.message };
        }
    }

    // Test connection với chi tiết hơn
    static async testConnection(): Promise<boolean> {
        try {
            console.log('🔗 Testing database connection...');

            // Test basic connection
            const basicTest = await supabase.from('entities').select('count').limit(1);
            if (basicTest.error) {
                console.error('❌ Basic connection failed:', basicTest.error);
                return false;
            }

            // Test each table
            const tables = ['entities', 'guarantors', 'jobs', 'joints'];
            const tableTests = await Promise.all(
                tables.map(async table => {
                    try {
                        const result = await supabase.from(table).select('count').limit(1);
                        return { table, success: !result.error, error: result.error };
                    } catch (err) {
                        return { table, success: false, error: err };
                    }
                })
            );

            console.log('📊 Table connection results:');
            tableTests.forEach(test => {
                console.log(`  ${test.table}: ${test.success ? '✅' : '❌'}`);
                if (!test.success && test.error) {
                    // @ts-ignore
                    console.log(`    Error: ${test.error.message}`);
                }
            });

            const allSuccess = tableTests.every(test => test.success);
            console.log(`🎯 Overall connection: ${allSuccess ? '✅ SUCCESS' : '❌ FAILED'}`);

            return allSuccess;

        } catch (error) {
            console.error('💥 Connection test error:', error);
            return false;
        }
    }

    // Thêm method để lấy thống kê database
    static async getDatabaseStats(): Promise<any> {
        try {
            const tables = ['entities', 'guarantors', 'jobs', 'joints'];
            const stats = {};

            for (const table of tables) {
                const result = await supabase
                    .from(table)
                    .select('*', { count: 'exact', head: true });

                // @ts-ignore
                stats[table] = {
                    count: result.count || 0,
                    error: result.error?.message
                };
            }

            console.log('📈 Database Statistics:', stats);
            return stats;

        } catch (error) {
            console.error('📈 Stats error:', error);
            // @ts-ignore
            return { error: error.message };
        }
    }
}