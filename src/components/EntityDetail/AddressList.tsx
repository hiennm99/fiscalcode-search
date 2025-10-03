// ============================================
// components/EntityDetail/AddressList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { addressApiService } from "../../services/addressApi.service.ts";
import type { Entity } from "../../types/entity.types";
import type { Address } from "../../types/related.types";
import { reformatAddress } from "../utils/reformatData.ts";

interface AddressListProps {
    entity: Entity;
}

export const AddressList: React.FC<AddressListProps> = ({ entity }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsLoading(true);
            try {
                const data = await addressApiService.getByEntityId(entity.entity_id);
                const formattedData = data.map((entry: Address) => reformatAddress(entry));
                setAddresses(formattedData);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, [entity.entity_id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="text-center py-16">
                <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No addresses found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {addresses.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-3 p-6 pb-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex pt-1">
                            <h3 className="text-base font-semibold text-gray-900">
                                {`Address ${index + 1}`}
                            </h3>
                        </div>
                    </div>

                    {/* 3 Columns Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:divide-x divide-gray-200 px-6 pb-6">
                        {/* Column 1: Address Information */}
                        <div className="lg:pr-6">
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="text-gray-900 italic">{entry.address_type || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Street:</span>
                                    <span className="text-gray-900 italic">{entry.street || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Postcode:</span>
                                    <span className="text-gray-900 italic">{entry.postcode || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">City:</span>
                                    <span className="text-gray-900 italic">{entry.city || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Province:</span>
                                    <span className="text-gray-900 italic">{entry.province || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Country:</span>
                                    <span className="text-gray-900 italic">{entry.country || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Origin Information */}
                        <div className="lg:px-6">
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Origin Street:</span>
                                    <span className="text-gray-900 italic">{entry.origin_street || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Origin City:</span>
                                    <span className="text-gray-900 italic">{entry.origin_city || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Origin Province:</span>
                                    <span className="text-gray-900 italic">{entry.origin_province || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Similarity:</span>
                                    <span className="text-gray-900 italic">
                                        {entry.similar_score ? `${entry.similar_score}%` : 'N/A'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Notes:</span>
                                    <span className="text-gray-900 italic">{entry.address_notes || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Metadata */}
                        <div>
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