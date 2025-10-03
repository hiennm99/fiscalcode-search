// ============================================
// components/EntitySearch/SearchBar.tsx
// ============================================
import React from 'react';
import { Search, X } from 'lucide-react';
import type { AutocompleteItem } from "../../types/entity.types.ts";

interface SearchBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    autocompleteResults: AutocompleteItem[];
    showAutocomplete: boolean;
    onAutocompleteSelect: (item: AutocompleteItem) => void;
    onAutocompleteDismiss: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
                                                        query,
                                                        onQueryChange,
                                                        autocompleteResults,
                                                        showAutocomplete,
                                                        onAutocompleteSelect,
                                                        onAutocompleteDismiss,
                                                    }) => {
    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name, fiscal code, or borrower ID..."
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    onFocus={() => autocompleteResults.length > 0 && onAutocompleteDismiss()}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {query && (
                    <button
                        onClick={() => onQueryChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {showAutocomplete && autocompleteResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {autocompleteResults.map((item, index) => {
                        // Tạo unique key từ nhiều nguồn để đảm bảo không trùng
                        const uniqueKey = item.entity_id || `${item.id || item.fiscal_code}-${index}`;

                        return (
                            <button
                                key={uniqueKey}
                                onClick={() => onAutocompleteSelect(item)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                <div className="font-medium text-gray-900">{item.name}</div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    {item.fiscal_code && <span>{item.fiscal_code}</span>}
                                    {item.source_system && (
                                        <>
                                            <span>•</span>
                                            <span className="text-gray-400">{item.source_system}</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};