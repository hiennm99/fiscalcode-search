// ============================================
// components/EntityDetail/EredeList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { entityApiService } from "../../services/entityApi.service.ts";
import type { Entity } from "../../types/entity.types";
import type { Erede } from "../../types/related.types";
import {BORROWER_TYPES} from "../../constants";
import {Link} from "react-router";

interface EredeListProps {
    entity: Entity;
}

const currentRole = BORROWER_TYPES['EREDE'];


export const EredeList: React.FC<EredeListProps> = ({ entity }) => {
    const [Eredes, setEredes] = useState<Erede[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await entityApiService.searchByLoan({
                    sourceSystem: entity.source_system,
                    uniqueId: entity.unique_loan_id,
                    borrowerTypeId: currentRole,
                    page: 1,
                    perPage: 20
                });

                setEredes(data.results);

            } catch (error) {
                console.error('Error fetching guarantors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Chỉ fetch khi có đủ thông tin VÀ entity hiện tại không phải là guarantor
        if (entity.source_system && entity.unique_loan_id && entity.borrower_type_id !== 5) {
            fetchData();
        }
    }, [entity.source_system, entity.unique_loan_id, entity.borrower_type_id]);

    // Nếu entity hiện tại là guarantor (type 5), không hiển thị section này
    if (entity.borrower_type_id === currentRole) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (Eredes.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No erede borrower found for this entity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {Eredes.map((entity, index) => (
                <Link
                    key={index}
                    to={`/entity/${entity.entity_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-lg hover:border-blue-500 border border-transparent transition-all duration-200 cursor-pointer"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <Shield className="w-6 h-6 text-indigo-600"/>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                {entity.name || 'Guarantor'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-gray-500">Fiscal Code:</span>
                                    <span className="ml-2 text-gray-900">{entity.fiscal_code || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Source:</span>
                                    <span className="ml-2 text-gray-900">{entity.source_system}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}