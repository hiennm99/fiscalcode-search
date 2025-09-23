import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Loader2, AlertCircle, Eye, EyeOff, Phone, Mail, Shield, CheckCircle } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService';
import type { Contact, RouteParams } from '../types';

export const ContactsPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (fiscalCode) {
            loadContacts(fiscalCode);
        }
    }, [fiscalCode]);

    const loadContacts = async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const contactsData = await FiscalCodeSearchService.getContacts(code);
            setContacts(contactsData);
        } catch (error) {
            console.error('Error loading contacts:', error);
            setError(error instanceof Error ? error.message : 'Error loading contacts');
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

    const formatContactDisplay = (contact: Contact) => {
        if (contact.email) {
            return contact.email;
        }
        if (contact.phone_number) {
            return contact.phone_number;
        }
        return 'Contact Information';
    };

    const getContactIcon = (contact: Contact) => {
        if (contact.email) {
            return <Mail className="h-5 w-5 text-purple-600" />;
        }
        if (contact.phone_number) {
            return <Phone className="h-5 w-5 text-purple-600" />;
        }
        return <Phone className="h-5 w-5 text-purple-600" />;
    };

    const renderContactCard = (contact: Contact, index: number) => {
        const cardId = `contact-${index}`;
        const isExpanded = expandedCards[cardId] || false;

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-purple-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-start gap-3">
                            <div className="bg-purple-100 rounded-full p-2">
                                {getContactIcon(contact)}
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-gray-800 mb-1">
                                    {formatContactDisplay(contact)}
                                </h4>
                                <p className="text-sm text-gray-600">Fiscal Code: {contact.fiscal_code}</p>
                                <p className="text-xs text-gray-500">Record ID: {contact.record_id}</p>

                                {/* Contact Type Badges */}
                                <div className="flex gap-2 mt-2">
                                    {contact.is_pec && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            <Shield className="h-3 w-3" />
                                            PEC
                                        </span>
                                    )}
                                    {contact.is_verified && (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </span>
                                    )}
                                </div>
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
                        {/* Contact Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contact Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Email', contact.email, true)}
                                {renderDetailRow('Phone Number', contact.phone_number, true)}
                                {renderDetailRow('Is PEC', contact.is_pec, isExpanded)}
                                {renderDetailRow('Is Verified', contact.is_verified, isExpanded)}
                            </div>
                        </div>

                        {/* System Information */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">System Data</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Source System', contact.source_system, true)}
                                {renderDetailRow('Collected Date', contact.collected_date, true)}
                                {renderDetailRow('Created Date', contact.created_date, isExpanded)}
                            </div>
                        </div>

                        {/* Contact Quality (if expanded) */}
                        {isExpanded && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Quality Indicators</h5>
                                <div className="space-y-1">
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium text-gray-600 text-sm">Contact Type:</span>
                                        <span className="text-gray-800 text-sm">
                                            {contact.email ? 'Email' : contact.phone_number ? 'Phone' : 'Unknown'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-gray-100">
                                        <span className="font-medium text-gray-600 text-sm">Security Level:</span>
                                        <span className="text-gray-800 text-sm">
                                            {contact.is_pec ? 'High (PEC)' : contact.is_verified ? 'Medium (Verified)' : 'Basic'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PEC Information Panel (if expanded and is PEC) */}
                    {isExpanded && contact.is_pec && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h6 className="font-semibold text-blue-800 mb-2 text-sm flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                PEC (Certified Electronic Mail)
                            </h6>
                            <div className="text-xs text-blue-700 space-y-1">
                                <p><strong>PEC:</strong> Posta Elettronica Certificata - equivalent to registered mail</p>
                                <p><strong>Legal Value:</strong> Has the same legal value as a registered letter with return receipt</p>
                                <p><strong>Security:</strong> Provides proof of sending and delivery with digital signatures</p>
                            </div>
                        </div>
                    )}

                    {/* Contact Actions (if expanded) */}
                    {isExpanded && (contact.email || contact.phone_number) && (
                        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                            <h6 className="font-semibold text-purple-800 mb-3 text-sm">Quick Actions</h6>
                            <div className="flex flex-wrap gap-3">
                                {contact.email && (
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                                    >
                                        <Mail className="h-4 w-4" />
                                        Send Email
                                    </a>
                                )}
                                {contact.phone_number && (
                                    <a
                                        href={`tel:${contact.phone_number}`}
                                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Call
                                    </a>
                                )}
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
                <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading contact information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Contact Information</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No contact information found for fiscal code: {fiscalCode}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h2>
                <p className="text-gray-600">Found {contacts.length} contact record(s) for fiscal code: {fiscalCode}</p>
            </div>
            {contacts.map(renderContactCard)}
        </div>
    );
};