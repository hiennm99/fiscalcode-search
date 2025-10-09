// ============================================
// components/EntitySearch/EntitySearch.tsx
// ============================================
import React, { useState, useMemo } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { useEntitySearch } from "../../hooks/useEntitySearch";
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { EntityCard } from './EntityCard';
import { Pagination } from './Pagination';
import type { Entity } from "../../types/entity.types";

export const EntitySearch: React.FC = () => {
    const {
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
    } = useEntitySearch();

    const {
        results: autocompleteResults,
        showDropdown: showAutocomplete,
        setShowDropdown,
    } = useAutocomplete(query);

    const [showFilters, setShowFilters] = useState(false);

    const handleAutocompleteSelect = (item: any) => {
        setQuery(item.name);
        setShowDropdown(false);
    };

    // ✅ Group entities by fiscal_code
    const groupedEntities = useMemo(() => {
        if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
            return [];
        }

        const grouped = new Map<string, Entity[]>();

        searchResults.results.forEach((entity) => {
            // Skip entities without fiscal_code
            if (!entity || !entity.fiscal_code) return;

            const fiscalCode = entity.fiscal_code;
            if (!grouped.has(fiscalCode)) {
                grouped.set(fiscalCode, []);
            }
            grouped.get(fiscalCode)!.push(entity);
        });

        // Filter out empty groups
        return Array.from(grouped.values()).filter(group => group.length > 0);
    }, [searchResults]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Entity Search</h1>
                    <p className="mt-2 text-gray-600">Search and filter entities from your database</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <SearchBar
                        query={query}
                        onQueryChange={setQuery}
                        autocompleteResults={autocompleteResults}
                        showAutocomplete={showAutocomplete}
                        onAutocompleteSelect={handleAutocompleteSelect}
                        onAutocompleteDismiss={() => setShowDropdown(false)}
                    />

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="mt-4 flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>

                    {/* Filters */}
                    {showFilters && (
                        <FilterPanel
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                        />
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                )}

                {/* Results */}
                {!isLoading && searchResults && (
                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            Found {groupedEntities.length} unique fiscal code{groupedEntities.length !== 1 ? 's' : ''}
                            {' '}({searchResults.found} total record{searchResults.found !== 1 ? 's' : ''})
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={searchResults.totalPages}
                            onPageChange={setCurrentPage}
                        />
                        <div className="mt-4 space-y-4">
                            {groupedEntities.map((entities, index) => (
                                <EntityCard
                                    key={entities[0].fiscal_code || `group-${index}`}
                                    entities={entities}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Empty State */}
                {!isLoading && searchResults && searchResults.results.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">
                            No results found. Try adjusting your search or filters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};