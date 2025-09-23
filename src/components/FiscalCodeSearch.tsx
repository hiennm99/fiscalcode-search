import React, { useState, useEffect } from 'react';
import { Search, User, Users, Briefcase, MapPin, CreditCard, Phone, Database, Loader2, AlertCircle, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import type { Entity, SearchResults, DetailedResults, Contact, Address, Bank, Guarantor, JobInfo } from '../services/searchService';
import { FiscalCodeSearchService } from "../services/searchService";

export const FiscalCodeSearch: React.FC = () => {
    const [fiscalCode, setFiscalCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [detailedResults, setDetailedResults] = useState<DetailedResults>({});
    const [activeTab, setActiveTab] = useState<string>('entities');
    const [searchMode, setSearchMode] = useState<'exact' | 'partial'>('exact');
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
    const [loadingTab, setLoadingTab] = useState<string | null>(null);

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
        setSearchResults(null);
        setDetailedResults({});
        setActiveTab('entities');

        try {
            const results = await FiscalCodeSearchService.searchByFiscalCode(fiscalCode, searchMode);
            setSearchResults(results);

            if (results.entities.length === 0) {
                setError(`No results found for fiscal code: ${fiscalCode.toUpperCase()}`);
            }

        } catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Error during search');
        } finally {
            setLoading(false);
        }
    };

    const handleTabClick = async (tabKey: string) => {
        if (!searchResults || tabKey === 'entities') {
            setActiveTab(tabKey);
            return;
        }

        // If we already have data for this tab, just switch to it
        if (detailedResults[tabKey as keyof DetailedResults]) {
            setActiveTab(tabKey);
            return;
        }

        // Load detailed data for this tab
        setLoadingTab(tabKey);
        try {
            const recordIds = searchResults.entities.map(entity => entity.record_id).filter(id => id);

            let results: DetailedResults = {};

            switch (tabKey) {
                case 'guarantors':
                    const guarantors = await FiscalCodeSearchService.getGuarantors(recordIds);
                    results = { guarantors };
                    break;
                case 'contacts':
                    const contacts = await FiscalCodeSearchService.getContacts(recordIds);
                    results = { contacts };
                    break;
                case 'addresses':
                    const addresses = await FiscalCodeSearchService.getAddresses(recordIds);
                    results = { addresses };
                    break;
                case 'banks':
                    const banks = await FiscalCodeSearchService.getBanks(recordIds);
                    results = { banks };
                    break;
                case 'jobs':
                    const jobs = await FiscalCodeSearchService.getJobs(recordIds);
                    results = { jobs };
                    break;
            }

            setDetailedResults(prev => ({ ...prev, ...results }));
            setActiveTab(tabKey);

        } catch (err) {
            console.error('Error loading tab data:', err);
            setError(err instanceof Error ? err.message : 'Error loading data');
        } finally {
            setLoadingTab(null);
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
        { key: 'entities', label: 'Entities', icon: User, color: 'bg-blue-500', count: searchResults?.entities.length || 0 },
        { key: 'guarantors', label: 'Guarantors', icon: Users, color: 'bg-green-500', count: searchResults?.metadata.guarantors_count || 0 },
        { key: 'contacts', label: 'Contacts', icon: Phone, color: 'bg-purple-500', count: searchResults?.metadata.contacts_count || 0 },
        { key: 'addresses', label: 'Addresses', icon: MapPin, color: 'bg-orange-500', count: searchResults?.metadata.addresses_count || 0 },
        { key: 'banks', label: 'Banks', icon: CreditCard, color: 'bg-red-500', count: searchResults?.metadata.banks_count || 0 },
        { key: 'jobs', label: 'Jobs', icon: Briefcase, color: 'bg-indigo-500', count: searchResults?.metadata.jobs_count || 0 }
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
                                {renderDetailRow('Loan ID', guarantor.loan_id, true)}
                                {renderDetailRow('Collected Date', guarantor.collected_date, true)}
                                {renderDetailRow('Created Date', guarantor.created_date, isExpanded)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContactCard = (contact: Contact, index: number) => {
        const cardId = `contact-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-purple-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{contact.email || contact.phone_number || 'Contact Info'}</h4>
                        <p className="text-sm text-gray-600">Fiscal Code: {contact.fiscal_code}</p>
                        <p className="text-xs text-gray-500">Record ID: {contact.record_id}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contact Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Email', contact.email, true)}
                                {renderDetailRow('Is PEC', contact.is_pec, true)}
                                {renderDetailRow('Is Verified', contact.is_verified, true)}
                                {renderDetailRow('Phone Number', contact.phone_number, true)}
                            </div>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', contact.source_system, true)}
                                {renderDetailRow('Collected Date', contact.collected_date, true)}
                                {renderDetailRow('Created Date', contact.created_date, isExpanded)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAddressCard = (address: Address, index: number) => {
        const cardId = `address-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-orange-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">
                            {address.street || 'Address'} - {address.city || 'Unknown City'}
                        </h4>
                        <p className="text-sm text-gray-600">Fiscal Code: {address.fiscal_code}</p>
                        <p className="text-xs text-gray-500">Record ID: {address.record_id}</p>
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
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Origin Address</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Origin Province', address.origin_province, isExpanded)}
                                    {renderDetailRow('Origin City', address.origin_city, isExpanded)}
                                    {renderDetailRow('Origin Street', address.origin_street, isExpanded)}
                                </div>
                            </div>
                        )}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', address.source_system, true)}
                                {renderDetailRow('Similar Score', address.similar_score, isExpanded)}
                                {renderDetailRow('Row Number', address.rn, isExpanded)}
                                {renderDetailRow('Collected Date', address.collected_date, true)}
                            </div>
                        </div>
                        {isExpanded && address.address_notes && (
                            <div className="md:col-span-2 lg:col-span-3">
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Notes</h5>
                                <p className="text-gray-800 text-sm bg-gray-50 p-3 rounded">{address.address_notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderBankCard = (bank: Bank, index: number) => {
        const cardId = `bank-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-red-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{bank.bank_name || 'Bank Account'}</h4>
                        <p className="text-sm text-gray-600">Fiscal Code: {bank.fiscal_code}</p>
                        <p className="text-xs text-gray-500">Record ID: {bank.record_id}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Bank Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Bank Name', bank.bank_name, true)}
                                {renderDetailRow('Bank ABI', bank.bank_abi, true)}
                                {renderDetailRow('Bank CAB', bank.bank_cab, true)}
                                {renderDetailRow('Account Number', bank.account_number, true)}
                            </div>
                        </div>
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', bank.source_system, true)}
                                {renderDetailRow('Collected Date', bank.collected_date, true)}
                                {renderDetailRow('Created Date', bank.created_date, isExpanded)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderJobCard = (job: JobInfo, index: number) => {
        const cardId = `job-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-indigo-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-lg text-gray-800">{job.job_employer_name || 'Unknown Employer'}</h4>
                        <p className="text-sm text-gray-600">Position: {job.job_position || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Fiscal Code: {job.fiscal_code}</p>
                        {job.record_id && <p className="text-xs text-gray-500">Record ID: {job.record_id}</p>}
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
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Job Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Position', job.job_position, true)}
                                {renderDetailRow('Employer Name', job.job_employer_name, true)}
                                {renderDetailRow('Monthly Income', job.job_monthly_income ? `€${job.job_monthly_income}` : null, true)}
                                {renderDetailRow('Income Range', job.job_income_range, isExpanded)}
                                {renderDetailRow('Start Date', job.job_start_date, isExpanded)}
                                {renderDetailRow('End Date', job.job_end_date, isExpanded)}
                            </div>
                        </div>
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
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', job.source_system, true)}
                                {renderDetailRow('Collected Date', job.collected_date, true)}
                                {renderDetailRow('Created Date', job.created_date, isExpanded)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        if (loadingTab === activeTab) {
            return (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-500 text-lg">Loading {activeTab}...</p>
                </div>
            );
        }

        switch (activeTab) {
            case 'entities':
                return searchResults?.entities.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No entities found</p>
                    </div>
                ) : (
                    <div>
                        {searchResults?.entities.map(renderEntityCard)}
                    </div>
                );

            case 'guarantors':
                const guarantors = detailedResults.guarantors || [];
                return guarantors.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No guarantors found</p>
                    </div>
                ) : (
                    <div>
                        {guarantors.map(renderGuarantorCard)}
                    </div>
                );

            case 'contacts':
                const contacts = detailedResults.contacts || [];
                return contacts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No contacts found</p>
                    </div>
                ) : (
                    <div>
                        {contacts.map(renderContactCard)}
                    </div>
                );

            case 'addresses':
                const addresses = detailedResults.addresses || [];
                return addresses.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No addresses found</p>
                    </div>
                ) : (
                    <div>
                        {addresses.map(renderAddressCard)}
                    </div>
                );

            case 'banks':
                const banks = detailedResults.banks || [];
                return banks.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No banks found</p>
                    </div>
                ) : (
                    <div>
                        {banks.map(renderBankCard)}
                    </div>
                );

            case 'jobs':
                const jobs = detailedResults.jobs || [];
                return jobs.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No jobs found</p>
                    </div>
                ) : (
                    <div>
                        {jobs.map(renderJobCard)}
                    </div>
                );

            default:
                return null;
        }
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
                    <p className="text-gray-600 text-lg">Search for information by fiscal code with record_id relationships</p>
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
                                    placeholder="Enter fiscal code (e.g., PLZLRT55D29I612W)"
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
                {searchResults && searchResults.entities.length > 0 && (
                    <div className="max-w-7xl mx-auto">
                        {/* Results Summary */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                    <span className="text-lg font-semibold text-gray-800">
                                        Found {searchResults.entities.length} entities for fiscal code: {fiscalCode}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {tabs.map(({ key, label, icon: Icon, color, count }) => {
                                const isActive = activeTab === key;
                                const isLoading = loadingTab === key;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleTabClick(key)}
                                        disabled={isLoading}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
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
                            {renderTabContent()}
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
                                Enter a fiscal code to search across all related tables using record_id relationships.
                                The system will show entities first, then load detailed information on demand.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};mb-3 text-sm uppercase tracking-wide">Birth Information</h5>
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
                            <h5 className="font-semibold text-gray-700