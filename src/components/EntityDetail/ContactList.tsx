// ============================================
// components/EntityDetail/ContactList.tsx
// ============================================
import React, { useEffect, useState } from 'react';
import { Phone, Loader2, MapPin } from 'lucide-react';
import { contactApiService } from "../../services/contactApi.service.ts";
import type { Contact } from "../../types/related.types.ts";
import { reformatContact } from "../../utils/reformatData.ts";
import { useEntityStore } from "../../stores/entityStore.ts";

export const ContactList: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ ContactList cần fiscal_code, nên cần lưu thêm trong store
    const currentEntityId = useEntityStore((state) => state.currentEntityId);

    useEffect(() => {
        const fetchContacts = async () => {
            if (!currentEntityId) {
                setContacts([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const data = await contactApiService.getByEntityId(currentEntityId);
                const formattedData = data.map((entry: Contact) => reformatContact(entry));
                setContacts(formattedData);
            } catch (error) {
                console.error('Error fetching contacts:', error);
                setContacts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, [currentEntityId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contacts found for this entity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {contacts.map((entry, index) => (
                <div key={index} className="bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-4">
                        <div className="flex-1">
                            <div className="flex items-start gap-3 p-6 pb-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex pt-1">
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {`Contact ${index + 1}`}
                                    </h3>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:divide-x divide-gray-200 px-6 pb-6">
                                <div className="lg:pr-6">
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Email:</span>
                                            <span className="text-gray-900 italic">{entry.email || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Is Pec:</span>
                                            <span className="text-gray-900 italic">{entry.is_pec || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Is Verified:</span>
                                            <span className="text-gray-900 italic">{entry.is_verified || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Phone Number:</span>
                                            <span className="text-gray-900 italic">{entry.phone_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="space-y-2 text-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Source:</span>
                                            <span className="text-gray-900 italic">{entry.source_system || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Created Date:</span>
                                            <span className="text-gray-900 italic">{entry.created_date || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Modified Date:</span>
                                            <span className="text-gray-900 italic">{entry.modified_date || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <span className="text-gray-600">Extracted Date:</span>
                                            <span className="text-gray-900 italic">{entry.extracted_date || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};