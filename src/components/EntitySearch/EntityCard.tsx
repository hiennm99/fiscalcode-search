// ============================================
// components/EntitySearch/EntityCard.tsx
// ============================================
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Eye, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import type { Entity } from "../../types/entity.types";
import { format } from "date-fns";
import { reformatEntity } from "../../utils/reformatData.ts";
import { toTitleCase } from "../../utils/reformatData.ts";

interface EntityCardProps {
    entities: Entity[]; // Array of entities with same fiscal_code
}

export const EntityCard: React.FC<EntityCardProps> = ({ entities }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showSourceSelector, setShowSourceSelector] = useState(false);

    // ✅ Validation: ensure entities array is valid
    if (!entities || entities.length === 0) {
        return null;
    }

    const selectedEntity = entities[selectedIndex];
    const formattedEntityInfo = reformatEntity(selectedEntity);
    const hasMultipleSources = entities.length > 1;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Main Card Content */}
            <div className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <div
                            className={`p-3 rounded-lg ${formattedEntityInfo.is_company ? 'bg-blue-100' : 'bg-green-100'}`}
                        >
                            {formattedEntityInfo.is_company ? (
                                <Building2 className="w-6 h-6 text-blue-600" />
                            ) : (
                                <User className="w-6 h-6 text-green-600" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                    {formattedEntityInfo.name}
                                </h3>

                                {/* Multiple Sources Badge */}
                                {hasMultipleSources && (
                                    <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded whitespace-nowrap flex items-center gap-1">
                                        <Layers className="w-3 h-3" />
                                        {entities.length} Sources
                                    </span>
                                )}

                                {formattedEntityInfo.is_deceased && (
                                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded whitespace-nowrap">
                                        Deceased
                                    </span>
                                )}
                                {formattedEntityInfo.is_company && (
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded whitespace-nowrap">
                                        Company
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {formattedEntityInfo.fiscal_code && (
                                    <div className="truncate">
                                        <span className="text-gray-500">Fiscal Code:</span>
                                        <span className="ml-2 text-gray-900 font-medium">
                                            {formattedEntityInfo.fiscal_code}
                                        </span>
                                    </div>
                                )}

                                {!formattedEntityInfo.is_company && formattedEntityInfo.gender && (
                                    <div>
                                        <span className="text-gray-500">Gender:</span>
                                        <span className="ml-2 text-gray-900">{formattedEntityInfo.gender}</span>
                                    </div>
                                )}

                                {formattedEntityInfo.date_of_birth && (
                                    <div>
                                        <span className="text-gray-500">Date of Birth:</span>
                                        <span className="ml-2 text-gray-900">
                                            {format(new Date(formattedEntityInfo.date_of_birth), "yyyy-MM-dd")}
                                        </span>
                                    </div>
                                )}

                                {formattedEntityInfo.place_of_birth && (
                                    <div className="md:col-span-2 truncate">
                                        <span className="text-gray-500">Place of Birth:</span>
                                        <span className="ml-2 text-gray-900">
                                            {formattedEntityInfo.place_of_birth}
                                        </span>
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <span className="text-gray-500">Source System:</span>
                                    <span className="ml-2 text-gray-900 font-medium">
                                        {toTitleCase(formattedEntityInfo.source_system)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        to={`/entity/${formattedEntityInfo.entity_id}`}
                        className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                    </Link>
                </div>
            </div>

            {/* Source Selector - Show only if multiple sources */}
            {hasMultipleSources && (
                <div className="border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => setShowSourceSelector(!showSourceSelector)}
                        className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Switch Data Source ({entities.length} available)
                        </span>
                        {showSourceSelector ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {showSourceSelector && (
                        <div className="px-6 pb-4 pt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {entities.map((entity, index) => {
                                const isSelected = selectedIndex === index;
                                return (
                                    <button
                                        key={entity.entity_id}
                                        onClick={() => {
                                            setSelectedIndex(index);
                                            setShowSourceSelector(false);
                                        }}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isSelected
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span>{toTitleCase(entity.source_system)}</span>
                                            <span className="text-xs opacity-75">
                                                ID: {entity.entity_id.slice(0, 8)}...
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};