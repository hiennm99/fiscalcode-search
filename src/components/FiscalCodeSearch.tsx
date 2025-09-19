import React, { useState, useEffect } from 'react';
import { Search, User, Users, Briefcase, Link, Database, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import type{ Entity, JobInfo, SearchResults } from '../services/searchService';
import {FiscalCodeSearchService} from "../services/searchService";

export const FiscalCodeSearch: React.FC = () => {
    const [fiscalCode, setFiscalCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [activeTab, setActiveTab] = useState<keyof SearchResults>('entities');
    const [searchMode, setSearchMode] = useState<'exact' | 'partial'>('exact');
    const [dbConnected, setDbConnected] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Kiểm tra kết nối database khi component mount
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
            setError('Inserisci un codice fiscale');
            return;
        }

        if (dbConnected === false) {
            setError('Connessione al database non disponibile');
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

            // Se non ci sono risultati, mostra messaggio
            const totalResults = Object.values(results).reduce((total, arr) => total + arr.length, 0);
            if (totalResults === 0) {
                setError(`Nessun risultato trovato per il codice fiscale: ${fiscalCode.toUpperCase()}`);
            }

        } catch (err) {
            console.error('Search error:', err);
            setError(err instanceof Error ? err.message : 'Errore durante la ricerca');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const tabs = [
        { key: 'entities' as const, label: 'Entities', icon: User, color: 'bg-blue-500' },
        { key: 'guarantors' as const, label: 'Guarantors', icon: Users, color: 'bg-green-500' },
        { key: 'jobs' as const, label: 'Jobs', icon: Briefcase, color: 'bg-orange-500' },
        { key: 'joints' as const, label: 'Joints', icon: Link, color: 'bg-purple-500' }
    ];

    const renderEntityCard = (entity: Entity, index: number) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Informazioni Personali</h4>
                    <p><span className="font-medium">Nome:</span> {entity.name}</p>
                    <p><span className="font-medium">Codice Fiscale:</span> {entity.fiscal_code}</p>
                    <p><span className="font-medium">Genere:</span> {entity.gender || 'N/A'}</p>
                    <p><span className="font-medium">Data Nascita:</span> {entity.date_of_birth || 'N/A'}</p>
                    <p><span className="font-medium">Azienda:</span> {entity.is_company ? 'Sì' : 'No'}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Indirizzo</h4>
                    <p><span className="font-medium">Via:</span> {entity.street || 'N/A'}</p>
                    <p><span className="font-medium">Città:</span> {entity.city || 'N/A'}</p>
                    <p><span className="font-medium">Provincia:</span> {entity.province || 'N/A'}</p>
                    <p><span className="font-medium">CAP:</span> {entity.postcode || 'N/A'}</p>
                    <p><span className="font-medium">Paese:</span> {entity.country || 'N/A'}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Dettagli Sistema</h4>
                    <p><span className="font-medium">Sistema:</span> {entity.source_system}</p>
                    <p><span className="font-medium">Data Raccolta:</span> {entity.collected_date}</p>
                    {entity.loan_id && <p><span className="font-medium">Loan ID:</span> {entity.loan_id}</p>}
                    {entity.bank_name && <p><span className="font-medium">Banca:</span> {entity.bank_name}</p>}
                </div>
            </div>
        </div>
    );

    const renderJobCard = (job: JobInfo, index: number) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 border-orange-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Informazioni Lavorative</h4>
                    <p><span className="font-medium">Codice Fiscale:</span> {job.fiscal_code}</p>
                    <p><span className="font-medium">Posizione:</span> {job.job_position || 'N/A'}</p>
                    <p><span className="font-medium">Datore Lavoro:</span> {job.job_employer_name || 'N/A'}</p>
                    <p><span className="font-medium">Reddito Mensile:</span> {job.job_monthly_income ? `€${job.job_monthly_income}` : 'N/A'}</p>
                    <p><span className="font-medium">Data Inizio:</span> {job.job_start_date || 'N/A'}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Ubicazione Lavoro</h4>
                    <p><span className="font-medium">Città:</span> {job.job_legal_city || 'N/A'}</p>
                    <p><span className="font-medium">Provincia:</span> {job.job_legal_province || 'N/A'}</p>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Dettagli Sistema</h4>
                    <p><span className="font-medium">Sistema:</span> {job.source_system}</p>
                    <p><span className="font-medium">Data Raccolta:</span> {job.collected_date}</p>
                    <p><span className="font-medium">Posizione Finanziaria:</span> {job.finance_position || 'N/A'}</p>
                    <p><span className="font-medium">Conto Bancario:</span> {job.finance_bank_account || 'N/A'}</p>
                </div>
            </div>
        </div>
    );

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
                                        <span className="text-sm">DB Connesso</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600">
                                        <XCircle className="h-5 w-5 mr-1" />
                                        <span className="text-sm">DB Disconnesso</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg">Cerca informazioni per codice fiscale nei database</p>
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
                                    Ricerca Esatta
                                </button>
                                <button
                                    onClick={() => setSearchMode('partial')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        searchMode === 'partial'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Ricerca Parziale
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
                                    placeholder="Inserisci codice fiscale (es: RSSMRA85H15F205X)"
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
                                        Ricerca...
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        Cerca
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
                                        Risultati trovati: {getResultCount()} record per il codice fiscale: {fiscalCode}
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
                                    <p className="text-gray-500 text-lg">Nessun dato trovato nella categoria {tabs.find(t => t.key === activeTab)?.label}</p>
                                </div>
                            ) : (
                                <div>
                                    {activeTab === 'jobs'
                                        ? searchResults.jobs.map(renderJobCard)
                                        : (searchResults[activeTab] as Entity[]).map(renderEntityCard)
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
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Inizia la tua ricerca</h3>
                            <p className="text-gray-500">
                                Inserisci un codice fiscale per cercare informazioni nei database delle entità, garanti, lavori e joint ventures.
                                {searchMode === 'partial' && ' Usa la ricerca parziale per trovare codici simili.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};