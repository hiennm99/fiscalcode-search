// ============================================
// App.tsx - Refactored with all routes
// ============================================
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EntitySearch } from "./components/EntitySearch/EntitySearch.tsx";
import { EntityDetail } from "./components/EntityDetail/EntityDetail.tsx";
import { EntityInfo } from './components/EntityDetail/EntityInfo.tsx';
import { BankList } from './components/EntityDetail/BankList.tsx';
import { ContactList } from './components/EntityDetail/ContactList.tsx';
import { JobList } from './components/EntityDetail/JobList.tsx';
import { AddressList } from './components/EntityDetail/AddressList.tsx';
import { AssetList } from './components/EntityDetail/AssetList.tsx';
import { GuarantorList } from './components/EntityDetail/GuarantorList.tsx';
import { JointList } from './components/EntityDetail/JointList.tsx';
import { PossibleGuarantorList } from "./components/EntityDetail/PossibleGuarantorList.tsx";
import { OthersList } from "./components/EntityDetail/OthersList.tsx";
import { EredeList } from "./components/EntityDetail/EredeList.tsx";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Search page */}
                <Route path="/" element={<EntitySearch />} />

                {/* Entity detail routes */}
                <Route path="/entity/:entity_id" element={<EntityDetail />}>
                    <Route index element={<EntityInfo />} />
                    <Route path="addresses" element={<AddressList />} />
                    <Route path="contacts" element={<ContactList />} />
                    <Route path="banks" element={<BankList />} />
                    <Route path="jobs" element={<JobList />} />
                    <Route path="assets" element={<AssetList />} />
                    <Route path="guarantors" element={<GuarantorList />} />
                    <Route path="joints" element={<JointList />} />
                    <Route path="possible" element={<PossibleGuarantorList />} />
                    <Route path="others" element={<OthersList />} />
                    <Route path="erede" element={<EredeList />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;