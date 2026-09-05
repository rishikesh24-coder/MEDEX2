import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/Toast';
import { DemoPersonaPill } from './components/common/DemoPersonaPill';
import { AddMedicineModal } from './components/hospital/AddMedicineModal';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { SignInPage } from './pages/public/SignInPage';
import { RegisterHospitalPage } from './pages/public/RegisterHospitalPage';
import { RegisterAdminPage } from './pages/public/RegisterAdminPage';

// Hospital Pages
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { SmartInventoryPage } from './pages/hospital/SmartInventoryPage';
import { MarketplacePage } from './pages/hospital/MarketplacePage';
import { MyRequestsPage } from './pages/hospital/MyRequestsPage';
import { IncomingRequestsPage } from './pages/hospital/IncomingRequestsPage';
import { DualHistoryPage } from './pages/hospital/DualHistoryPage';
import { LiveTrackingPage } from './pages/hospital/LiveTrackingPage';
import { InvoicesPage } from './pages/hospital/InvoicesPage';
import { WasteManagementPage } from './pages/hospital/WasteManagementPage';
import { FeedbackPage } from './pages/hospital/FeedbackPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { GlobalRegistryPage } from './pages/admin/GlobalRegistryPage';
import { ComplianceDossierPage } from './pages/admin/ComplianceDossierPage';
import { VerificationQueuePage } from './pages/admin/VerificationQueuePage';
import { LogisticsDisposalPage } from './pages/admin/LogisticsDisposalPage';
import { FeedbackConsolePage } from './pages/admin/FeedbackConsolePage';

const AppContent: React.FC = () => {
  const { activePath, role } = useApp();
  const [isAddMedicineOpen, setIsAddMedicineOpen] = useState(false);

  // Router matching
  const renderRoute = () => {
    switch (activePath) {
      // Public
      case '/':
        return <LandingPage />;
      case '/auth/signin':
        return <SignInPage />;
      case '/auth/register-hospital':
        return <RegisterHospitalPage />;
      case '/auth/register-admin':
        return <RegisterAdminPage />;

      // Hospital Workspace
      case '/hospital/dashboard':
        return <HospitalDashboard onOpenAddMedicine={() => setIsAddMedicineOpen(true)} />;
      case '/hospital/inventory':
        return <SmartInventoryPage onOpenAddMedicine={() => setIsAddMedicineOpen(true)} />;
      case '/hospital/marketplace':
        return <MarketplacePage />;
      case '/hospital/my-requests':
        return <MyRequestsPage />;
      case '/hospital/incoming-requests':
        return <IncomingRequestsPage />;
      case '/hospital/history':
        return <DualHistoryPage />;
      case '/hospital/tracking':
        return <LiveTrackingPage />;
      case '/hospital/invoices':
        return <InvoicesPage />;
      case '/hospital/waste-management':
        return <WasteManagementPage />;
      case '/hospital/feedback':
        return <FeedbackPage />;

      // Admin Command Center
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/registry':
        return <GlobalRegistryPage />;
      case '/admin/compliance':
        return <ComplianceDossierPage />;
      case '/admin/verification-queue':
        return <VerificationQueuePage />;
      case '/admin/logistics':
        return <LogisticsDisposalPage />;
      case '/admin/feedback-console':
        return <FeedbackConsolePage />;

      default:
        // Default fallback based on active role
        if (role === 'hospital') {
          return <HospitalDashboard onOpenAddMedicine={() => setIsAddMedicineOpen(true)} />;
        }
        if (role === 'admin') {
          return <AdminDashboard />;
        }
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header onOpenAddMedicine={() => setIsAddMedicineOpen(true)} />

      <main className="flex-1">
        {renderRoute()}
      </main>

      <ToastContainer />
      <DemoPersonaPill />

      <AddMedicineModal
        isOpen={isAddMedicineOpen}
        onClose={() => setIsAddMedicineOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
