export interface Entity {
    record_id: string;
    fiscal_code: string;
    name: string;
    is_company: boolean;
    gender?: string;
    date_of_birth?: string;
    is_deceased?: boolean;
    date_of_death?: string;
    country_of_birth?: string;
    region_of_birth?: string;
    province_of_birth?: string;
    city_of_birth?: string;
    source_system: string;
    loan_id: string;
    collected_date: string;
    created_date?: string;
    entity_notes?: string;
}

export interface Guarantor {
    record_id: string;
    fiscal_code: string;
    name: string;
    is_company: boolean;
    gender?: string;
    date_of_birth?: string;
    country_of_birth?: string;
    region_of_birth?: string;
    province_of_birth?: string;
    city_of_birth?: string;
    source_system: string;
    collected_date: string;
    created_date?: string;
}

export interface Contact {
    record_id: string;
    fiscal_code: string;
    email?: string;
    is_pec?: boolean;
    is_verified?: boolean;
    phone_number?: string;
    source_system: string;
    collected_date: string;
    created_date?: string;
}

export interface Address {
    record_id: string;
    fiscal_code: string;
    street?: string;
    locality?: string;
    city?: string;
    province?: string;
    region?: string;
    postcode?: string;
    country?: string;
    address_type?: string;
    origin_province?: string;
    origin_city?: string;
    origin_street?: string;
    source_system: string;
    similar_score?: number;
    rn?: number;
    collected_date: string;
    address_notes?: string;
}

export interface Bank {
    record_id: string;
    fiscal_code: string;
    bank_name?: string;
    bank_abi?: string;
    bank_cab?: string;
    account_number?: string;
    source_system: string;
    collected_date: string;
    created_date?: string;
}

export interface JobInfo {
    record_id?: string;
    fiscal_code: string;
    job_position?: string;
    job_employer_name?: string;
    job_monthly_income?: number;
    job_income_range?: string;
    job_start_date?: string;
    job_end_date?: string;
    job_employer_phone?: string;
    job_employer_fax?: string;
    job_employer_tax_code?: string;
    job_employer_vat_number?: string;
    source_system: string;
    collected_date: string;
    created_date?: string;
}

export interface SearchResults {
    entities: Entity[];
    metadata: {
        guarantors_count: number;
        contacts_count: number;
        addresses_count: number;
        banks_count: number;
        jobs_count: number;
    };
}

export interface DetailedResults {
    guarantors?: Guarantor[];
    contacts?: Contact[];
    addresses?: Address[];
    banks?: Bank[];
    jobs?: JobInfo[];
}

export interface RouteParams {
    fiscalCode: string;
    section?: 'entities' | 'guarantors' | 'contacts' | 'addresses' | 'banks' | 'jobs';
}