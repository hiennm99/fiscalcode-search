// ============================================
// components/EntityDetail/JobList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { jobApiService } from "../../services/jobApi.service.ts";
import type { Entity } from "../../types/entity.types";
import type { Job } from "../../types/related.types";
import { reformatJob } from "../utils/reformatData.ts";

interface JobListProps {
    entity: Entity;
}

export const JobList: React.FC<JobListProps> = ({ entity }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                const data = await jobApiService.getByEntityId(entity.entity_id);
                const formattedData = data.map((entry: Job) => reformatJob(entry));
                setJobs(formattedData);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [entity.entity_id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-16">
                <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No job information found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200">
                    {/* Header with Icon and Title */}
                    <div className="flex items-start gap-3 p-6 pb-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-base font-semibold text-gray-900">
                                {entry.job_position || `Job ${index + 1}`}
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
                                    <span className="text-gray-600">Position:</span>
                                    <span className="text-gray-900">{entry.job_position || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Start Date:</span>
                                    <span className="text-gray-900">{entry.job_start_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">End Date:</span>
                                    <span className="text-gray-900">{entry.job_end_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Monthly Income:</span>
                                    <span className="text-gray-900">{entry.job_monthly_income || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Income Range:</span>
                                    <span className="text-gray-900">{entry.job_income_range || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Reference:</span>
                                    <span className="text-gray-900">{entry.job_reference || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Notes:</span>
                                    <span className="text-gray-900">{entry.job_work_activity_notes || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Name:</span>
                                    <span className="text-gray-900">{entry.job_employer_name || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Tax Code:</span>
                                    <span className="text-gray-900">{entry.job_employer_tax_code || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">VAT Number:</span>
                                    <span className="text-gray-900">{entry.job_employer_vat_number || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Phone:</span>
                                    <span className="text-gray-900">{entry.job_employer_phone || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Fax:</span>
                                    <span className="text-gray-900">{entry.job_employer_fax || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Addresses */}
                        <div className="lg:px-6">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Legal Address
                            </h4>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Street Type:</span>
                                    <span className="text-gray-900">{entry.job_legal_street_type || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Street:</span>
                                    <span className="text-gray-900">{entry.job_legal_street || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Number:</span>
                                    <span className="text-gray-900">{entry.job_legal_street_number || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Address:</span>
                                    <span className="text-gray-900">{entry.job_legal_address || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">City:</span>
                                    <span className="text-gray-900">{entry.job_legal_city || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Province:</span>
                                    <span className="text-gray-900">{entry.job_legal_province || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Postcode:</span>
                                    <span className="text-gray-900">{entry.job_legal_postcode || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Column 3: Addresses */}
                        <div className="lg:px-6">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Operation Address
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Street Type:</span>
                                    <span className="text-gray-900">{entry.job_operation_street_type || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Street:</span>
                                    <span className="text-gray-900">{entry.job_operation_street || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Number:</span>
                                    <span className="text-gray-900">{entry.job_operation_street_number || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Address:</span>
                                    <span className="text-gray-900">{entry.job_operation_address || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">City:</span>
                                    <span className="text-gray-900">{entry.job_operation_city || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Province:</span>
                                    <span className="text-gray-900">{entry.job_operation_province || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Postcode:</span>
                                    <span className="text-gray-900">{entry.job_operation_postcode || 'N/A'}</span>
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
                                    <span className="text-gray-900">{entry.source_system || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="text-gray-900">{entry.created_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Modified:</span>
                                    <span className="text-gray-900">{entry.modified_date || 'N/A'}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <span className="text-gray-600">Extracted:</span>
                                    <span className="text-gray-900">{entry.extracted_date || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};