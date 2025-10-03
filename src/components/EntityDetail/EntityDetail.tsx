// ============================================
// components/EntityDetail/EntityDetail.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { useParams, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { User, Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { entityApiService } from "../../services/entityApi.service.ts";
import type { Entity } from "../../types/entity.types";
import { EntityInfo } from './EntityInfo.tsx';
import { BankList } from './BankList.tsx';
import { ContactList } from './ContactList.tsx';
import { JobList } from './JobList.tsx';
import { AddressList } from './AddressList.tsx';
import { GuarantorList } from './GuarantorList.tsx';
import { JointList } from './JointList.tsx';
import { PossibleGuarantorList } from "./PossibleGuarantorList.tsx";
import { OthersList } from "./OthersList.tsx";
import { EredeList } from "./EredeList.tsx";

export const EntityDetail: React.FC = () => {
    const { entity_id } = useParams<{ entity_id: string }>();
    const navigate = useNavigate();
    const [entity, setEntity] = useState<Entity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEntity = async () => {
            if (!entity_id) return;

            setIsLoading(true);
            setError(null);

            try {
                // Gọi API getById với entity_id
                const result = await entityApiService.getById(entity_id);
                setEntity(result);
            } catch (err) {
                setError('Failed to load entity details');
                console.error('Error fetching entity:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntity();
    }, [entity_id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error || !entity) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">{error || 'Entity not found'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { path: '', label: 'Details', end: true },
        { path: 'addresses', label: 'Addresses' },
        { path: 'contacts', label: 'Contacts' },
        { path: 'banks', label: 'Banks' },
        { path: 'jobs', label: 'Jobs' },
        { path: 'guarantors', label: 'Guarantors' },
        { path: 'joints', label: 'Joints' },
        { path: 'others', label: 'Others' },
        { path: 'possible', label: 'Possible Guarantors' },
        { path: 'erede', label: 'Erede' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Search
                </button>

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${entity.is_company ? 'bg-blue-100' : 'bg-green-100'}`}>
                            {entity.is_company ? (
                                <Building2 className="w-8 h-8 text-blue-600" />
                            ) : (
                                <User className="w-8 h-8 text-green-600" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900">{entity.name}</h1>
                            <p className="text-gray-500 mt-1">Fiscal Code: {entity.fiscal_code}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {entity.is_company && (
                                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                                        Company
                                    </span>
                                )}
                                {entity.is_deceased && (
                                    <span className="px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-full">
                                        Deceased
                                    </span>
                                )}
                                {!entity.is_company && (
                                    <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                                        Individual
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <nav className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => {
                            const to = `/entity/${entity_id}${tab.path ? '/' + tab.path : ''}`;
                            const isActive = tab.end
                                ? window.location.pathname === to
                                : window.location.pathname.includes(tab.path);

                            return (
                                <Link
                                    key={tab.path || 'details'}
                                    to={to}
                                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                        isActive
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <Routes>
                    <Route path="/" element={<EntityInfo entity={entity} />} />
                    <Route path="/addresses" element={<AddressList entity={entity} />} />
                    <Route path="/contacts" element={<ContactList entity={entity} />} />
                    <Route path="/banks" element={<BankList entity={entity} />} />
                    <Route path="/jobs" element={<JobList entity={entity} />} />
                    <Route path="/guarantors" element={<GuarantorList entity={entity} />} />
                    <Route path="/joints" element={<JointList entity={entity} />} />
                    <Route path="/possible" element={<PossibleGuarantorList entity={entity} />} />
                    <Route path="/others" element={<OthersList entity={entity} />} />
                    <Route path="/erede" element={<EredeList entity={entity} />} />
                </Routes>
            </div>
        </div>
    );
};