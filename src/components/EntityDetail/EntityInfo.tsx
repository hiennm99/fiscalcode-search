// ============================================
// components/EntityDetail/EntityInfo.tsx
// ============================================
import React from 'react';
import { FileText, User, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { getBorrowerType } from "../../utils/getBorrowerType.ts";
import { reformatEntity } from "../../utils/reformatData.ts";
import { useEntityStore } from "../../stores/entityStore.ts";

interface InfoFieldProps {
    label: string;
    value: string | number | Date | boolean | React.ReactNode | null | undefined;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
    const displayValue = () => {
        if (value === null || value === undefined) return 'N/A';
        if (value instanceof Date) return value.toLocaleDateString();
        return value;
    };

    return (
        <div>
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 italic">{displayValue()}</dd>
        </div>
    );
};

export const EntityInfo: React.FC = () => {
    // ✅ Lấy toàn bộ entity data từ store
    const currentEntityData = useEntityStore((state) => state.currentEntityData);

    // ✅ Nếu chưa có data, hiển thị message
    if (!currentEntityData) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No entity data available</p>
            </div>
        );
    }

    const formattedEntityInfo = reformatEntity(currentEntityData);

    return (
        <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Basic Information
                    {currentEntityData.is_merged && (
                        <span className="ml-2 text-xs font-normal text-purple-600">
                            (from {formattedEntityInfo.source_system})
                        </span>
                    )}
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Fiscal Code" value={formattedEntityInfo.fiscal_code} />
                    <InfoField
                        label="Borrower Type"
                        value={getBorrowerType(formattedEntityInfo.borrower_type_id)}
                    />
                    <InfoField
                        label="Is Verified"
                        value={
                            formattedEntityInfo.is_verified === true ? (
                                <span style={{ color: 'green', display: 'flex', alignItems: 'center' }}>
                                    <CheckCircle size={16} style={{ marginRight: '5px' }} />
                                    Verified
                                </span>
                            ) : formattedEntityInfo.is_verified === false ? (
                                <span style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                                    <XCircle size={16} style={{ marginRight: '5px' }} />
                                    Not Verified
                                </span>
                            ) : (
                                <span style={{ color: 'gray', display: 'flex', alignItems: 'center' }}>
                                    N/A
                                </span>
                            )
                        }
                    />
                    <InfoField label="NDG" value={formattedEntityInfo.borrower_ndg} />
                    <InfoField label="Ref" value={formattedEntityInfo.borrower_ref} />
                    <InfoField label="GBV" value={formattedEntityInfo.borrower_gbv} />
                    <InfoField label="Unique Loan" value={formattedEntityInfo.unique_loan_id} />
                    <InfoField label="VAT Number" value={formattedEntityInfo.vat_number} />
                    {getBorrowerType(formattedEntityInfo.borrower_type_id) === 'Guarantor' && (
                        <>
                            <InfoField label="Guarantor Type" value={formattedEntityInfo.guarantor_type} />
                            <InfoField label="Guarantor Limit" value={formattedEntityInfo.guarantor_limit} />
                        </>
                    )}
                </dl>
            </div>

            {/* Personal Information */}
            {!formattedEntityInfo.is_company && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                        {currentEntityData.is_merged && (
                            <span className="ml-2 text-xs font-normal text-purple-600">
                                (from {formattedEntityInfo.source_system})
                            </span>
                        )}
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoField label="Gender" value={formattedEntityInfo.gender} />
                        <InfoField label="Date of Birth" value={formattedEntityInfo.date_of_birth} />
                        {formattedEntityInfo.is_deceased && formattedEntityInfo.date_of_death && (
                            <InfoField label="Date of Death" value={formattedEntityInfo.date_of_death} />
                        )}
                        <InfoField label="Place Of Birth" value={formattedEntityInfo.place_of_birth} />
                    </dl>
                </div>
            )}

            {/* System Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    System Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <dl className="space-y-4">
                        <InfoField label="Source System" value={formattedEntityInfo.source_system} />
                        <InfoField label="File" value={formattedEntityInfo.file} />
                        <InfoField label="Sheet" value={formattedEntityInfo.sheet} />
                    </dl>
                    <dl className="space-y-4">
                        <InfoField label="Created Date" value={formattedEntityInfo.created_date} />
                        <InfoField label="Modified Date" value={formattedEntityInfo.modified_date} />
                        <InfoField label="Extracted Date" value={formattedEntityInfo.extracted_date} />
                    </dl>
                </div>
            </div>

            {/* Notes */}
            {formattedEntityInfo.entity_notes && (
                <div className="bg-yellow-50 rounded-lg shadow-sm p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                        Notes
                    </h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {formattedEntityInfo.entity_notes}
                    </p>
                </div>
            )}
        </div>
    );
};