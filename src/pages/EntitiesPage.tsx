import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Loader2, AlertCircle, Eye, EyeOff, Users, Phone, MapPin, CreditCard, Briefcase, ArrowRight } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService.ts';
import type { Entity, RouteParams } from '../types';

export const EntitiesPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [entities, setEntities] = useState<Entity[]>([]);
    const [metadata, setMetadata] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (fiscalCode) {
            loadEntitiesAndMetadata(fiscalCode);
        }
    }, [fiscalCode]);

    const loadEntitiesAndMetadata = async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const [entitiesData, metadataData] = await Promise.all([
                FiscalCodeSearchService.getEntityByFiscalCode(code),
                FiscalCodeSearchService.getMetadata(code)
            ]);
            setEntities(entitiesData);
            setMetadata(metadataData);
        } catch (error) {
            console.error('Error loading entities and metadata:', error);
            setError(error instanceof Error ? error.message : 'Error loading data');
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

    const renderNavigationCards = () => {
        if (!metadata) return null;

        const navigationCards = [
            {
                key: 'guarantors',
                label: 'Guarantors',
                icon: Users,
                color: 'bg-green-500',
                hoverColor: 'hover:bg-green-600',
                count: metadata.guarantors_count || 0,
                description: 'View guarantor information'
            },
            {
                key: 'contacts',
                label: 'Contacts',
                icon: Phone,
                color: 'bg-purple-500',
                hoverColor: 'hover:bg-purple-600',
                count: metadata.contacts_count || 0,
                description: 'View contact details'
            },
            {
                key: 'addresses',
                label: 'Addresses',
                icon: MapPin,
                color: 'bg-orange-500',
                hoverColor: 'hover:bg-orange-600',
                count: metadata.addresses_count || 0,
                description: 'View address information'
            },
            {
                key: 'banks',
                label: 'Banks',
                icon: CreditCard,
                color: 'bg-red-500',
                hoverColor: 'hover:bg-red-600',
                count: metadata.banks_count || 0,
                description: 'View banking information'
            },
            {
                key: 'jobs',
                label: 'Jobs',
                icon: Briefcase,
                color: 'bg-indigo-500',
                hoverColor: 'hover:bg-indigo-600',
                count: metadata.jobs_count || 0,
                description: 'View employment information'
            }
        ];

        const cardsWithData = navigationCards.filter(card => card.count > 0);
        const cardsWithoutData = navigationCards.filter(card => card.count === 0);

        if (cardsWithData.length === 0 && cardsWithoutData.length === 0) return null;

        return (
            <div className="mt-8 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Data</h3>

                {/* Cards with data */}
                {cardsWithData.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
                        {cardsWithData.map(({ key, label, icon: Icon, color, hoverColor, count, description }) => (
                            <Link
                                key={key}
                                to={`/${fiscalCode}/${key}`}
                                className={`block p-4 rounded-lg border-2 border-transparent ${color} ${hoverColor} text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <Icon className="h-6 w-6" />
                                    <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-sm font-bold">
                                        {count}
                                    </span>
                                </div>
                                <h4 className="font-semibold text-lg mb-1">{label}</h4>
                                <p className="text-xs opacity-90 mb-2">{description}</p>
                                <div className="flex items-center justify-end">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Cards without data (disabled) */}
                {cardsWithoutData.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-500 mb-3">No data available for:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                            {cardsWithoutData.map(({ key, label, icon: Icon, count }) => (
                                <div
                                    key={key}
                                    className="p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <Icon className="h-5 w-5" />
                                        <span className="bg-gray-200 text-gray-500 px-2 py-1 rounded-full text-xs font-bold">
                                            {count}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-sm">{label}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderEntityCard = (entity: Entity, index: number) => {
        const cardId = `entity-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-blue-500">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{entity.name}</h4>
                        <p className="text-sm text-gray-600">Fiscal Code: {entity.fiscal_code}</p>
                        <p className="text-xs text-gray-500">Record ID: {entity.record_id}</p>
                    </div>
                    <button
                        onClick={() => toggleCardExpansion(cardId)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {isExpanded ? 'Show Less' : 'Show All'}
                    </button>
                </div>

                {/* Card Content */}
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Basic Information</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Name', entity.name, true)}
                                {renderDetailRow('Fiscal Code', entity.fiscal_code, true)}
                                {renderDetailRow('Is Company', entity.is_company, true)}
                                {renderDetailRow('Gender', entity.gender, isExpanded)}
                                {renderDetailRow('Date of Birth', entity.date_of_birth, isExpanded)}
                                {renderDetailRow('Is Deceased', entity.is_deceased, isExpanded)}
                                {renderDetailRow('Date of Death', entity.date_of_death, isExpanded)}
                            </div>
                        </div>

                        {/* Birth Information */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Birth Information</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Country of Birth', entity.country_of_birth, isExpanded)}
                                    {renderDetailRow('Region of Birth', entity.region_of_birth, isExpanded)}
                                    {renderDetailRow('Province of Birth', entity.province_of_birth, isExpanded)}
                                    {renderDetailRow('City of Birth', entity.city_of_birth, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* System Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', entity.source_system, true)}
                                {renderDetailRow('Loan ID', entity.loan_id, true)}
                                {renderDetailRow('Collected Date', entity.collected_date, true)}
                                {renderDetailRow('Created Date', entity.created_date, isExpanded)}
                            </div>
                        </div>

                        {/* Notes */}
                        {isExpanded && entity.entity_notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Notes</h5>
                                <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded">{entity.entity_notes}</p>
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
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading entities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Entities</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (entities.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No entities found for fiscal code: {fiscalCode}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Entities</h2>
                <p className="text-gray-600">Found {entities.length} entity(ies) for fiscal code: {fiscalCode}</p>
            </div>

            {/* Navigation Cards */}
            {renderNavigationCards()}

            {/* Entity Cards */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Entity Details</h3>
                {entities.map(renderEntityCard)}
            </div>
        </div>
    );
};