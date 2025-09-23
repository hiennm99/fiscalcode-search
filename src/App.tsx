// App.tsx - Main Application Component
import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router';
import { Layout } from './components/Layout';
import { HomePage } from "./pages/HomePage.tsx";
import { OverviewPage } from './pages/OverviewPage'; // Import OverviewPage
import { EntitiesPage } from './pages/EntitiesPage';
import { GuarantorsPage } from './pages/GuarantorsPage';
import { ContactsPage } from './pages/ContactsPage';
import { AddressesPage } from './pages/AddressesPage';
import { BanksPage } from './pages/BanksPage';
import { JobsPage } from './pages/JobsPage';

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    {/* Home page - search form */}
                    <Route path="/" element={<HomePage />} />

                    {/* Fiscal code overview page */}
                    <Route path="/:fiscalCode/overview" element={<OverviewPage />} />

                    {/* Fiscal code results pages with tabs */}
                    <Route path="/:fiscalCode/entities" element={<EntitiesPage />} />
                    <Route path="/:fiscalCode/guarantors" element={<GuarantorsPage />} />
                    <Route path="/:fiscalCode/contacts" element={<ContactsPage />} />
                    <Route path="/:fiscalCode/addresses" element={<AddressesPage />} />
                    <Route path="/:fiscalCode/banks" element={<BanksPage />} />
                    <Route path="/:fiscalCode/jobs" element={<JobsPage />} />

                    {/* Default redirect to entities when only fiscal code is provided */}
                    <Route path="/:fiscalCode" element={<Navigate to="entities" replace />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;