import React, { useState } from 'react';
import { Search, User, Users, Briefcase, Link, Database, Loader2, AlertCircle } from 'lucide-react';

// Types based on your SQL schema
interface BaseEntity {
    source_system: string;
    collected_date: string;
    created_date: string;
    fiscal_code: string;
    name: string;
    is_company: boolean;
    gender?: string;
    date_of_birth?: string;
    country_of_birth?: string;
    region_of_birth?: string;
    province_of_birth?: string;
    city_of_birth?: string;
    is_deceased?: boolean;
    date_of_death?: string;
    entity_notes?: string;
    street?: string;
    locality?: string;
    city?: string;
    province?: string;
    region?: string;
    postcode?: string;
    country?: string;
    bank_name?: string;
    account_number?: string;
}

interface Entity extends BaseEntity {
    loan_id?: number;
}

interface JobInfo {
    source_system: string;
    collected_date: string;
    created_date: string;
    fiscal_code: string;
    job_position?: string;
    job_employer_name?: string;
    job_monthly_income?: number;
    job_start_date?: string;
    job_end_date?: string;
    job_legal_city?: string;
    job_legal_province?: string;
    finance_position?: string;
    finance_bank_account?: string;
}

interface SearchResults {
    entities: Entity[];
    guarantors: Entity[];
    jobs: JobInfo[];
    joints: Entity[];
}

// Mock data for demo purposes
const generateMockData = (fiscalCode: string): SearchResults => {
    const baseEntity: Entity = {
        source_system: 'recovery_system',
        collected_date: '2024-01-15',
        created_date: '2024-01-10',
        fiscal_code: fiscalCode,
        name: 'Mario Rossi',
        is_company: false,
        gender: 'M',
        date_of_birth: '1985-06-15',
        country_of_birth: 'Italia',
        region_of_birth: 'Lombardia',
        province_of_birth: 'MI',
        city_of_birth: 'Milano',
        is_deceased: false,
        street: 'Via Roma 123',
        city: 'Milano',
        province: 'MI',
        region: 'Lombardia',
        postcode: '20100',
        country: 'Italia',
        bank_name: 'Banca Intesa',
        account_number: 'IT60 X054 2811 1010 0000 0123456',
        loan_id: 12345
    };

    const jobInfo: JobInfo = {
        source_system: 'portfolio_system',
        collected_date: '2024-01-15',
        created_date: '2024-01-10',
        fiscal_code: fiscalCode,
        job_position: 'Software Engineer',
        job_employer_name: 'Tech Company SRL',
        job_monthly_income: 3500,
        job_start_date: '2020-01-15',
        job_legal_city: 'Milano',
        job_legal_province: 'MI',
        finance_position: 'Active',
        finance_bank_account: 'IT60 X054 2811 1010 0000 0123456'
    };

    return {
        entities: [baseEntity],
        guarantors: Math.random() > 0.5 ? [{ ...baseEntity, name: 'Giulia Verdi', loan_id: 12346 }] : [],
        jobs: [jobInfo],
        joints: Math.random() > 0.7 ? [{ ...baseEntity, name: 'Anna Bianchi', loan_id: 12347 }] : []
    };
};

export const FiscalCodeSearch: React.FC = () => {
    const [fiscalCode, setFiscalCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
    const [activeTab, setActiveTab] = useState<keyof SearchResults>('entities');

    const handleSearch = async () => {
        if (!fiscalCode.trim()) {
            alert('Inserisci un codice fiscale');
            return;
        }

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            const results = generateMockData(fiscalCode.toUpperCase());
            setSearchResults(results);
            setLoading(false);
        }, 1500);
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
                    <h4 className="font-semibold text-gray-700 mb-2">Informazioni Finanziarie</h4>
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
                    </div>
                    <p className="text-gray-600 text-lg">Cerca informazioni per codice fiscale nei database</p>
                </div>

                {/* Search Section */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
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
                                disabled={loading || !fiscalCode.trim()}
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
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {searchResults && (
                    <div className="max-w-7xl mx-auto">
                        {/* Results Summary */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-6 w-6 text-green-600" />
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
                {!searchResults && !loading && (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Inizia la tua ricerca</h3>
                            <p className="text-gray-500">Inserisci un codice fiscale per cercare informazioni nei database delle entità, garanti, lavori e joint ventures.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};