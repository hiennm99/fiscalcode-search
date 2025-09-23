import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Loader2, AlertCircle, Eye, EyeOff, Briefcase, DollarSign, Calendar, Phone } from 'lucide-react';
import { FiscalCodeSearchService } from '../services/fiscalCodeService';
import type { JobInfo, RouteParams } from '../types';

export const JobsPage: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { fiscalCode } = useParams<RouteParams>();
    const [jobs, setJobs] = useState<JobInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        if (fiscalCode) {
            loadJobs(fiscalCode);
        }
    }, [fiscalCode]);

    const loadJobs = async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const jobsData = await FiscalCodeSearchService.getJobs(code);
            setJobs(jobsData);
        } catch (error) {
            console.error('Error loading jobs:', error);
            setError(error instanceof Error ? error.message : 'Error loading jobs');
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

    const formatJobTitle = (job: JobInfo) => {
        if (job.job_position && job.job_employer_name) {
            return `${job.job_position} at ${job.job_employer_name}`;
        }
        return job.job_position || job.job_employer_name || 'Job Information';
    };

    const formatCurrency = (amount: number | undefined) => {
        if (!amount) return undefined;
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return undefined;
        try {
            return new Date(dateString).toLocaleDateString('it-IT');
        } catch {
            return dateString;
        }
    };

    const getJobStatus = (job: JobInfo) => {
        if (job.job_end_date) {
            const endDate = new Date(job.job_end_date);
            const now = new Date();
            if (endDate < now) {
                return { status: 'Ended', color: 'bg-gray-500' };
            }
        }
        if (job.job_start_date) {
            const startDate = new Date(job.job_start_date);
            const now = new Date();
            if (startDate <= now && (!job.job_end_date || new Date(job.job_end_date) >= now)) {
                return { status: 'Active', color: 'bg-green-500' };
            }
            if (startDate > now) {
                return { status: 'Future', color: 'bg-blue-500' };
            }
        }
        return { status: 'Unknown', color: 'bg-gray-400' };
    };

    const renderJobCard = (job: JobInfo, index: number) => {
        const cardId = `job-${index}`;
        const isExpanded = expandedCards[cardId] || false;
        const jobStatus = getJobStatus(job);

        return (
            <div key={cardId} className="bg-white rounded-lg shadow-md mb-4 border-l-4 border-indigo-500">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex-1">
                        <div className="flex items-start gap-3">
                            <div className="bg-indigo-100 rounded-full p-2">
                                <Briefcase className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-lg text-gray-800">
                                        {formatJobTitle(job)}
                                    </h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${jobStatus.color}`}>
                                        {jobStatus.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">Fiscal Code: {job.fiscal_code}</p>
                                <p className="text-xs text-gray-500">
                                    Record ID: {job.record_id || 'N/A'}
                                </p>
                                {job.job_monthly_income && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">
                                            {formatCurrency(job.job_monthly_income)}/month
                                        </span>
                                        {job.job_income_range && (
                                            <span className="text-xs text-gray-500">
                                                ({job.job_income_range})
                                            </span>
                                        )}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Job Details */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Job Details</h5>
                            <div className="space-y-1">
                                {renderDetailRow('Position', job.job_position, true)}
                                {renderDetailRow('Employer', job.job_employer_name, true)}
                                {renderDetailRow('Monthly Income', formatCurrency(job.job_monthly_income), true)}
                                {renderDetailRow('Income Range', job.job_income_range, isExpanded)}
                            </div>
                        </div>

                        {/* Employment Period */}
                        <div>
                            <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                Employment Period
                            </h5>
                            <div className="space-y-1">
                                {renderDetailRow('Start Date', formatDate(job.job_start_date), true)}
                                {renderDetailRow('End Date', formatDate(job.job_end_date), true)}
                                {renderDetailRow('Status', jobStatus.status, isExpanded)}
                            </div>
                        </div>

                        {/* Employer Contact Info (if expanded) */}
                        {isExpanded && (job.job_employer_phone || job.job_employer_fax || job.job_employer_tax_code || job.job_employer_vat_number) && (
                            <div>
                                <h5 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Employer Contact</h5>
                                <div className="space-y-1">
                                    {renderDetailRow('Phone', job.job_employer_phone, isExpanded)}
                                    {renderDetailRow('Fax', job.job_employer_fax, isExpanded)}
                                    {renderDetailRow('Tax Code', job.job_employer_tax_code, isExpanded)}
                                    {renderDetailRow('VAT Number', job.job_employer_vat_number, isExpanded)}
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
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Panel (if expanded) */}
                    {isExpanded && (job.job_employer_phone || job.job_employer_fax) && (
                        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                            <h6 className="font-semibold text-indigo-800 mb-2 text-sm flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Quick Contact
                            </h6>
                            <div className="flex flex-wrap gap-4 text-sm">
                                {job.job_employer_phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-indigo-600" />
                                        <span className="font-medium">Phone:</span>
                                        <a href={`tel:${job.job_employer_phone}`} className="text-indigo-600 hover:underline">
                                            {job.job_employer_phone}
                                        </a>
                                    </div>
                                )}
                                {job.job_employer_fax && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-indigo-600" />
                                        <span className="font-medium">Fax:</span>
                                        <span className="text-indigo-600">{job.job_employer_fax}</span>
                                    </div>
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
                <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500 text-lg">Loading job information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Error Loading Job Information</h3>
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No job information found for fiscal code: {fiscalCode}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Information</h2>
                <p className="text-gray-600">Found {jobs.length} job record(s) for fiscal code: {fiscalCode}</p>
            </div>
            {jobs.map(renderJobCard)}
        </div>
    );
};