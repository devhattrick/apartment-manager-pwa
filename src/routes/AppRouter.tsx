import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ContractsPage from '../pages/ContractsPage';
import CreateContractPage from '../pages/CreateContractPage';
import DashboardPage from '../pages/DashboardPage';
import EditContractPage from '../pages/EditContractPage';
import GuestsPage from '../pages/GuestsPage';
import LoginPage from '../pages/LoginPage';
import ReportsPage from '../pages/ReportsPage';
import RoomBlockPage from '../pages/RoomBlockPage';
import RoomsPage from '../pages/RoomsPage';
import { useAppStore } from '../store/useAppStore';

function ProtectedLayout() {
  const { isAuthenticated } = useAppStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/block" element={<RoomBlockPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/contracts/new" element={<CreateContractPage />} />
        <Route path="/contracts/:id/edit" element={<EditContractPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}