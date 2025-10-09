// ============================================
// types/entity.types.ts (Updated)
// ============================================
export interface Entity {
    entity_id: string;
    name: string;
    fiscal_code: string;
    unique_loan_id: string;
    borrower_id: number;
    unique_borrower_id: string;
    borrower_type_id: number;
    investigation_info_id: string;
    is_company: boolean;
    is_deceased?: boolean;
    gender: string;
    date_of_birth?: string;
    date_of_death?: string | null;
    country_of_birth: string;
    region_of_birth: string;
    province_of_birth: string;
    city_of_birth: string;
    place_of_birth?: string;
    is_verified?: boolean;
    borrower_ndg?: string;
    borrower_ref?: string;
    borrower_gbv?: string;
    guarantor_type?: string;
    guarantor_limit?: string;
    vat_number?: string;
    dbt_data?: string;
    originator?: string;
    credit_type?: string;
    source_system: string;
    source_details: string;
    file?: string;
    sheet?: string;
    entity_notes: string;
    created_date: string;
    modified_date: string;
    extracted_date: string;
    // New fields for merged entities
    is_merged?: boolean;
    source_count?: number;
    original_entity_ids?: string[];
    all_sources?: Entity[];
}
