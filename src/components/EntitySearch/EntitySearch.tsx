// ============================================
// components/EntitySearch/EntitySearch.tsx
// ============================================
import React, { useState } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import { useEntitySearch } from "../../hooks/useEntitySearch";
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { SearchBar } from './SearchBar';
import { FilterPanel } from './FilterPanel';
import { EntityCard } from './EntityCard';
import { Pagination } from './Pagination';

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
                            Found {searchResults.found} result{searchResults.found !== 1 ? 's' : ''}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={searchResults.totalPages}
                            onPageChange={setCurrentPage}
                        />
                        <div className="mt-4 space-y-4">
                            {searchResults.results.map((entity) => (
                                <EntityCard
                                    key={entity.entity_id}
                                    entity={entity}
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