import React from 'react';
import { Database } from 'lucide-react';

export const HomePage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Search</h3>
                <p className="text-gray-500 mb-6">
                    Enter a fiscal code to search across all related tables using record_id relationships.
                    The system will show entities first, then load detailed information on demand.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold text-gray-700 mb-3">How it works:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Search by fiscal code to find all related entities</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Navigate through different data sections using the tabs</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Each section shows detailed information from related tables</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Data is linked through record_id relationships</span>
                        </li>
                    </ul>
                </div>

                <div className="mt-6 text-xs text-gray-400">
                    <p>Record IDs are generated using: dbt_utils.generate_surrogate_key(['source_system', 'loan_id', 'fiscal_code'])</p>
                </div>
            </div>
        </div>
    );
};