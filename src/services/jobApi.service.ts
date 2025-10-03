// ============================================
// services/jobApi.service.ts
// ============================================
import { typesenseClient } from "../lib/typesense.ts";
import type { Job} from '../types/related.types';
import type { SearchParams } from "../types/typesense.types.ts";
import type { SearchResponseHit } from "typesense/lib/Typesense/Documents";

const COLLECTION_NAME = 'jobs';

class JobApiService {
    /**
     * Get jobs by entity_id
     */
    async getByEntityId(entityId: string): Promise<Job[]> {
        try {
            const searchResult = await typesenseClient
                .collections<Job>(COLLECTION_NAME)
                .documents()
                .search<SearchParams>({
                    q: '*',
                    query_by: 'job_employer_name',
                    filter_by: `entity_id:=${entityId}`,
                    per_page: 100
                }, {});

            return searchResult.hits?.map((hit: SearchResponseHit<Job>) => hit.document) || [];
        } catch (error) {
            console.error('Typesense getByEntityId error:', error);
            return [];
        }
    }
}

export const jobApiService = new JobApiService();