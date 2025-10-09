// ============================================
// services/addressApi.service.ts (Fixed)
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Address } from '../types/related.types';
import type { SearchParams } from "../types/typesense.types.ts";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

const COLLECTION_NAME = 'addresses';

class AddressApiService {
    async getByFiscalCode(fiscalCode: string): Promise<Address[]> {
        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'street,city,province',
                filter_by: `fiscal_code:=${fiscalCode}`,
                per_page: 250,
                page: 1
            };

            const searchResult = await typesenseClient
                .collections<Address>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Address>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByFiscalCode error:', error);
            return [];
        }
    }

    async getByEntityId(entityId: string): Promise<Address[]> {
        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'street,city,province',
                filter_by: `entity_id:=${entityId}`,
                per_page: 250,
                page: 1
            };

            const searchResult = await typesenseClient
                .collections<Address>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Address>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const addressApiService = new AddressApiService();