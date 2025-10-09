// ============================================
// services/entityApi.service.ts (Updated)
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Entity } from '../types/entity.types';
import type {
    SearchOptions,
    SearchResult,
    SearchFilters,
    SearchParams
} from '../types/typesense.types';
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents.js';

const COLLECTION_NAME = 'entities';

class EntityApiService {
    private buildFilterString(filters: SearchFilters): string {
        const filterParts: string[] = [];

        if (filters.is_company !== undefined) {
            filterParts.push(`is_company:=${filters.is_company}`);
        }
        if (filters.gender) {
            filterParts.push(`gender:=${filters.gender}`);
        }
        if (filters.source_system) {
            filterParts.push(`source_system:=${filters.source_system}`);
        }
        if (filters.borrower_type_id) {
            filterParts.push(`borrower_type_id:=${filters.borrower_type_id}`);
        }

        return filterParts.join(' && ');
    }

    private buildSearchQuery(query: string | undefined, filters: SearchFilters): { q: string; query_by: string } {
        const searchTerms: string[] = [];
        const queryByFields: string[] = ['name', 'fiscal_code'];

        if (query && query.trim() !== '' && query !== '*') {
            searchTerms.push(query);
        }

        if (filters.country_of_birth) {
            searchTerms.push(filters.country_of_birth);
            if (!queryByFields.includes('country_of_birth')) {
                queryByFields.push('country_of_birth');
            }
        }
        if (filters.province_of_birth) {
            searchTerms.push(filters.province_of_birth);
            if (!queryByFields.includes('province_of_birth')) {
                queryByFields.push('province_of_birth');
            }
        }
        if (filters.city_of_birth) {
            searchTerms.push(filters.city_of_birth);
            if (!queryByFields.includes('city_of_birth')) {
                queryByFields.push('city_of_birth');
            }
        }

        return {
            q: searchTerms.length > 0 ? searchTerms.join(' ') : '*',
            query_by: queryByFields.join(',')
        };
    }

    async search(options: SearchOptions): Promise<SearchResult> {
        const { query, filters = {}, page = 1, perPage = 20, sortBy } = options;

        try {
            // ✅ Fetch more results to account for pagination after grouping
            const fetchPerPage = perPage * 5; // Increase multiplier for better pagination
            const { q, query_by } = this.buildSearchQuery(query, filters);

            const searchParams: SearchParams = {
                q: q,
                query_by: query_by,
                per_page: fetchPerPage,
                page: 1, // Always fetch from page 1, we'll paginate after grouping
            };

            const filterString = this.buildFilterString(filters);
            if (filterString) {
                searchParams.filter_by = filterString;
            }

            if (sortBy) {
                searchParams.sort_by = sortBy;
            } else {
                searchParams.sort_by = 'borrower_id:desc';
            }

            const searchResult = await typesenseClient
                .collections<Entity>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            // ✅ Return raw results without merging - let frontend handle grouping
            const rawResults: Entity[] = searchResult.hits?.map(
                (hit: SearchResponseHit<Entity>) => hit.document
            ) || [];

            // ✅ Simple pagination on raw results
            const totalFound = searchResult.found || 0;
            const totalPages = Math.ceil(totalFound / perPage);

            return {
                results: rawResults, // Return all entities as-is
                found: totalFound,
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
            const searchParams: SearchParams = {
                q: query,
                query_by: 'name,fiscal_code',
                per_page: limit * 2,
                include_fields: 'entity_id,name,fiscal_code,source_system',
            };

            const searchResult = await typesenseClient
                .collections<Entity>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            const rawResults = (searchResult.hits?.map((hit: SearchResponseHit<Entity>) => hit.document) || []) as Entity[];

            // ✅ Group by fiscal_code for autocomplete
            const uniqueResults = new Map<string, {
                id: string;
                name: string;
                fiscal_code: string;
                source_system: string;
            }>();

            rawResults.forEach(doc => {
                if (!uniqueResults.has(doc.fiscal_code)) {
                    uniqueResults.set(doc.fiscal_code, {
                        id: doc.fiscal_code,
                        name: doc.name,
                        fiscal_code: doc.fiscal_code,
                        source_system: doc.source_system
                    });
                } else {
                    const existing = uniqueResults.get(doc.fiscal_code)!;
                    if (!existing.source_system.includes(doc.source_system)) {
                        existing.source_system += `, ${doc.source_system}`;
                    }
                }
            });

            return Array.from(uniqueResults.values()).slice(0, limit);
        } catch (error) {
            console.error('Typesense autocomplete error:', error);
            return [];
        }
    }

    async getByFiscalCode(fiscalCode: string): Promise<Entity> {
        try {
            const searchParams: SearchParams = {
                q: fiscalCode,
                query_by: 'fiscal_code',
                filter_by: `fiscal_code:=${fiscalCode}`,
                per_page: 100
            };

            const searchResult = await typesenseClient
                .collections(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            if (searchResult.hits && searchResult.hits.length > 0) {
                const entities = searchResult.hits.map((hit) => hit.document) as Entity[];

                // ✅ If multiple sources, return first entity with all_sources array
                if (entities.length > 1) {
                    const primary = entities[0];
                    return {
                        ...primary,
                        is_merged: true,
                        source_count: entities.length,
                        all_sources: entities
                    };
                }

                return entities[0];
            }

            throw new Error('Entity not found');
        } catch (error) {
            console.error('Typesense getByFiscalCode error:', error);
            throw new Error('Failed to fetch entity');
        }
    }

    async getById(entityId: string): Promise<Entity> {
        try {
            // ✅ First, try to get by entity_id directly
            const searchParams: SearchParams = {
                q: entityId,
                query_by: 'entity_id',
                filter_by: `entity_id:=${entityId}`,
                per_page: 1
            };

            const searchResult = await typesenseClient
                .collections(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            if (searchResult.hits && searchResult.hits.length > 0) {
                const entity = searchResult.hits[0].document as Entity;

                // ✅ Check if there are other entities with same fiscal_code
                const fiscalCodeSearch = await this.getByFiscalCode(entity.fiscal_code);

                return fiscalCodeSearch; // Returns with all_sources if multiple exist
            }

            throw new Error('Entity not found');
        } catch (error) {
            console.error('Typesense getById error:', error);
            throw new Error('Failed to fetch entity');
        }
    }

    async searchByLoan(options: {
        sourceSystem: string;
        uniqueId: string;
        borrowerTypeId: number;
        page?: number;
        perPage?: number;
        sortBy?: string;
    }): Promise<{
        results: Entity[];
        found: number;
        page: number;
        totalPages: number;
    }> {
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

            const results: Entity[] = (searchResult.hits?.map((hit: SearchResponseHit<Entity>) => hit.document) || []) as Entity[];
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