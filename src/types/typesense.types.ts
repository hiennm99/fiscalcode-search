import type {Entity} from "./entity.types.ts";

export interface TypesenseHit<T> {
    document: T;
}
export interface AutocompleteItem {
    entity_id: string;  // Thêm entity_id duy nhất
    id: string;  // Giữ lại để backward compatible
    name: string;
    fiscal_code?: string;
    source_system?: string;  // Thêm để hiển thị nguồn
}

export interface SearchFilters {
    is_company?: boolean;
    gender?: string;
    is_deceased?: boolean;
    source_system?: string;
    borrower_type_id?: number;
    country_of_birth?: string;
    region_of_birth?: string;
    province_of_birth?: string;
}


export interface SearchParams {
    q: string;
    filter_by?: string;
    sort_by?: string;
    query_by: string;
    per_page: number;
    page: number;
}

export interface SearchOptions {
    query: string;
    filters?: SearchFilters;
    page?: number;
    perPage?: number;
    sortBy?: string;
}

export interface SearchResult {
    results: Entity[];
    found: number;
    page: number;
    totalPages: number;
    facets: FacetCount[];
}

export interface FacetCount {
    field_name: string;
    counts: Array<{
        value: string;
        count: number;
    }>;
}