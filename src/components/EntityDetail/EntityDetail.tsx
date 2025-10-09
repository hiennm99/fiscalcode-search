// ============================================
// components/EntityDetail/EntityDetail.tsx - Optimized (No Delay)
// ============================================
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { User, Building2, ArrowLeft, Loader2, Layers } from 'lucide-react';
import { entityApiService } from "../../services/entityApi.service.ts";
import type { Entity } from "../../types/entity.types.ts";
import { toTitleCase } from '../../utils/reformatData.ts';
import { useEntityStore } from "../../stores/entityStore.ts";

export const EntityDetail: React.FC = () => {
    const { entity_id } = useParams<{ entity_id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [entity, setEntity] = useState<Entity | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSource, setSelectedSource] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState(false); // ✅ NEW

    const setCurrentEntity = useEntityStore((state) => state.setCurrentEntity);
    const clearCurrentEntity = useEntityStore((state) => state.clearCurrentEntity);

    // ✅ Fetch entity data when entering page
    useEffect(() => {
        const fetchEntity = async () => {
            if (!entity_id) return;

            setIsLoading(true);
            setError(null);

            try {
                const result = await entityApiService.getById(entity_id);
                setEntity(result);

                const mainEntity = result.all_sources?.[0] || result;
                setCurrentEntity({
                    entityId: mainEntity.entity_id,
                    fiscalCode: result.fiscal_code,
                    role: mainEntity.borrower_type_id,
                    sourceSystem: mainEntity.source_system,
                    uniqueLoanId: mainEntity.unique_loan_id,
                    entityData: mainEntity,
                });

            } catch (err) {
                setError('Failed to load entity details');
                console.error('Error fetching entity:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEntity();

        return () => {
            clearCurrentEntity();
        };
    }, [entity_id, setCurrentEntity, clearCurrentEntity]);

    // ✅ Update store when user selects different source (OPTIMIZED)
    useEffect(() => {
        if (!entity || !entity.all_sources) return;

        const selectedEntity = entity.all_sources[selectedSource];
        if (!selectedEntity) return;

        // Show loading overlay immediately
        setIsTransitioning(true);

        // Update store synchronously
        setCurrentEntity({
            entityId: selectedEntity.entity_id,
            fiscalCode: entity.fiscal_code,
            role: selectedEntity.borrower_type_id,
            sourceSystem: selectedEntity.source_system,
            uniqueLoanId: selectedEntity.unique_loan_id,
            entityData: selectedEntity,
        });

        // Hide loading overlay after brief delay (allows child components to start loading)
        const timer = setTimeout(() => {
            setIsTransitioning(false);
        }, 150);

        return () => clearTimeout(timer);
    }, [selectedSource, entity, setCurrentEntity]);

    // ✅ Handle source change with URL update
    const handleSourceChange = (index: number, newEntityId: string) => {
        setSelectedSource(index);

        const pathParts = location.pathname.split('/');
        const currentTab = pathParts[pathParts.length - 1];

        const isOnSubTab = pathParts.length > 3 && currentTab !== newEntityId;
        const newPath = isOnSubTab
            ? `/entity/${newEntityId}/${currentTab}`
            : `/entity/${newEntityId}`;

        navigate(newPath, { replace: true });
    };

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
        { path: '', label: 'Details' },
        { path: 'addresses', label: 'Addresses' },
        { path: 'contacts', label: 'Contacts' },
        { path: 'banks', label: 'Banks' },
        { path: 'jobs', label: 'Jobs' },
        { path: 'assets', label: 'Assets' },
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

                {/* Source Selector for Merged Entities */}
                {entity.is_merged && entity.all_sources && entity.all_sources.length > 1 && (
                    <div className="bg-purple-50 rounded-lg shadow-sm p-6 border border-purple-200 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Layers className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                                Multiple Data Sources Detected
                            </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {entity.all_sources.map((source, index) => (
                                <button
                                    key={source.entity_id}
                                    onClick={() => handleSourceChange(index, source.entity_id)}
                                    disabled={isTransitioning}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        selectedSource === index
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                    } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span>{toTitleCase(source.source_system)}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <nav className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => {
                            const to = `/entity/${entity_id}${tab.path ? '/' + tab.path : ''}`;
                            const isActive = tab.path === ''
                                ? location.pathname === `/entity/${entity_id}` || location.pathname === `/entity/${entity_id}/`
                                : location.pathname.includes(`/${tab.path}`);

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

                {/* Tab Content with Loading Overlay */}
                <div className="relative">
                    {/* ✅ Loading overlay during transition */}
                    {isTransitioning && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Switching source...</span>
                            </div>
                        </div>
                    )}

                    <Outlet />
                </div>
            </div>
        </div>
    );
};