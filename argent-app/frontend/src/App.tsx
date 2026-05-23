import { HashRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ArchitecturePage from './pages/ArchitecturePage';
import PipelinePage from './pages/PipelinePage';
import SupplyChainPage from './pages/SupplyChainPage';
import MROPage from './pages/MROPage';
import ProgramsPage from './pages/ProgramsPage';
import PolicyPage from './pages/PolicyPage';
import RelatedPage from './pages/RelatedPage';
import PartDetailPage from './pages/PartDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import WizardScenarioPage from './pages/WizardScenarioPage';
import WizardLivePage from './pages/WizardLivePage';
import WizardOutcomePage from './pages/WizardOutcomePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/mro" element={<MROPage />} />
            <Route path="/supply-chain" element={<SupplyChainPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/pipeline" element={<PipelinePage />} />
            <Route path="/policy" element={<PolicyPage />} />
            <Route path="/related" element={<RelatedPage />} />
            <Route path="/parts/:partNo" element={<PartDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/dbt-wizard" element={<WizardScenarioPage />} />
            <Route path="/wizard-live" element={<WizardLivePage />} />
            <Route path="/wizard-outcome" element={<WizardOutcomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
