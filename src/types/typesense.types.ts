import type {Entity} from "./entity.types.ts";

export interface TypesenseHit<T> {
    document: T;
}

export interface AutocompleteItem {
    entity_id: string;
    id: string;
    name: string;
    fiscal_code?: string;
    source_system?: string;
}

export interface SearchFilters {
    is_company?: boolean;
    gender?: string;
    is_deceased?: boolean;
    source_system?: string;
    borrower_type_id?: number;
    country_of_birth?: string;
    city_of_birth?: string;
    province_of_birth?: string;
}

export interface SearchParams {
    q: string;
    query_by: string;
    per_page?: number;
    page?: number;
    filter_by?: string;
    sort_by?: string;
    include_fields?: string;
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