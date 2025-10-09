// ============================================
// types/related.types.ts
// ============================================
// Address Types
export interface Address {
    borrower_id: number;
    entity_id: string;
    fiscal_code: string;
    source_system: string;
    file?: string;
    sheet?: string;
    unique_borrower_id: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;

    address_type?: string;
    address_category: string;
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
}

// Contact Types
export interface Contact {
    borrower_id: number;
    entity_id: string;
    fiscal_code: string;
    source_system: string;
    file?: string;
    sheet?: string;
    unique_borrower_id: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;

    phone_number?: string;
    email?: string;
    is_pec?: boolean;
    is_verified?: boolean;
}

// Bank Types
export interface Bank {
    borrower_id: number;
    entity_id: string;
    fiscal_code: string;
    source_system: string;
    file?: string;
    sheet?: string;
    unique_borrower_id: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;

    bank_abi?: string;
    bank_cab?: string;
    bank_name?: string;
    account_number?: string;
    account_type?: string;
}

// Job Types
export interface Job {
    borrower_id: number;
    entity_id: string;
    fiscal_code: string;
    source_system: string;
    file?: string;
    sheet?: string;
    unique_borrower_id: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;
    job_reference?: number;
    reference?: number;
    employer_name?: string;
    employer_tax_code?: string;
    employer_vat_number?: number;
    employer_phone?: string;
    monthly_income?: number;
    income_range?: string;
    pension_category?: string;
    start_date?: string;
    end_date?: string;
    work_activity_notes?: string;
    employer_fax?: string;
    legal_address_category?: string;
    legal_origin_province?: string;
    legal_origin_city?: string;
    legal_origin_street?: string;
    legal_address_type?: string;
    legal_street?: string;
    legal_locality?: string;
    legal_city?: string;
    legal_province?: string;
    legal_region?: string;
    legal_postcode?: string;
    legal_country?: string;
    legal_similar_score?: number;
    legal_address_notes?: string;

    operation_address_category?: string;
    operation_origin_province?: string;
    operation_origin_city?: string;
    operation_origin_street?: string;
    operation_address_type?: string;
    operation_street?: string;
    operation_locality?: string;
    operation_city?: string;
    operation_province?: string;
    operation_region?: string;
    operation_postcode?: string;
    operation_country?: string;
    operation_similar_score?: number;
    operation_address_notes?: string;

}

// Asset Types
export interface Asset {
    borrower_id: number;
    entity_id: string;
    fiscal_code: string;
    source_system: string;
    file?: string;
    sheet?: string;
    unique_borrower_id: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;

    address_type?: string;
    address_category: string;
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

    asset_sub?: number;
    asset_zona: string;
    asset_class?: string;
    asset_sheet?: string;
    asset_category?: string;
    asset_dimension?: string;
    asset_particle_sub?: string;
    asset_type?: string;
    cadastral_tax_base?: string;
    asset_ownership?: string;
    asset_compr_avg?: number;
    est_asset_value?: number;
    est_ownership_value?: number;

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