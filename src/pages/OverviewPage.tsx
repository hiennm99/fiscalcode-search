import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle, XCircle, User, Users, Phone, MapPin, CreditCard, Briefcase } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService';
import type { RouteParams } from '../types';

export const OverviewPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [metadata, setMetadata] = useState<any>(null);
    const [entitiesCount, setEntitiesCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fiscalCode) {
            loadOverviewData(fiscalCode);
        }
    }, [fiscalCode]);

    const loadOverviewData = async (code: string) => {
        try {
            setLoading(true);
            setError(null);

            const [metadataResult, entitiesData] = await Promise.all([
                FiscalCodeSearchService.getMetadata(code),
                FiscalCodeSearchService.getEntityByFiscalCode(code)
            ]);

            setMetadata(metadataResult);
            setEntitiesCount(entitiesData.length);
        } catch (error) {
            console.error('Error loading overview data:', error);
            setError(error instanceof Error ? error.message : 'Error loading data');
            setMetadata({
                guarantors_count: 0,
                contacts_count: 0,
                addresses_count: 0,
                banks_count: 0,
                jobs_count: 0
            });
            setEntitiesCount(0);
        } finally {
            setLoading(false);
        }
    };

    const dataCategories = [
        {
            key: 'entities',
            label: 'Entities',
            icon: User,
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            count: entitiesCount,
            description: 'Main entity information and personal details'
        },
        {
            key: 'guarantors',
            label: 'Guarantors',
            icon: Users,
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            count: metadata?.guarantors_count || 0,
            description: 'Guarantor information linked via record_id'
        },
        {
            key: 'contacts',
            label: 'Contacts',
            icon: Phone,
            color: 'bg-purple-500',
            hoverColor: 'hover:bg-purple-600',
            count: metadata?.contacts_count || 0,
            description: 'Contact details including email and phone numbers'
        },
        {
            key: 'addresses',
            label: 'Addresses',
            icon: MapPin,
            color: 'bg-orange-500',
            hoverColor: 'hover:bg-orange-600',
            count: metadata?.addresses_count || 0,
            description: 'Residential and business address information'
        },
        {
            key: 'banks',
            label: 'Banks',
            icon: CreditCard,
            color: 'bg-red-500',
            hoverColor: 'hover:bg-red-600',
            count: metadata?.banks_count || 0,
            description: 'Banking information and account details'
        },
        {
            key: 'jobs',
            label: 'Jobs',
            icon: Briefcase,
            color: 'bg-indigo-500',
            hoverColor: 'hover:bg-indigo-600',
            count: metadata?.jobs_count || 0,
            description: 'Employment history and job information'
        }
    ];

    const totalRecords = dataCategories.reduce((sum, category) => sum + category.count, 0);
    const categoriesWithData = dataCategories.filter(cat => cat.count > 0);
    const categoriesWithoutData = dataCategories.filter(cat => cat.count === 0);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading search results for {fiscalCode}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Results</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Back to Search Button */}
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    New Search
                </Link>
            </div>

            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {totalRecords > 0 ? (
                            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
                        ) : (
                            <XCircle className="h-8 w-8 text-gray-400 flex-shrink-0" />
                        )}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                                Search Results for: {fiscalCode}
                            </h1>
                            {totalRecords > 0 ? (
                                <p className="text-gray-600">
                                    Found data in {categoriesWithData.length} of {dataCategories.length} categories
                                </p>
                            ) : (
                                <p className="text-gray-500">No data found for this fiscal code</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{totalRecords}</div>
                        <div className="text-sm text-gray-500">Total Records</div>
                    </div>
                </div>
            </div>

            {totalRecords > 0 ? (
                <>
                    {/* Data Categories with Records */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Data Categories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categoriesWithData.map(({ key, label, icon: Icon, color, hoverColor, count, description }) => (
                                <Link
                                    key={key}
                                    to={`/${fiscalCode}/${key}`}
                                    className={`block p-6 rounded-lg ${color} ${hoverColor} text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon className="h-7 w-7" />
                                        <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-lg font-bold">
                                            {count}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-xl mb-2">{label}</h3>
                                    <p className="text-sm opacity-90">{description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Empty Categories */}
                    {categoriesWithoutData.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">No Data Found</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                {categoriesWithoutData.map(({ key, label, icon: Icon, count }) => (
                                    <div
                                        key={key}
                                        className="p-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-400 text-center"
                                    >
                                        <Icon className="h-6 w-6 mx-auto mb-2" />
                                        <div className="font-medium text-sm mb-1">{label}</div>
                                        <div className="bg-gray-200 text-gray-500 px-2 py-1 rounded-full text-xs font-bold">
                                            {count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to={`/${fiscalCode}/entities`}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                View Entity Details
                            </Link>
                            {categoriesWithData.slice(1, 4).map(({ key, label }) => (
                                <Link
                                    key={key}
                                    to={`/${fiscalCode}/${key}`}
                                    className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    View {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                /* No Results Found */
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Data Found</h2>
                    <p className="text-gray-600 mb-6">
                        No records found for fiscal code: <strong>{fiscalCode}</strong>
                    </p>
                    <div className="space-y-3 text-sm text-gray-500">
                        <p>Please verify:</p>
                        <ul className="space-y-1">
                            <li>• The fiscal code is entered correctly</li>
                            <li>• The fiscal code exists in the system</li>
                            <li>• There are no typos in the input</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};