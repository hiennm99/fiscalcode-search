import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Entity, SearchResults, Guarantor, Contact, Address, Bank, JobInfo } from '../types';

// Nên được lưu trữ trong các biến môi trường một cách an toàn
const supabaseUrl = 'https://hbsickdgdwshuvdcadgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhic2lja2RnZHdzaHV2ZGNhZGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzQzMzIsImV4cCI6MjA3Mzg1MDMzMn0.bwM6cB8GSSKGsx1lI-bxSj3ObNvRpIhxnWuQ8c8dyDI'


// Khởi tạo Supabase client
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export class FiscalCodeSearchService {
    // Helper để xử lý các truy vấn Supabase và kiểm tra lỗi
    private static async executeQuery<T>(query: any): Promise<T[]> {
        const { data, error } = await query;
        if (error) {
            console.error('Lỗi Supabase:', error);
            throw new Error(error.message);
        }
        return data || [];
    }

    static async testConnection(): Promise<boolean> {
        try {
            // Thực hiện một truy vấn đơn giản để kiểm tra kết nối
            const { error } = await supabase.from('entities').select('record_id').limit(1);
            if (error) {
                console.error('Kiểm tra kết nối Supabase thất bại:', error.message);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Lỗi khi kiểm tra kết nối Supabase:', error);
            return false;
        }
    }

    static async getEntityByFiscalCode(fiscalCode: string): Promise<Entity[]> {
        console.log(`Đang tìm kiếm các thực thể cho mã số thuế: ${fiscalCode}`);
        const query = supabase
            .from('entities')
            .select('*')
            .eq('fiscal_code', fiscalCode);
        return this.executeQuery<Entity>(query);
    }

    static async getMetadata(fiscalCode: string): Promise<SearchResults['metadata']> {
        console.log(`Đang lấy siêu dữ liệu cho mã số thuế: ${fiscalCode}`);
        try {
            // Lấy các record_id liên quan đến mã số thuế
            const { data: entities, error: entitiesError } = await supabase
                .from('entities')
                .select('record_id')
                .eq('fiscal_code', fiscalCode);

            if (entitiesError) throw entitiesError;
            const relatedRecordIds = entities.map(e => e.record_id);

            // Thực hiện các truy vấn đếm song song
            const [
                guarantorsCount,
                contactsCount,
                addressesCount,
                banksCount,
                jobsCount
            ] = await Promise.all([
                relatedRecordIds.length > 0 ? supabase.from('guarantors').select('record_id', { count: 'exact', head: true }).in('record_id', relatedRecordIds) : { count: 0 },
                supabase.from('contacts').select('record_id', { count: 'exact', head: true }).eq('fiscal_code', fiscalCode),
                supabase.from('addresses').select('record_id', { count: 'exact', head: true }).eq('fiscal_code', fiscalCode),
                supabase.from('banks').select('record_id', { count: 'exact', head: true }).eq('fiscal_code', fiscalCode),
                supabase.from('jobs').select('record_id', { count: 'exact', head: true }).eq('fiscal_code', fiscalCode)
            ]);

            return {
                guarantors_count: guarantorsCount.count || 0,
                contacts_count: contactsCount.count || 0,
                addresses_count: addressesCount.count || 0,
                banks_count: banksCount.count || 0,
                jobs_count: jobsCount.count || 0
            };
        } catch (error) {
            console.error('Lỗi khi lấy siêu dữ liệu:', error);
            throw new Error('Không thể lấy siêu dữ liệu');
        }
    }

    static async getGuarantors(fiscalCode: string): Promise<Guarantor[]> {
        console.log(`Đang tải người bảo lãnh cho mã số thuế: ${fiscalCode}`);
        // Đầu tiên, lấy các record_id từ bảng thực thể khớp với mã số thuế
        const { data: entities, error: entitiesError } = await supabase
            .from('entities')
            .select('record_id')
            .eq('fiscal_code', fiscalCode);

        if (entitiesError) {
            console.error('Lỗi khi lấy record_ids của thực thể:', entitiesError);
            throw new Error('Không thể lấy record_ids của thực thể.');
        }

        const relatedRecordIds = entities.map(e => e.record_id);

        if (relatedRecordIds.length === 0) {
            return []; // Không có thực thể nào khớp, vì vậy không có người bảo lãnh
        }

        // Sau đó, lấy những người bảo lãnh có record_id khớp
        const query = supabase
            .from('guarantors')
            .select('*')
            .in('record_id', relatedRecordIds);
        return this.executeQuery<Guarantor>(query);
    }

    static async getContacts(fiscalCode: string): Promise<Contact[]> {
        console.log(`Đang tải danh bạ cho mã số thuế: ${fiscalCode}`);
        const query = supabase
            .from('contacts')
            .select('*')
            .eq('fiscal_code', fiscalCode);
        return this.executeQuery<Contact>(query);
    }

    static async getAddresses(fiscalCode: string): Promise<Address[]> {
        console.log(`Đang tải địa chỉ cho mã số thuế: ${fiscalCode}`);
        const query = supabase
            .from('addresses')
            .select('*')
            .eq('fiscal_code', fiscalCode);
        return this.executeQuery<Address>(query);
    }

    static async getBanks(fiscalCode: string): Promise<Bank[]> {
        console.log(`Đang tải ngân hàng cho mã số thuế: ${fiscalCode}`);
        const query = supabase
            .from('banks')
            .select('*')
            .eq('fiscal_code', fiscalCode);
        return this.executeQuery<Bank>(query);
    }

    static async getJobs(fiscalCode: string): Promise<JobInfo[]> {
        console.log(`Đang tải công việc cho mã số thuế: ${fiscalCode}`);
        const query = supabase
            .from('jobs')
            .select('*')
            .eq('fiscal_code', fiscalCode);
        return this.executeQuery<JobInfo>(query);
    }

    // Phương thức tiện ích để lấy tất cả dữ liệu cùng một lúc
    static async getAllDataByFiscalCode(fiscalCode: string): Promise<SearchResults> {
        const [entities, guarantors, contacts, addresses, banks, jobs, metadata] = await Promise.all([
            this.getEntityByFiscalCode(fiscalCode),
            this.getGuarantors(fiscalCode),
            this.getContacts(fiscalCode),
            this.getAddresses(fiscalCode),
            this.getBanks(fiscalCode),
            this.getJobs(fiscalCode),
            this.getMetadata(fiscalCode)
        ]);

        return {
            entities,
            guarantors,
            contacts,
            addresses,
            banks,
            jobs,
            metadata
        };
    }
}