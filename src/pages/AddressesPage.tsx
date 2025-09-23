import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Loader2, AlertCircle, Eye, EyeOff, MapPin } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService.ts';
import type { Address, RouteParams } from '../types';

export const AddressesPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (fiscalCode) {
            loadAddresses(fiscalCode);
        }
    }, [fiscalCode]);

    const loadAddresses = async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const addressesData = await FiscalCodeSearchService.getAddresses(code);
            setAddresses(addressesData);
        } catch (error) {
            console.error('Error loading addresses:', error);
            setError(error instanceof Error ? error.message : 'Error loading addresses');
        } finally {
            setLoading(false);
        }
    };

    const toggleCardExpansion = (cardId: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const renderDetailRow = (label: string, value: any, isExpanded: boolean) => {
        if (!isExpanded && (value === null || value === undefined || value === '')) return null;

        const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
            typeof value === 'number' ? value.toLocaleString() :
                value || 'N/A';

        return (
            <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="font-medium text-gray-600 text-sm">{label}:</span>
                <span className="text-gray-800 text-sm text-right max-w-xs truncate" title={String(displayValue)}>
                    {displayValue}
                </span>
            </div>
        );
    };

    const formatAddressDisplay = (address: Address) => {
        const parts = [
            address.street,
            address.locality,
            address.city,
            address.province,
            address.region,
            address.postcode,
            address.country
        ].filter(Boolean);

        return parts.length > 0 ? parts.join(', ') : 'Address Details';
    };

    const renderAddressCard = (address: Address, index: number) => {
        const cardId = `address-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-orange-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-lg text-gray-800 mb-1">
                                    {formatAddressDisplay(address)}
                                </h4>
                                <p className="text-sm text-gray-600">Fiscal Code: {address.fiscal_code}</p>
                                <p className="text-xs text-gray-500">Record ID: {address.record_id}</p>
                                {address.address_type && (
                                    <span className="inline-block mt-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                        {address.address_type}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => toggleCardExpansion(cardId)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isExpanded ? 'Show Less' : 'Show All'}
                    </button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Current Address */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Current Address</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Street', address.street, true)}
                                {renderDetailRow('Locality', address.locality, isExpanded)}
                                {renderDetailRow('City', address.city, true)}
                                {renderDetailRow('Province', address.province, true)}
                                {renderDetailRow('Region', address.region, isExpanded)}
                                {renderDetailRow('Postcode', address.postcode, true)}
                                {renderDetailRow('Country', address.country, isExpanded)}
                                {renderDetailRow('Address Type', address.address_type, isExpanded)}
                            </div>
                        </div>

                        {/* Origin Address (if expanded) */}
                        {isExpanded && (address.origin_street || address.origin_city || address.origin_province) && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Origin Address</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Origin Street', address.origin_street, isExpanded)}
                                    {renderDetailRow('Origin City', address.origin_city, isExpanded)}
                                    {renderDetailRow('Origin Province', address.origin_province, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* System & Quality Data */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', address.source_system, true)}
                                {renderDetailRow('Collected Date', address.collected_date, true)}
                                {renderDetailRow('Similar Score', address.similar_score, isExpanded)}
                                {renderDetailRow('RN', address.rn, isExpanded)}
                            </div>
                        </div>

                        {/* Notes (if expanded and exists) */}
                        {isExpanded && address.address_notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Notes</h5>
                                <div className="bg-gray-50 p-3 rounded">
                                    <p className="text-gray-800 text-sm">{address.address_notes}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Loader2 className="h-12 w-12 text-orange-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading addresses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Addresses</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (addresses.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No addresses found for fiscal code: {fiscalCode}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Addresses</h2>
                <p className="text-gray-600">Found {addresses.length} address(es) for fiscal code: {fiscalCode}</p>
            </div>
            {addresses.map(renderAddressCard)}
        </div>
    );
};