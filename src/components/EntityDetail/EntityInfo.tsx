// ============================================
// components/EntityDetail/EntityInfo.tsx
// ============================================
import React from 'react';
import { FileText, User, MapPin, Database, AlertCircle } from 'lucide-react';
import type { Entity } from "../../types/entity.types.ts";
import { getBorrowerType } from "../utils/getBorrowerType.ts";
import { reformatEntity } from "../utils/reformatData.ts";

interface InfoFieldProps {
    label: string;
    value: any;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900">{value || 'N/A'}</dd>
    </div>
);

interface EntityInfoProps {
    entity: Entity;
}



export const EntityInfo: React.FC<EntityInfoProps> = ({ entity }) => {
    const formattedEntityInfo = reformatEntity(entity);

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Basic Information
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Fiscal Code" value={formattedEntityInfo.fiscal_code} />
                    <InfoField
                        label="Borrower Type"
                        value={getBorrowerType(formattedEntityInfo.borrower_type_id)}
                    />
                    {/*<InfoField label="Borrower ID" value={formattedEntityInfo.borrower_id} />*/}
                    {/*<InfoField label="Unique Borrower ID" value={formattedEntityInfo.unique_borrower_id} />*/}
                    {/*<InfoField label="Unique Loan ID" value={formattedEntityInfo.unique_loan_id} />*/}
                    {/*<InfoField label="Investigation Info ID" value={formattedEntityInfo.investigation_info_id} />*/}
                </dl>
            </div>

            {/* Personal Information */}
            {!formattedEntityInfo.is_company && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoField label="Gender" value={formattedEntityInfo.gender} />
                        <InfoField label="Date of Birth" value={formattedEntityInfo.date_of_birth} />
                        {formattedEntityInfo.is_deceased && formattedEntityInfo.date_of_death && (
                            <InfoField label="Date of Death" value={formattedEntityInfo.date_of_death} />
                        )}
                    </dl>
                </div>
            )}

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Place of Birth
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="" value={formattedEntityInfo.place_of_birth} />
                </dl>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    System Information
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Source System" value={formattedEntityInfo.source_system} />
                    <InfoField label="Source Details" value={formattedEntityInfo.source_details} />
                    <InfoField label="Created Date" value={formattedEntityInfo.created_date} />
                    <InfoField label="Modified Date" value={formattedEntityInfo.modified_date} />
                    <InfoField label="Extracted Date" value={formattedEntityInfo.extracted_date} />
                </dl>
            </div>

            {/* Notes */}
            {formattedEntityInfo.entity_notes && (
                <div className="bg-yellow-50 rounded-lg shadow-sm p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                        Notes
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{formattedEntityInfo.entity_notes}</p>
                </div>
            )}
        </div>
    );
};