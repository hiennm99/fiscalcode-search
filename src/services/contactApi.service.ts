// ============================================
// services/contactApi.service.ts (Fixed)
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Contact } from '../types/related.types';
import type { SearchParams } from "../types/typesense.types.ts";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

const COLLECTION_NAME = 'contacts';

class ContactApiService {
    async getByFiscalCode(fiscalCode: string): Promise<Contact[]> { // Fixed return type
        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'email,phone_number',
                filter_by: `fiscal_code:=${fiscalCode}`,
                per_page: 250,
                page: 1
            };

            const searchResult = await typesenseClient
                .collections<Contact>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Contact>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByFiscalCode error:', error);
            return [];
        }
    }

    async getByEntityId(entityId: string): Promise<Contact[]> {
        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'email,phone_number',
                filter_by: `entity_id:=${entityId}`,
                per_page: 250,
                page: 1
            };

            const searchResult = await typesenseClient
                .collections<Contact>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Contact>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const contactApiService = new ContactApiService();