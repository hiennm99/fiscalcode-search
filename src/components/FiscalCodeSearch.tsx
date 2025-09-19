import React, { useState, useEffect } from 'react';
import { Search, User, Users, Briefcase, Link, Database, Loader2, AlertCircle, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import type { Entity, JobInfo, SearchResults } from '../services/searchService';
import { FiscalCodeSearchService } from "../services/searchService";

export const FiscalCodeSearch: React.FC = () => {
    const [fiscalCode, setFiscalCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [activeTab, setActiveTab] = useState<keyof SearchResults>('entities');
    const [searchMode, setSearchMode] = useState<'exact' | 'partial'>('exact');
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    // Check database connection when component mounts
    useEffect(() => {
        checkDatabaseConnection();
    }, []);

    const checkDatabaseConnection = async () => {
        try {
            const connected = await FiscalCodeSearchService.testConnection();
            setDbConnected(connected);
        } catch (error) {
            setDbConnected(false);
        }
    };

    const debugSearch = async () => {
        if (!fiscalCode.trim()) return;

        console.log('=== DEBUG SEARCH ===');
        const result = await FiscalCodeSearchService.debugSearch(fiscalCode.toUpperCase());
        console.log('Debug complete. Check console for details.');
    };

    const handleSearch = async () => {
        if (!fiscalCode.trim()) {
            setError('Please enter a fiscal code');
            return;
        }

        if (dbConnected === false) {
            setError('Database connection not available');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let results: SearchResults;

            if (searchMode === 'exact') {
                results = await FiscalCodeSearchService.searchExactFiscalCode(fiscalCode);
            } else {
                results = await FiscalCodeSearchService.searchByFiscalCode(fiscalCode);
            }

            setSearchResults(results);

            // If no results, show message
            const totalResults = Object.values(results).reduce((total, arr) => total + arr.length, 0);
            if (totalResults === 0) {
                setError(`No results found for fiscal code: ${fiscalCode.toUpperCase()}`);
            }

        } catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Error during search');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleCardExpansion = (cardId: string) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const tabs = [
        { key: 'entities' as const, label: 'Entities', icon: User, color: 'bg-blue-500' },
        { key: 'guarantors' as const, label: 'Guarantors', icon: Users, color: 'bg-green-500' },
        { key: 'jobs' as const, label: 'Jobs', icon: Briefcase, color: 'bg-orange-500' },
        { key: 'joints' as const, label: 'Joints', icon: Link, color: 'bg-purple-500' }
    ];

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

    const renderEntityCard = (entity: Entity, index: number, type: string) => {
        const cardId = `${type}-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-blue-500">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{entity.name}</h4>
                        <p className="text-sm text-gray-600">Fiscal Code: {entity.fiscal_code}</p>
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
                                {renderDetailRow('ID', entity.id, isExpanded)}
                                {renderDetailRow('Name', entity.name, true)}
                                {renderDetailRow('Fiscal Code', entity.fiscal_code, true)}
                                {renderDetailRow('Is Company', entity.is_company, isExpanded)}
                                {renderDetailRow('Gender', entity.gender, isExpanded)}
                                {renderDetailRow('Date of Birth', entity.date_of_birth, isExpanded)}
                                {renderDetailRow('Is Deceased', entity.is_deceased, isExpanded)}
                                {renderDetailRow('Date of Death', entity.date_of_death, isExpanded)}
                                {renderDetailRow('Loan ID', entity.loan_id, isExpanded)}
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

                        {/* Address Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Address</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Street', entity.street, true)}
                                {renderDetailRow('Locality', entity.locality, isExpanded)}
                                {renderDetailRow('City', entity.city, true)}
                                {renderDetailRow('Province', entity.province, true)}
                                {renderDetailRow('Region', entity.region, isExpanded)}
                                {renderDetailRow('Postcode', entity.postcode, true)}
                                {renderDetailRow('Country', entity.country, isExpanded)}
                                {renderDetailRow('Address Type', entity.address_type, isExpanded)}
                            </div>
                        </div>

                        {/* Origin Address */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Origin Address</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Origin Province', entity.origin_province, isExpanded)}
                                    {renderDetailRow('Origin City', entity.origin_city, isExpanded)}
                                    {renderDetailRow('Origin Street', entity.origin_street, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* Banking Information */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Banking</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Bank Name', entity.bank_name, isExpanded)}
                                    {renderDetailRow('Bank ABI', entity.bank_abi, isExpanded)}
                                    {renderDetailRow('Bank CAB', entity.bank_cab, isExpanded)}
                                    {renderDetailRow('Account Number', entity.account_number, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* System Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', entity.source_system, true)}
                                {renderDetailRow('Collected Date', entity.collected_date, true)}
                                {renderDetailRow('Created Date', entity.created_date, isExpanded)}
                                {renderDetailRow('Similar Score', entity.similar_score, isExpanded)}
                                {renderDetailRow('Created At', entity.created_at, isExpanded)}
                                {renderDetailRow('Updated At', entity.updated_at, isExpanded)}
                            </div>
                        </div>

                        {/* Notes */}
                        {isExpanded && (entity.entity_notes || entity.address_notes) && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Notes</h5>
                                <div className="space-y-2">
                                    {entity.entity_notes && (
                                        <div>
                                            <span className="font-medium text-gray-600 text-sm">Entity Notes:</span>
                                            <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-2 rounded">{entity.entity_notes}</p>
                                        </div>
                                    )}
                                    {entity.address_notes && (
                                        <div>
                                            <span className="font-medium text-gray-600 text-sm">Address Notes:</span>
                                            <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-2 rounded">{entity.address_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderJobCard = (job: JobInfo, index: number) => {
        const cardId = `job-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-orange-500">
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{job.job_employer_name || 'Unknown Employer'}</h4>
                        <p className="text-sm text-gray-600">Position: {job.job_position || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Fiscal Code: {job.fiscal_code}</p>
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
                        {/* Basic Job Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Job Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('ID', job.id, isExpanded)}
                                {renderDetailRow('Fiscal Code', job.fiscal_code, true)}
                                {renderDetailRow('Position', job.job_position, true)}
                                {renderDetailRow('Employer Name', job.job_employer_name, true)}
                                {renderDetailRow('Monthly Income', job.job_monthly_income ? `€${job.job_monthly_income}` : null, true)}
                                {renderDetailRow('Income Range', job.job_income_range, isExpanded)}
                                {renderDetailRow('Start Date', job.job_start_date, isExpanded)}
                                {renderDetailRow('End Date', job.job_end_date, isExpanded)}
                                {renderDetailRow('Pension Category', job.job_pension_category, isExpanded)}
                                {renderDetailRow('Reference', job.job_reference, isExpanded)}
                            </div>
                        </div>

                        {/* Employer Information */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Employer Info</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Phone', job.job_employer_phone, isExpanded)}
                                    {renderDetailRow('Fax', job.job_employer_fax, isExpanded)}
                                    {renderDetailRow('Tax Code', job.job_employer_tax_code, isExpanded)}
                                    {renderDetailRow('VAT Number', job.job_employer_vat_number, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* Legal Address */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Legal Address</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Street Type', job.job_legal_street_type, isExpanded)}
                                {renderDetailRow('Street', job.job_legal_street, isExpanded)}
                                {renderDetailRow('Number', job.job_legal_street_number, isExpanded)}
                                {renderDetailRow('Full Address', job.job_legal_address, true)}
                                {renderDetailRow('City', job.job_legal_city, true)}
                                {renderDetailRow('Province', job.job_legal_province, true)}
                                {renderDetailRow('Postcode', job.job_legal_postcode, isExpanded)}
                            </div>
                        </div>

                        {/* Operation Address */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Operation Address</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Street Type', job.job_operation_street_type, isExpanded)}
                                    {renderDetailRow('Street', job.job_operation_street, isExpanded)}
                                    {renderDetailRow('Number', job.job_operation_street_number, isExpanded)}
                                    {renderDetailRow('Full Address', job.job_operation_address, isExpanded)}
                                    {renderDetailRow('City', job.job_operation_city, isExpanded)}
                                    {renderDetailRow('Province', job.job_operation_province, isExpanded)}
                                    {renderDetailRow('Postcode', job.job_operation_postcode, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* Financial Information */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Financial Info</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Position', job.finance_position, isExpanded)}
                                    {renderDetailRow('Supplier Evaluation', job.finance_supplier_evaluation, isExpanded)}
                                    {renderDetailRow('Ongoing Transfers', job.finance_ongoing_transfers, isExpanded)}
                                    {renderDetailRow('Ongoing Garnishments', job.finance_ongoing_garnishments, isExpanded)}
                                    {renderDetailRow('Bank Account', job.finance_bank_account, isExpanded)}
                                    {renderDetailRow('Transfer Amount', job.finance_transfer_amount ? `€${job.finance_transfer_amount}` : null, isExpanded)}
                                    {renderDetailRow('Transfer Expiry', job.finance_transfer_expiry, isExpanded)}
                                    {renderDetailRow('Garnishment Amount', job.finance_garnishment_amount ? `€${job.finance_garnishment_amount}` : null, isExpanded)}
                                    {renderDetailRow('Garnishment Expiry', job.finance_garnishment_expiry, isExpanded)}
                                </div>
                            </div>
                        )}

                        {/* System Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', job.source_system, true)}
                                {renderDetailRow('Collected Date', job.collected_date, true)}
                                {renderDetailRow('Created Date', job.created_date, isExpanded)}
                                {renderDetailRow('Created At', job.created_at, isExpanded)}
                                {renderDetailRow('Updated At', job.updated_at, isExpanded)}
                            </div>
                        </div>

                        {/* Notes */}
                        {isExpanded && (job.job_work_activity_notes || job.finance_garnishment_notes || job.finance_transfer_notes) && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Notes</h5>
                                <div className="space-y-2">
                                    {job.job_work_activity_notes && (
                                        <div>
                                            <span className="font-medium text-gray-600 text-sm">Work Activity Notes:</span>
                                            <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-2 rounded">{job.job_work_activity_notes}</p>
                                        </div>
                                    )}
                                    {job.finance_garnishment_notes && (
                                        <div>
                                            <span className="font-medium text-gray-600 text-sm">Garnishment Notes:</span>
                                            <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-2 rounded">{job.finance_garnishment_notes}</p>
                                        </div>
                                    )}
                                    {job.finance_transfer_notes && (
                                        <div>
                                            <span className="font-medium text-gray-600 text-sm">Transfer Notes:</span>
                                            <p className="text-gray-800 text-sm mt-1 bg-gray-50 p-2 rounded">{job.finance_transfer_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getResultCount = () => {
        if (!searchResults) return 0;
        return Object.values(searchResults).reduce((total, results) => total + results.length, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Database className="h-12 w-12 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold text-gray-800">Fiscal Code Search</h1>
                        {dbConnected !== null && (
                            <div className="ml-4 flex items-center">
                                {dbConnected ? (
                                    <div className="flex items-center text-green-600">
                                        <CheckCircle className="h-5 w-5 mr-1" />
                                        <span className="text-sm">DB Connected</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <XCircle className="h-5 w-5 mr-1" />
                                        <span className="text-sm">DB Disconnected</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg">Search for information by fiscal code across multiple databases</p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        {/* Search Mode Toggle */}
                        <div className="flex justify-center mb-4">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setSearchMode('exact')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        searchMode === 'exact'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Exact Search
                                </button>
                                <button
                                    onClick={() => setSearchMode('partial')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        searchMode === 'partial'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Partial Search
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={fiscalCode}
                                    onChange={(e) => setFiscalCode(e.target.value.toUpperCase())}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter fiscal code (e.g., RSSMRA85H15F205X)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                    disabled={loading}
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading || !fiscalCode.trim() || dbConnected === false}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Search
                                    </>
                                )}
                            </button>

                            {/* Debug Button */}
                            <button
                                onClick={() => debugSearch()}
                                disabled={loading || !fiscalCode.trim() || dbConnected === false}
                                className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
                            >
                                Debug
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                <span className="text-red-700">{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section */}
                {searchResults && getResultCount() > 0 && (
                    <div className="max-w-7xl mx-auto">
                        {/* Results Summary */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <span className="text-lg font-semibold text-gray-800">
                                        Results found: {getResultCount()} records for fiscal code: {fiscalCode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tabs.map(({ key, label, icon: Icon, color }) => {
                                const count = searchResults[key].length;
                                const isActive = activeTab === key;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {label}
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            isActive ? 'bg-white text-blue-600' : `${color} text-white`
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-64">
                            {searchResults[activeTab].length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">No data found in {tabs.find(t => t.key === activeTab)?.label} category</p>
                                </div>
                            ) : (
                                <div>
                                    {activeTab === 'jobs'
                                        ? searchResults.jobs.map(renderJobCard)
                                        : (searchResults[activeTab] as Entity[]).map((entity, index) =>
                                            renderEntityCard(entity, index, activeTab)
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Initial State */}
                {!searchResults && !loading && !error && (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Search</h3>
                            <p className="text-gray-500">
                                Enter a fiscal code to search for information across entities, guarantors, jobs, and joint ventures databases.
                                {searchMode === 'partial' && ' Use partial search to find similar codes.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};