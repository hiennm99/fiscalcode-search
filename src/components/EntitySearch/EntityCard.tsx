// ============================================
// components/EntitySearch/EntityCard.tsx
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Building2, Eye } from 'lucide-react';
import type { Entity } from "../../types/entity.types";
import { format } from "date-fns";
import { reformatEntity } from "../utils/reformatData.ts";

interface EntityCardProps {
    entity: Entity;
}

export const EntityCard: React.FC<EntityCardProps> = ({ entity }) => {
    const formattedEntityInfo = reformatEntity(entity);
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200">
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
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{formattedEntityInfo.name}</h3>
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
                                    <span className="ml-2 text-gray-900 font-medium">{formattedEntityInfo.fiscal_code}</span>
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
                                    <span className="ml-2 text-gray-900">{format(new Date(formattedEntityInfo.date_of_birth), "yyyy-MM-dd")}</span>
                                </div>
                            )}

                            {formattedEntityInfo.place_of_birth && (
                                <div className="md:col-span-2 truncate">
                                    <span className="text-gray-500">Place of Birth:</span>
                                    <span className="ml-2 text-gray-900">{formattedEntityInfo.place_of_birth}</span>
                                </div>
                            )}

                            <div>
                                <span className="text-gray-500">Source System:</span>
                                <span className="ml-2 text-gray-900">{formattedEntityInfo.source_system}</span>
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
    );
};