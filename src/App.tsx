// ============================================
// App.tsx
// ============================================
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EntitySearch } from "./components/EntitySearch/EntitySearch.tsx";
import { EntityDetail } from "./components/EntityDetail/EntityDetail.tsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EntitySearch />} />
                <Route path="/entity/:entity_id/*" element={<EntityDetail />} />
            </Routes>
        </Router>
    );
};

export default App;