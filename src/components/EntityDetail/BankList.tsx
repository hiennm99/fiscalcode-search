// ============================================
// components/EntityDetail/BankList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Building, Loader2 } from 'lucide-react';
import { bankApiService } from "../../services/bankApi.service.ts";
import type { Entity } from "../../types/entity.types";
import type { Bank } from "../../types/related.types";
import { reformatBank } from "../utils/reformatData.ts";

interface BankListProps {
    entity: Entity;
}

export const BankList: React.FC<BankListProps> = ({ entity }) => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBanks = async () => {
            setIsLoading(true);
            try {
                const data = await bankApiService.getByEntityId(entity.entity_id);
                const formattedData = data.map((entry: Bank) => reformatBank(entry));
                setBanks(formattedData);
            } catch (error) {
                console.error('Error fetching banks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanks();
    }, [entity.entity_id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (banks.length === 0) {
        return (
            <div className="text-center py-16">
                <Building className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No bank information found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {banks.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200">
                    {/* Header with Icon and Title */}
                    <div className="flex items-start gap-3 p-6 pb-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-base font-semibold text-gray-900">
                                {entry.bank_name || `Bank ${index + 1}`}
                            </h3>
                        </div>
                    </div>

                    {/* 2 Columns Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x divide-gray-200 px-6 pb-6">
                        {/* Column 1: Bank Information */}
                        <div className="lg:pr-6">
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Bank Name:</span>
                                    <span className="text-gray-900">{entry.bank_name || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">ABI:</span>
                                    <span className="text-gray-900">{entry.bank_abi || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">CAB:</span>
                                    <span className="text-gray-900">{entry.bank_cab || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Bank Name:</span>
                                    <span className="text-gray-900">{entry.bank_name || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Metadata */}
                        <div className="lg:pl-6">
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Source:</span>
                                    <span className="text-gray-900">{entry.source_system || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Created Date:</span>
                                    <span className="text-gray-900">{entry.created_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Modified Date:</span>
                                    <span className="text-gray-900">{entry.modified_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Extracted Date:</span>
                                    <span className="text-gray-900">{entry.extracted_date || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};