// ============================================
// types/related.types.ts
// ============================================
// Address Types
export interface Address {
    borrower_id: number;
    entity_id: string;
    fiscal_code: string;
    address_type?: string;
    street?: string;
    locality?: string;
    city?: string;
    province?: string;
    region?: string;
    country?: string;
    postcode?: string;
    full_address?: string;
    origin_street?: string;
    origin_city?: string;
    origin_province?: string;
    full_origin_address?: string;
    address_notes?: string;
    similar_score?: number;
    source_system: string;
    unique_borrower_id: string;
    investigation_info_id?: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;
}

// Contact Types
export interface Contact {
    borrower_id?: number;
    entity_id?: string;
    fiscal_code?: string;
    phone_number?: string;
    email?: string;
    is_pec?: boolean;
    is_verified?: boolean;
    source_system?: string;
    unique_borrower_id?: string;
    created_date?: string;
    modified_date?: string;
    extracted_date?: string;
}

// Bank Types
export interface Bank {
    borrower_id?: number;
    entity_id?: string;
    fiscal_code?: string;
    phone_number?: string;
    email?: string;
    is_pec?: string;
    is_verified?: string;
    source_system?: string;
    unique_borrower_id?: string;
    created_date?: string;
    modified_date?: string;
    extracted_date?: string;
}

// Job Types
export interface Job {
    borrower_id?: number;
    entity_id?: string;
    fiscal_code?: string;
    job_position?: number;
    job_reference?: number;
    job_employer_name?: string;
    job_employer_tax_code?: string;
    job_employer_vat_number?: number;
    job_employer_phone?: string;
    job_monthly_income?: number;
    job_income_range?: string;
    job_pension_category?: string;
    job_start_date?: string;
    job_end_date?: string;
    job_legal_address?: string;
    job_legal_street?: string;
    job_legal_street_number?: string;
    job_legal_street_type?: string;
    job_legal_city?: string;
    job_legal_province?: string;
    job_legal_postcode?: number;
    job_operation_address?: string;
    job_operation_street?: string;
    job_operation_street_number?: string;
    job_operation_street_type?: string;
    job_operation_city?: string;
    job_operation_province?: string;
    job_operation_postcode?: number;
    job_work_activity_notes?: string;
    source_system?: string;
    unique_borrower_id?: string;
    created_date?: string;
    modified_date?: string;
    extracted_date?: string;
}

// Common Search Types
export interface RelatedSearchOptions {
    sourceSystem: string;
    uniqueId: string; // unique_loan_id for guarantors/joints, unique_borrower_id for others
    borrowerTypeId?: number;
    page?: number;
    perPage?: number;
    sortBy?: string;
}

export interface RelatedSearchResult<T> {
    results: T[];
    found: number;
    page: number;
    totalPages: number;
}