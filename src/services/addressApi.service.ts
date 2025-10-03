// ============================================
// services/addressApi.service.ts
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Address } from '../types/related.types';
import type { SearchParams } from "../types/typesense.types.ts";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

const COLLECTION_NAME = 'addresses';

class AddressApiService {
    /**
     * Get addresses by entity_id
     */
    async getByEntityId(entityId: string): Promise<Address[]> {
        try {
            const searchResult = await typesenseClient
                .collections<Address>(COLLECTION_NAME)
                .documents()
                .search<SearchParams>({
                    q: '*',
                    query_by: 'street,city',
                    filter_by: `entity_id:=${entityId}`,
                    per_page: 100
                },{});

            return searchResult.hits?.map((hit: SearchResponseHit<Address>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const addressApiService = new AddressApiService();