// ============================================
// components/EntitySearch/FilterPanel.tsx
// ============================================
import React from 'react';
import type { SearchFilters } from "../../types/typesense.types.ts";

interface FilterPanelProps {
    filters: SearchFilters;
    onFilterChange: (key: keyof SearchFilters, value: any) => void;
    onClearFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
                                                            filters,
                                                            onFilterChange,
                                                            onClearFilters,
                                                        }) => {
    return (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/*Source System Filter*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Source System</label>
                    <select
                        value={filters.source_system || ''}
                        onChange={(e) => onFilterChange('source_system', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">All</option>
                        <option value="cadastral">Cadastral App</option>
                        <option value="recovery">Recovery App</option>
                        <option value="massive">Massive App</option>
                        <option value="mapped_files">Excel Files</option>
                    </select>
                </div>

                {/*Entity Type Filter*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Entity Type
                    </label>
                    <select
                        value={filters.is_company === undefined ? '' : filters.is_company.toString()}
                        onChange={(e) =>
                            onFilterChange(
                                'is_company',
                                e.target.value === '' ? undefined : e.target.value === 'true'
                            )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">All</option>
                        <option value="false">Individual</option>
                        <option value="true">Company</option>
                    </select>
                </div>

                {/*Gender Filter*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                        value={filters.gender || ''}
                        onChange={(e) => onFilterChange('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">All</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/*Country of Birth Filter*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country of Birth
                    </label>
                    <input
                        type="text"
                        value={filters.country_of_birth || ''}
                        onChange={(e) => onFilterChange('country_of_birth', e.target.value)}
                        placeholder="e.g., Italia"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/*Province of Birth Filter*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province of Birth</label>
                    <input
                        type="text"
                        value={filters.province_of_birth || ''}
                        onChange={(e) => onFilterChange('province_of_birth', e.target.value)}
                        placeholder="e.g., PO"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/*City of Birth Filter*/}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                        type="text"
                        value={filters.city_of_birth || ''}
                        onChange={(e) => onFilterChange('city_of_birth', e.target.value)}
                        placeholder="e.g., Milano"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

            </div>

            {Object.keys(filters).length > 0 && (
                <button
                    onClick={onClearFilters}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                    Clear All Filters
                </button>
            )}
        </div>
    );
};
