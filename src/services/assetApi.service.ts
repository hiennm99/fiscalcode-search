// ============================================
// services/AssetApi.service.ts (Fixed)
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Asset } from '../types/related.types';
import type { SearchParams } from "../types/typesense.types.ts";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

const COLLECTION_NAME = 'assets';

class AssetApiService {
    async getByFiscalCode(fiscalCode: string): Promise<Asset[]> {
        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'street,city',
                filter_by: `fiscal_code:=${fiscalCode}`,
                per_page: 250,
                page: 1
            };

            const searchResult = await typesenseClient
                .collections<Asset>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Asset>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByFiscalCode error:', error);
            return [];
        }
    }

    async getByEntityId(entityId: string): Promise<Asset[]> {
        try {
            const searchParams: SearchParams = {
                q: '*',
                query_by: 'employer_name',
                filter_by: `entity_id:=${entityId}`,
                per_page: 250,
                page: 1
            };

            const searchResult = await typesenseClient
                .collections<Asset>(COLLECTION_NAME)
                .documents()
                .search(searchParams, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Asset>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const assetApiService = new AssetApiService();