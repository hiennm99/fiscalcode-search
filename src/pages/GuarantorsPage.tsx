import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService.ts';
import type{ Guarantor, RouteParams } from '../types';

export const GuarantorsPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (fiscalCode) {
            loadGuarantors(fiscalCode);
        }
    }, [fiscalCode]);

    const loadGuarantors = async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const guarantorsData = await FiscalCodeSearchService.getGuarantors(code);
            setGuarantors(guarantorsData);
        } catch (error) {
            console.error('Error loading guarantors:', error);
            setError(error instanceof Error ? error.message : 'Error loading guarantors');
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

    const renderGuarantorCard = (guarantor: Guarantor, index: number) => {
        const cardId = `guarantor-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-green-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{guarantor.name}</h4>
                        <p className="text-sm text-gray-600">Fiscal Code: {guarantor.fiscal_code}</p>
                        <p className="text-xs text-gray-500">Record ID: {guarantor.record_id}</p>
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
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Guarantor Info</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Name', guarantor.name, true)}
                                {renderDetailRow('Fiscal Code', guarantor.fiscal_code, true)}
                                {renderDetailRow('Is Company', guarantor.is_company, true)}
                                {renderDetailRow('Gender', guarantor.gender, isExpanded)}
                                {renderDetailRow('Date of Birth', guarantor.date_of_birth, isExpanded)}
                            </div>
                        </div>
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Birth Information</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Country of Birth', guarantor.country_of_birth, isExpanded)}
                                    {renderDetailRow('Region of Birth', guarantor.region_of_birth, isExpanded)}
                                    {renderDetailRow('Province of Birth', guarantor.province_of_birth, isExpanded)}
                                    {renderDetailRow('City of Birth', guarantor.city_of_birth, isExpanded)}
                                </div>
                            </div>
                        )}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', guarantor.source_system, true)}
                                {renderDetailRow('Collected Date', guarantor.collected_date, true)}
                                {renderDetailRow('Created Date', guarantor.created_date, isExpanded)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Loader2 className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading guarantors...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Guarantors</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (guarantors.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No guarantors found for fiscal code: {fiscalCode}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Guarantors</h2>
                <p className="text-gray-600">Found {guarantors.length} guarantor(s) for fiscal code: {fiscalCode}</p>
            </div>
            {guarantors.map(renderGuarantorCard)}
        </div>
    );
};