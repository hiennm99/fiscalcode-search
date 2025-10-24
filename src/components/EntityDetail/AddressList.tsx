// ============================================
// components/EntityDetail/AddressList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { addressApiService } from "../../services/addressApi.service.ts";
import type { Address } from "../../types/related.types.ts";
import { reformatAddress } from "../../utils/reformatData.ts";
import { useEntityStore } from "../../stores/entityStore.ts"; // Import Zustand store

export const AddressList: React.FC = () => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentEntityId = useEntityStore((state) => state.currentEntityId);

    useEffect(() => {
        const fetchData = async () => {
            // ✅ Nếu không có entity_id thì không fetch
            if (!currentEntityId) {
                setAddresses([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await addressApiService.getByEntityId(currentEntityId);
                const formattedData = data.map((entry: Address) => reformatAddress(entry));
                setAddresses(formattedData);
            } catch (error) {
                console.error('Error fetching addresses:', error);
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentEntityId]); // ✅ Chỉ phụ thuộc vào currentEntityId

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No addresses found for this entity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {addresses.map((entry, index) => (
                <AddressCard key={index} entry={entry} index={index} />
            ))}
        </div>
    );
};

// Separate component for address card
const AddressCard: React.FC<{ entry: Address; index: number }> = ({ entry, index }) => (
    <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-start gap-3 p-6 pb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold text-gray-900">
                    Address {index + 1}
                </h3>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:divide-x divide-gray-200 px-6 pb-6">
            {/*Origin Address Details*/}
            <div className="lg:px-6">
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Address Category:</span>
                        <span className="text-gray-900 italic">{entry.address_category || 'N/A'}</span>
                    </div>
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
                </div>
            </div>

            {/*Validated Address Details*/}
            <div className="lg:pr-6">
                <div className="space-y-2 text-sm">
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
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Similarity:</span>
                        <span
                            className={`italic ${
                                entry.similar_score !== undefined && entry.similar_score >= 80
                                    ? 'text-green-600'
                                    : entry.similar_score !== undefined && entry.similar_score >= 50
                                        ? 'text-yellow-500'
                                        : 'text-red-500'
                            }`}
                        >
                          {entry.similar_score !== undefined ? `${entry.similar_score} %` : 'N/A'}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Notes:</span>
                        <span className="text-gray-900 italic">{entry.address_notes || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/*Metadata*/}
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
);