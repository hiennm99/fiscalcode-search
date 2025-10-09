// ============================================
// components/EntityDetail/BankList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Building, Loader2 } from 'lucide-react';
import { bankApiService } from "../../services/bankApi.service.ts";
import type { Bank } from "../../types/related.types.ts";
import { reformatBank } from "../../utils/reformatData.ts";
import { useEntityStore } from "../../stores/entityStore.ts";

export const BankList: React.FC = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentEntityId = useEntityStore((state) => state.currentEntityId);

    useEffect(() => {
        const fetchBanks = async () => {
            if (!currentEntityId) {
                setBanks([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await bankApiService.getByEntityId(currentEntityId);
                const formattedData = data.map((entry: Bank) => reformatBank(entry));
                setBanks(formattedData);
            } catch (error) {
                console.error('Error fetching banks:', error);
                setBanks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBanks();
    }, [currentEntityId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (banks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No banks found for this entity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {banks.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:divide-x divide-gray-200 px-6 pb-6">
                        <div className="lg:pr-6">
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Bank Name:</span>
                                    <span className="text-gray-900 italic">{entry.bank_name || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">ABI:</span>
                                    <span className="text-gray-900 italic">{entry.bank_abi || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">CAB:</span>
                                    <span className="text-gray-900 italic">{entry.bank_cab || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:pl-6">
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Source:</span>
                                    <span className="text-gray-900 italic">{entry.source_system || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Created Date:</span>
                                    <span className="text-gray-900 italic">{entry.created_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Modified Date:</span>
                                    <span className="text-gray-900 italic">{entry.modified_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Extracted Date:</span>
                                    <span className="text-gray-900 italic">{entry.extracted_date || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};