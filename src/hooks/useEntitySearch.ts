// ============================================
// hooks/useEntitySearch.ts
// ============================================
import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { entityApiService } from "../services/entityApi.service.ts";
import type { SearchFilters, SearchResult } from "../types/typesense.types.ts";

export const useEntitySearch = () => {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [filters, setFilters] = useState<SearchFilters>({});
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string, searchFilters: SearchFilters, page: number) => {
            if (!searchQuery && Object.keys(searchFilters).length === 0) {
                setSearchResults(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const data = await entityApiService.search({
                    query: searchQuery || '*',
                    filters: searchFilters,
                    page,
                    perPage: 20,
                });
                setSearchResults(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed');
                console.error('Search error:', err);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSearch(query, filters, currentPage);
    }, [query, filters, currentPage, debouncedSearch]);

    const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value === '' ? undefined : value,
        }));
        setCurrentPage(1);
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
        setCurrentPage(1);
    }, []);

    const resetSearch = useCallback(() => {
        setQuery('');
        setFilters({});
        setCurrentPage(1);
        setSearchResults(null);
        setError(null);
    }, []);

    return {
        query,
        setQuery,
        searchResults,
        filters,
        handleFilterChange,
        clearFilters,
        isLoading,
        error,
        currentPage,
        setCurrentPage,
        resetSearch,
    };
};