// ============================================
// components/EntityDetail/JobList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { jobApiService } from "../../services/jobApi.service.ts";
import type { Job } from "../../types/related.types.ts";
import { reformatJob } from "../../utils/reformatData.ts";
import { useEntityStore } from "../../stores/entityStore.ts";

export const JobList: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentEntityId = useEntityStore((state) => state.currentEntityId);

    useEffect(() => {
        const fetchJobs = async () => {
            if (!currentEntityId) {
                setJobs([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await jobApiService.getByEntityId(currentEntityId);
                const formattedData = data.map((entry: Job) => reformatJob(entry));
                setJobs(formattedData);
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [currentEntityId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No jobs found for this entity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((entry, index) => (
                <JobCard key={index} entry={entry} index={index} />
            ))}
        </div>
    );
};

// Separate component for Job card
const JobCard: React.FC<{ entry: Job; index: number }> = ({ entry, index }) => (
    <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-start gap-3 p-6 pb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 pt-1">
                <h3 className="text-base font-semibold text-gray-900 italic">
                    Job {index + 1}
                </h3>
            </div>
        </div>

        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:divide-x divide-gray-200 px-6 pb-6">
            {/* Column 1: Job Information */}
            <div className="lg:pr-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Job Details
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="text-gray-900 italic">{entry.start_date || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">End Date:</span>
                        <span className="text-gray-900 italic">{entry.end_date || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="text-gray-900 italic">{entry.monthly_income || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Income Range:</span>
                        <span className="text-gray-900 italic">{entry.income_range || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Reference:</span>
                        <span className="text-gray-900 italic">{entry.job_reference || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Notes:</span>
                        <span className="text-gray-900 italic">{entry.work_activity_notes || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Name:</span>
                        <span className="text-gray-900 italic">{entry.employer_name || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Tax Code:</span>
                        <span className="text-gray-900 italic">{entry.employer_tax_code || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">VAT Number:</span>
                        <span className="text-gray-900 italic">{entry.employer_vat_number || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Phone:</span>
                        <span className="text-gray-900 italic">{entry.employer_phone || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Fax:</span>
                        <span className="text-gray-900 italic">{entry.employer_fax || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Column 2: Legal Address */}
            <div className="lg:px-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Legal Address
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Street:</span>
                        <span className="text-gray-900 italic">{entry.legal_street || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Postcode:</span>
                        <span className="text-gray-900 italic">{entry.legal_postcode || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">City:</span>
                        <span className="text-gray-900 italic">{entry.legal_city || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Province:</span>
                        <span className="text-gray-900 italic">{entry.legal_province || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Country:</span>
                        <span className="text-gray-900 italic">{entry.legal_country || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Origin Street:</span>
                        <span className="text-gray-900 italic">{entry.legal_origin_street || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Origin City:</span>
                        <span className="text-gray-900 italic">{entry.legal_origin_city || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Origin Province:</span>
                        <span className="text-gray-900 italic">{entry.legal_origin_province || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Similarity:</span>
                        <span
                            className={`italic ${
                                entry.legal_similar_score !== undefined && entry.legal_similar_score >= 80
                                    ? 'text-green-600'
                                    : entry.legal_similar_score !== undefined && entry.legal_similar_score >= 50
                                        ? 'text-yellow-500'
                                        : 'text-red-500'
                            }`}
                        >
                            {entry.legal_similar_score !== undefined ? `${entry.legal_similar_score} %` : 'N/A'}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Notes:</span>
                        <span className="text-gray-900 italic">{entry.legal_address_notes || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Column 3: Operation Address */}
            <div className="lg:px-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Operation Address
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Street:</span>
                        <span className="text-gray-900 italic">{entry.operation_street || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Postcode:</span>
                        <span className="text-gray-900 italic">{entry.operation_postcode || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">City:</span>
                        <span className="text-gray-900 italic">{entry.operation_city || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Province:</span>
                        <span className="text-gray-900 italic">{entry.operation_province || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Country:</span>
                        <span className="text-gray-900 italic">{entry.operation_country || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Origin Street:</span>
                        <span className="text-gray-900 italic">{entry.operation_origin_street || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Origin City:</span>
                        <span className="text-gray-900 italic">{entry.operation_origin_city || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Origin Province:</span>
                        <span className="text-gray-900 italic">{entry.operation_origin_province || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Similarity:</span>
                        <span
                            className={`italic ${
                                entry.operation_similar_score !== undefined && entry.operation_similar_score >= 80
                                    ? 'text-green-600'
                                    : entry.operation_similar_score !== undefined && entry.operation_similar_score >= 50
                                        ? 'text-yellow-500'
                                        : 'text-red-500'
                            }`}
                        >
                            {entry.operation_similar_score !== undefined ? `${entry.operation_similar_score} %` : 'N/A'}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Notes:</span>
                        <span className="text-gray-900 italic">{entry.operation_address_notes || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Column 4: Metadata */}
            <div className="lg:pl-6">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Metadata
                </h4>
                <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Source:</span>
                        <span className="text-gray-900 italic">{entry.source_system || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">File:</span>
                        <span className="text-gray-900 italic">{entry.file || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Sheet:</span>
                        <span className="text-gray-900 italic">{entry.sheet || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900 italic">{entry.created_date || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Modified:</span>
                        <span className="text-gray-900 italic">{entry.modified_date || 'N/A'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-600">Extracted:</span>
                        <span className="text-gray-900 italic">{entry.extracted_date || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);