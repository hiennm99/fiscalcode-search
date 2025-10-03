// ============================================
// services/bankApi.service.ts
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Bank } from '../types/related.types';
import type { SearchParams, RelatedSearchOptions, RelatedSearchResult } from "../types/typesense.types.ts";

const COLLECTION_NAME = 'banks';

class BankApiService {
    /**
     * Search banks by source_system and unique_borrower_id from entity
     */
    async searchByBorrower(options: RelatedSearchOptions): Promise<RelatedSearchResult<Bank>> {
        const { sourceSystem, uniqueId, page = 1, perPage = 20, sortBy } = options;

        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'email,phone_number',
                filter_by: `source_system:=${sourceSystem} && unique_borrower_id:=${uniqueId}`,
                per_page: perPage,
                page: page,
                sort_by: sortBy || 'borrower_id:desc'
            };

            const searchResult = await typesenseClient
                .collections(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            const results: Bank[] = searchResult.hits?.map((hit: any) => hit.document) || [];
            const found = searchResult.found || 0;
            const totalPages = Math.ceil(found / perPage);

            return {
                results,
                found,
                page,
                totalPages
            };
        } catch (error) {
            console.error('Typesense bank search error:', error);
            throw new Error('Bank search failed');
        }
    }

    /**
     * Get banks by entity_id
     */
    async getByEntityId(entityId: string): Promise<Bank[]> {
        try {
            const searchResult = await typesenseClient
                .collections(COLLECTION_NAME)
                .documents()
                .search({
                    q: '*',
                    query_by: 'email,phone_number',
                    filter_by: `entity_id:=${entityId}`,
                    per_page: 100
                }, {});

            return searchResult.hits?.map((hit: any) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const bankApiService = new BankApiService();