// ============================================
// services/contactApi.service.ts
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Contact } from '../types/related.types';
import type { SearchParams } from "../types/typesense.types.ts";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

const COLLECTION_NAME = 'contacts';

class ContactApiService {
    /**
     * Get contacts by entity_id
     */
    async getByEntityId(entityId: string): Promise<Contact[]> {
        try {
            const searchResult = await typesenseClient
                .collections<Contact>(COLLECTION_NAME)
                .documents()
                .search<SearchParams>({
                    q: '*',
                    query_by: 'email,phone_number',
                    filter_by: `entity_id:=${entityId}`,
                    per_page: 100
                }, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Contact>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const contactApiService = new ContactApiService();