import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Loader2, AlertCircle, Eye, EyeOff, CreditCard, Building } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService.ts';
import type { Bank, RouteParams } from '../types';

export const BanksPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (fiscalCode) {
            loadBanks(fiscalCode);
        }
    }, [fiscalCode]);

    const loadBanks = async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const banksData = await FiscalCodeSearchService.getBanks(code);
            setBanks(banksData);
        } catch (error) {
            console.error('Error loading banks:', error);
            setError(error instanceof Error ? error.message : 'Error loading banks');
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

    const maskAccountNumber = (accountNumber: string | undefined) => {
        if (!accountNumber || accountNumber.length <= 4) return accountNumber;
        return '*'.repeat(accountNumber.length - 4) + accountNumber.slice(-4);
    };

    const formatBankDisplay = (bank: Bank) => {
        return bank.bank_name || `Bank ${bank.bank_abi || 'Account'}`;
    };

    const renderBankCard = (bank: Bank, index: number) => {
        const cardId = `bank-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-red-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-start gap-3">
                            <div className="bg-red-100 rounded-full p-2">
                                <Building className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-800 mb-1">
                                    {formatBankDisplay(bank)}
                                </h4>
                                <p className="text-sm text-gray-600">Fiscal Code: {bank.fiscal_code}</p>
                                <p className="text-xs text-gray-500">Record ID: {bank.record_id}</p>
                                {bank.account_number && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 font-mono">
                                            {maskAccountNumber(bank.account_number)}
                                        </span>
                                    </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Details */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Bank Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Bank Name', bank.bank_name, true)}
                                {renderDetailRow('ABI Code', bank.bank_abi, true)}
                                {renderDetailRow('CAB Code', bank.bank_cab, true)}
                                {renderDetailRow('Account Number',
                                    isExpanded ? bank.account_number : maskAccountNumber(bank.account_number),
                                    true
                                )}
                            </div>
                        </div>

                        {/* System Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', bank.source_system, true)}
                                {renderDetailRow('Collected Date', bank.collected_date, true)}
                                {renderDetailRow('Created Date', bank.created_date, isExpanded)}
                            </div>
                        </div>
                    </div>

                    {/* Additional Bank Info Section (if expanded) */}
                    {isExpanded && (bank.bank_abi || bank.bank_cab) && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h6 className="font-semibold text-gray-700 mb-2 text-sm">Banking Codes Reference</h6>
                            <div className="text-xs text-gray-600 space-y-1">
                                <p><strong>ABI:</strong> Italian Banking Association code that identifies the bank</p>
                                <p><strong>CAB:</strong> Bank branch code that identifies the specific branch</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Loader2 className="h-12 w-12 text-red-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading bank information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Bank Information</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (banks.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No bank information found for fiscal code: {fiscalCode}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bank Information</h2>
                <p className="text-gray-600">Found {banks.length} bank account(s) for fiscal code: {fiscalCode}</p>
            </div>
            {banks.map(renderBankCard)}
        </div>
    );
};