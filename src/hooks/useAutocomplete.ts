// ============================================
// hooks/useAutocomplete.ts
// ============================================
import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { entityApiService } from "../services/entityApi.service.ts";
import type { AutocompleteItem } from "../types/entity.types.ts";

export const useAutocomplete = (query: string, minLength: number = 2) => {
    const [results, setResults] = useState<AutocompleteItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const debouncedAutocomplete = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < minLength) {
                setResults([]);
                setShowDropdown(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await entityApiService.autocomplete(searchQuery);
                setResults(data);
                setShowDropdown(data.length > 0);
            } catch (error) {
                console.error('Autocomplete error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [minLength]
    );

    useEffect(() => {
        if (query) {
            debouncedAutocomplete(query);
        } else {
            setResults([]);
            setShowDropdown(false);
        }
    }, [query, debouncedAutocomplete]);

    return {
        results,
        isLoading,
        showDropdown,
        setShowDropdown,
    };
};
