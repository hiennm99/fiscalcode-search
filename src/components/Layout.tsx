import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import {
    Database,
    CheckCircle,
    XCircle,
    User,
    Users,
    Briefcase,
    MapPin,
    CreditCard,
    Phone,
    Search,
    ArrowLeft,
    Loader2,
    Home,
    ChevronRight,
    RotateCcw
} from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService';
import type { RouteParams, SearchResults } from '../types';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode, section } = useParams<RouteParams>();
    const navigate = useNavigate();
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);
    const [metadata, setMetadata] = useState<SearchResults['metadata'] | null>(null);
    const [entitiesCount, setEntitiesCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>(fiscalCode || '');

    // Check database connection when component mounts
    useEffect(() => {
        checkDatabaseConnection();
    }, []);

    // Load metadata and entities count when fiscal code changes
    useEffect(() => {
        if (fiscalCode) {
            loadMetadataAndEntities(fiscalCode);
            setSearchInput(fiscalCode);
        } else {
            setMetadata(null);
            setEntitiesCount(0);
        }
    }, [fiscalCode]);

    // Keyboard shortcuts for navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Only work when not in input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (fiscalCode && metadata) {
                switch (e.key) {
                    case '1':
                        navigate(`/${fiscalCode}/entities`);
                        break;
                    case '2':
                        if (metadata.guarantors_count > 0) navigate(`/${fiscalCode}/guarantors`);
                        break;
                    case '3':
                        if (metadata.contacts_count > 0) navigate(`/${fiscalCode}/contacts`);
                        break;
                    case '4':
                        if (metadata.addresses_count > 0) navigate(`/${fiscalCode}/addresses`);
                        break;
                    case '5':
                        if (metadata.banks_count > 0) navigate(`/${fiscalCode}/banks`);
                        break;
                    case '6':
                        if (metadata.jobs_count > 0) navigate(`/${fiscalCode}/jobs`);
                        break;
                    case 'Escape':
                        navigate('/');
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [fiscalCode, metadata, navigate]);

    const checkDatabaseConnection = async () => {
        try {
            const connected = await FiscalCodeSearchService.testConnection();
            setDbConnected(connected);
        } catch (error) {
            console.error('Database connection check failed:', error);
            setDbConnected(false);
        }
    };

    const loadMetadataAndEntities = async (code: string) => {
        try {
            setLoading(true);
            const [metadataResult, entitiesData] = await Promise.all([
                FiscalCodeSearchService.getMetadata(code),
                FiscalCodeSearchService.getEntityByFiscalCode(code)
            ]);

            setMetadata(metadataResult);
            setEntitiesCount(entitiesData.length);
        } catch (error) {
            console.error('Error loading metadata and entities:', error);
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            const cleanFiscalCode = searchInput.trim().toUpperCase();
            navigate(`/${cleanFiscalCode}/entities`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const tabs = [
        {
            key: 'entities',
            label: 'Entities',
            icon: User,
            color: 'bg-blue-500',
            count: entitiesCount,
            description: 'Main entity information',
            shortcut: '1'
        },
        {
            key: 'guarantors',
            label: 'Guarantors',
            icon: Users,
            color: 'bg-green-500',
            count: metadata?.guarantors_count || 0,
            description: 'Guarantor information',
            shortcut: '2'
        },
        {
            key: 'contacts',
            label: 'Contacts',
            icon: Phone,
            color: 'bg-purple-500',
            count: metadata?.contacts_count || 0,
            description: 'Contact details',
            shortcut: '3'
        },
        {
            key: 'addresses',
            label: 'Addresses',
            icon: MapPin,
            color: 'bg-orange-500',
            count: metadata?.addresses_count || 0,
            description: 'Address information',
            shortcut: '4'
        },
        {
            key: 'banks',
            label: 'Banks',
            icon: CreditCard,
            color: 'bg-red-500',
            count: metadata?.banks_count || 0,
            description: 'Banking information',
            shortcut: '5'
        },
        {
            key: 'jobs',
            label: 'Jobs',
            icon: Briefcase,
            color: 'bg-indigo-500',
            count: metadata?.jobs_count || 0,
            description: 'Employment information',
            shortcut: '6'
        }
    ];

    const getSectionName = (key: string) => {
        const tab = tabs.find(t => t.key === key);
        return tab ? tab.label : key;
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
                    <p className="text-gray-600 text-lg">
                        Search for information by fiscal code with record_id relationships
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        System uses record_id generated by: dbt_utils.generate_surrogate_key(['source_system', 'loan_id', 'fiscal_code'])
                    </p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <form onSubmit={handleSearch}>
                            <div className="flex gap-3">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter fiscal code (e.g., PLZLRT55D29I612W)"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                        disabled={loading}
                                        maxLength={16}
                                    />
                                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !searchInput.trim() || dbConnected === false}
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
                        </form>

                        {/* Search Hints */}
                        <div className="mt-4 text-xs text-gray-500 space-y-1">
                            <p>• Enter an Italian fiscal code to find all related information</p>
                            <p>• Data is linked across tables using unique record_id relationships</p>
                            <p>• Each record_id represents one fiscal_code per loan_id per source_system</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Breadcrumb & Results */}
                {fiscalCode && (
                    <div className="max-w-7xl mx-auto mb-6">
                        {/* Enhanced Breadcrumb */}
                        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
                            <Link
                                to="/"
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link
                                to={`/${fiscalCode}/entities`}
                                className="hover:text-blue-600 transition-colors font-medium"
                            >
                                {fiscalCode}
                            </Link>
                            {section && section !== 'entities' && (
                                <>
                                    <ChevronRight className="h-4 w-4" />
                                    <span className="font-medium text-gray-800">
                                        {getSectionName(section)}
                                    </span>
                                </>
                            )}
                        </nav>

                        {/* Navigation Actions */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3 flex-wrap">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    New Search
                                </Link>

                                {/* Back to Search Results - always show when not on entities page */}
                                {section && section !== 'entities' && (
                                    <Link
                                        to={`/${fiscalCode}/entities`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors"
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Back to Results Overview
                                    </Link>
                                )}

                                {/* Reset Search - quick way to clear and start over */}
                                <button
                                    onClick={() => {
                                        setSearchInput('');
                                        navigate('/');
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg text-red-700 transition-colors"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Reset Search
                                </button>
                            </div>

                            {/* Keyboard shortcuts hint */}
                            {metadata && !loading && (
                                <div className="hidden md:block text-xs text-gray-500">
                                    <span>Keys: 1-6 (navigate), Esc (new search)</span>
                                </div>
                            )}
                        </div>

                        {/* Results Summary */}
                        {metadata && !loading && (
                            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                        <div>
                                            <span className="text-lg font-semibold text-gray-800">
                                                Results for fiscal code: {fiscalCode}
                                            </span>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Found data across {tabs.filter(tab => tab.count > 0).length} categories
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>Total records: {tabs.reduce((sum, tab) => sum + tab.count, 0)}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading && (
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
                                <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-3 animate-spin" />
                                <p className="text-gray-600">Loading data for {fiscalCode}...</p>
                            </div>
                        )}

                        {/* Enhanced Navigation Tabs */}
                        {metadata && !loading && (
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-800">Data Categories</h3>
                                    <div className="text-xs text-gray-500">
                                        Click or use number keys to navigate
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                    {tabs.map(({ key, label, icon: Icon, color, count, shortcut }) => {
                                        const isActive = section === key;
                                        const to = `/${fiscalCode}/${key}`;
                                        const hasData = count > 0;

                                        return (
                                            <Link
                                                key={key}
                                                to={to}
                                                className={`block p-3 rounded-lg border transition-all relative group ${
                                                    isActive
                                                        ? 'bg-blue-600 text-white shadow-lg border-blue-600 transform scale-105'
                                                        : hasData
                                                            ? 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border-gray-200 hover:shadow-lg hover:transform hover:scale-102'
                                                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                                                }`}
                                                onClick={hasData ? undefined : (e) => e.preventDefault()}
                                                title={hasData ? `View ${count} ${label.toLowerCase()} (Key: ${shortcut})` : `No ${label.toLowerCase()} found`}
                                            >
                                                {/* Active indicator */}
                                                {isActive && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                                                )}

                                                {/* Keyboard shortcut indicator */}
                                                <div className={`absolute top-1 left-1 w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                                                    isActive
                                                        ? 'bg-white text-blue-600'
                                                        : hasData
                                                            ? 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                                                            : 'bg-gray-300 text-gray-500'
                                                }`}>
                                                    {shortcut}
                                                </div>

                                                <div className="flex flex-col items-center text-center pt-2">
                                                    <Icon className="h-6 w-6 mb-2" />
                                                    <span className="font-medium text-sm mb-1">{label}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        isActive
                                                            ? 'bg-white text-blue-600'
                                                            : hasData
                                                                ? `${color} text-white`
                                                                : 'bg-gray-200 text-gray-500'
                                                    }`}>
                                                        {count}
                                                    </span>
                                                </div>

                                                {/* Data indicator for mobile */}
                                                <div className="mt-2 sm:hidden">
                                                    <p className={`text-xs text-center ${
                                                        isActive ? 'text-blue-100' : hasData ? 'text-gray-500' : 'text-gray-400'
                                                    }`}>
                                                        {hasData ? `${count} records` : 'No data'}
                                                    </p>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* No Results Message */}
                        {metadata && !loading && tabs.every(tab => tab.count === 0) && (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
                                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Found</h3>
                                <p className="text-gray-600">
                                    No records found for fiscal code: {fiscalCode}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Please verify the fiscal code is correct and try again.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>

                {/* Floating Quick Navigation - only show when has data and not on homepage */}
                {fiscalCode && metadata && !loading && tabs.some(tab => tab.count > 0) && (
                    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-2 max-w-xs">
                            <div className="text-xs text-gray-600 mb-2 px-2 font-medium">Quick Nav</div>
                            <div className="flex flex-col gap-1">
                                {/* Categories with data (except current) */}
                                {tabs
                                    .filter(tab => tab.count > 0 && tab.key !== section)
                                    .slice(0, 3)
                                    .map(({ key, icon: Icon, count, label, shortcut }) => (
                                        <Link
                                            key={key}
                                            to={`/${fiscalCode}/${key}`}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm"
                                            title={`Go to ${label} (Key: ${shortcut})`}
                                        >
                                            <div className="flex items-center gap-2 flex-1">
                                                <Icon className="h-4 w-4 text-gray-600" />
                                                <span className="text-gray-700">{label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
                                                {count}
                                            </span>
                                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs font-mono">
                                                {shortcut}
                                            </span>
                                            </div>
                                        </Link>
                                    ))}

                                {/* Divider */}
                                <hr className="my-1 border-gray-200" />

                                {/* Back to overview */}
                                {section !== 'entities' && (
                                    <Link
                                        to={`/${fiscalCode}/entities`}
                                        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50 text-blue-600 transition-colors text-sm"
                                        title="Back to Overview (Key: 1)"
                                    >
                                        <User className="h-4 w-4" />
                                        <span>Overview</span>
                                        <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-xs font-mono ml-auto">
                                            1
                                        </span>
                                    </Link>
                                )}

                                {/* New search */}
                                <Link
                                    to="/"
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 text-gray-600 transition-colors text-sm"
                                    title="New Search (Key: Esc)"
                                >
                                    <Search className="h-4 w-4" />
                                    <span>New Search</span>
                                    <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-xs font-mono ml-auto">
                                        Esc
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};