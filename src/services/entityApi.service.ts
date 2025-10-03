// ============================================
// services/entityApi.service.ts
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Entity } from '../types/entity.types';
import type {
    SearchOptions,
    SearchParams,
    SearchResult,
    SearchFilters
} from '../types/typesense.types';
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';
import type { RelatedSearchOptions, RelatedSearchResult } from "../types/related.types.ts";

const COLLECTION_NAME = 'entities';

class EntityApiService {
    /**
     * Build filter string from SearchFilters
     */
    private buildFilterString(filters: SearchFilters): string {
        const filterParts: string[] = [];

        if (filters.is_company !== undefined) {
            filterParts.push(`is_company:=${filters.is_company}`);
        }

        if (filters.gender) {
            filterParts.push(`gender:=${filters.gender}`);
        }

        if (filters.is_deceased !== undefined) {
            filterParts.push(`is_deceased:=${filters.is_deceased}`);
        }

        if (filters.source_system) {
            filterParts.push(`source_system:=${filters.source_system}`);
        }

        if (filters.borrower_type_id) {
            filterParts.push(`borrower_type_id:=${filters.borrower_type_id}`);
        }

        if (filters.country_of_birth) {
            filterParts.push(`country_of_birth:=${filters.country_of_birth}`);
        }

        if (filters.region_of_birth) {
            filterParts.push(`region_of_birth:=${filters.region_of_birth}`);
        }

        if (filters.province_of_birth) {
            filterParts.push(`province_of_birth:=${filters.province_of_birth}`);
        }

        return filterParts.join(' && ');
    }

    async search(options: SearchOptions): Promise<SearchResult> {
        const { query, filters = {}, page = 1, perPage = 20, sortBy } = options;

        try {
            const searchParams: SearchParams  = {
                q: query || '*',
                query_by: 'name,fiscal_code,unique_borrower_id',
                per_page: perPage,
                page: page,
            };

            // Add filters if any
            const filterString = this.buildFilterString(filters);
            if (filterString) {
                searchParams.filter_by = filterString;
            }

            // Add sorting if specified
            if (sortBy) {
                searchParams.sort_by = sortBy;
            } else {
                // Default sort by borrower_id descending
                searchParams.sort_by = 'borrower_id:desc';
            }

            // Perform search
            const searchResult = await typesenseClient
                .collections<Entity>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            // Transform Typesense response to our format
            const results: Entity[] = searchResult.hits?.map(
                (hit: SearchResponseHit<Entity>) => hit.document
            ) || [];
            const found = searchResult.found || 0;
            const totalPages = Math.ceil(found / perPage);

            return {
                results,
                found,
                page,
                totalPages,
                facets: searchResult.facet_counts ?? [],
            };
        } catch (error) {
            console.error('Typesense search error:', error);
            throw new Error('Search failed');
        }
    }

    async autocomplete(query: string, limit: number = 10): Promise<{ name: string; fiscal_code: string }[]> {
        if (!query || query.length < 2) {
            return [];
        }

        try {
            const searchResult = await typesenseClient
                .collections<Entity>(COLLECTION_NAME)
                .documents()
                .search({
                    q: query,
                    query_by: 'name,fiscal_code',
                    per_page: limit,
                    // Chỉ lấy các field cần thiết cho autocomplete
                    include_fields: 'entity_id,name,fiscal_code'
                }, {});

                return searchResult.hits?.map((hit: SearchResponseHit<Entity>) => ({
                    id: hit.document.entity_id,
                    name: hit.document.name,
                    fiscal_code: hit.document.fiscal_code
                })) || [];
        } catch (error) {
            console.error('Typesense autocomplete error:', error);
            return [];
        }
    }

    async getById(entityId: string): Promise<Entity> {
        try {
            // Typesense không có document ID, phải search by entity_id
            const searchResult = await typesenseClient
                .collections(COLLECTION_NAME)
                .documents()
                .search({
                    q: entityId,
                    query_by: 'entity_id',
                    filter_by: `entity_id:=${entityId}`,
                    per_page: 1
                }, {});

            if (searchResult.hits && searchResult.hits.length > 0) {
                return searchResult.hits[0].document as Entity;
            }

            throw new Error('Entity not found');
        } catch (error) {
            console.error('Typesense getById error:', error);
            throw new Error('Failed to fetch entity');
        }
    }

    async searchByLoan(options: RelatedSearchOptions): Promise<RelatedSearchResult<Entity>> {
        const { sourceSystem, uniqueId, borrowerTypeId, page = 1, perPage = 20, sortBy } = options;

        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'name',
                filter_by: `source_system:=${sourceSystem} && unique_loan_id:=${uniqueId} && borrower_type_id:=${borrowerTypeId}`,
                per_page: perPage,
                page: page,
                sort_by: sortBy || 'borrower_id:desc'
            };

            const searchResult = await typesenseClient
                .collections<Entity>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            const results: Entity[] = searchResult.hits?.map((hit: SearchResponseHit<Entity>) => hit.document) || [];
            const found = searchResult.found || 0;
            const totalPages = Math.ceil(found / perPage);

            return {
                results,
                found,
                page,
                totalPages
            };
        } catch (error) {
            console.error('Typesense guarantor search error:', error);
            throw new Error('Guarantor search failed');
        }
    }
}

export const entityApiService = new EntityApiService();