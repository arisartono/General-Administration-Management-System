import React, { useState } from 'react';
import { GamsProvider, useGams } from './context/GamsContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { AssetManagementView } from './components/modules/assets/AssetManagementView';
import { VehicleManagementView } from './components/modules/vehicles/VehicleManagementView';
import { MaintenanceManagementView } from './components/modules/maintenance/MaintenanceManagementView';
import { MessengerManagementView } from './components/modules/messenger/MessengerManagementView';
import { OvertimeManagementView } from './components/modules/overtime/OvertimeManagementView';
import { MasterDataView } from './components/modules/masterData/MasterDataView';
import { SystemAdminView } from './components/admin/SystemAdminView';

// Modals
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { AuditTrailModal } from './components/common/AuditTrailModal';
import { ApprovalActionDialog } from './components/common/ApprovalActionDialog';
import { LabelPrinterModal } from './components/common/LabelPrinterModal';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { Asset } from './types/gams';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { assets, vehicleBookings, maintenanceRequests, messengerDeliveries, overtimeRequests } = useGams();

  const pendingApprovalsCount =
    (assets?.filter((a) => a.workflowStatus === 'Submitted').length || 0) +
    (vehicleBookings?.filter((b) => b.status === 'Submitted').length || 0) +
    (maintenanceRequests?.filter((m) => m.status === 'Submitted').length || 0) +
    (messengerDeliveries?.filter((d) => d.workflowStatus === 'Submitted').length || 0) +
    (overtimeRequests?.filter((o) => o.status === 'Submitted').length || 0);

  // Modals state
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState<boolean>(false);

  const [approvalModalState, setApprovalModalState] = useState<{
    isOpen: boolean;
    module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime';
    requestId: string;
    requestTitle: string;
  }>({
    isOpen: false,
    module: 'Asset',
    requestId: '',
    requestTitle: ''
  });

  const [labelModalAsset, setLabelModalAsset] = useState<Asset | null>(null);
  const [documentModalState, setDocumentModalState] = useState<{
    isOpen: boolean;
    name: string;
    url?: string;
    category?: string;
  }>({
    isOpen: false,
    name: '',
    url: '',
    category: ''
  });

  const handleOpenApprovalModal = (
    module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime',
    id: string,
    title: string
  ) => {
    setApprovalModalState({
      isOpen: true,
      module,
      requestId: id,
      requestTitle: title
    });
  };

  const handleOpenLabelModal = (asset: Asset) => {
    setLabelModalAsset(asset);
  };

  const handleOpenDocumentModal = (name: string, url?: string, category?: string) => {
    setDocumentModalState({
      isOpen: true,
      name,
      url,
      category
    });
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar (Desktop Persistent & Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <Header
          activeTab={activeTab}
          onOpenGlobalSearch={() => setIsGlobalSearchOpen(true)}
          onOpenAuditTrail={() => setIsAuditTrailOpen(true)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Routing Container with Bottom Padding on Mobile for Bottom Navigation */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-0">
          {activeTab === 'dashboard' && (
            <MainDashboard
              onNavigateToModule={setActiveTab}
              onOpenApprovalModal={handleOpenApprovalModal}
            />
          )}

          {activeTab === 'assets' && (
            <AssetManagementView
              onOpenLabelModal={handleOpenLabelModal}
              onOpenDocumentModal={handleOpenDocumentModal}
              onOpenApprovalModal={handleOpenApprovalModal}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehicleManagementView onOpenApprovalModal={handleOpenApprovalModal} />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceManagementView onOpenApprovalModal={handleOpenApprovalModal} />
          )}

          {activeTab === 'messenger' && (
            <MessengerManagementView onOpenApprovalModal={handleOpenApprovalModal} />
          )}

          {activeTab === 'overtime' && (
            <OvertimeManagementView onOpenApprovalModal={handleOpenApprovalModal} />
          )}

          {activeTab === 'master-data' && <MasterDataView />}

          {activeTab === 'system-admin' && <SystemAdminView />}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          pendingApprovalsCount={pendingApprovalsCount}
        />
      </div>

      {/* Global Modals & Overlay Components */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigateToModule={(mod) => {
          setActiveTab(mod);
          setIsGlobalSearchOpen(false);
        }}
      />

      <AuditTrailModal
        isOpen={isAuditTrailOpen}
        onClose={() => setIsAuditTrailOpen(false)}
      />

      <ApprovalActionDialog
        isOpen={approvalModalState.isOpen}
        onClose={() => setApprovalModalState((prev) => ({ ...prev, isOpen: false }))}
        module={approvalModalState.module}
        requestId={approvalModalState.requestId}
        requestTitle={approvalModalState.requestTitle}
        currentStatus="Submitted"
      />

      <LabelPrinterModal
        asset={labelModalAsset}
        isOpen={!!labelModalAsset}
        onClose={() => setLabelModalAsset(null)}
      />

      <DocumentViewerModal
        isOpen={documentModalState.isOpen}
        onClose={() => setDocumentModalState((prev) => ({ ...prev, isOpen: false }))}
        documentName={documentModalState.name}
        documentUrl={documentModalState.url}
        category={documentModalState.category}
      />
    </div>
  );
}

export default function App() {
  return (
    <GamsProvider>
      <AppContent />
    </GamsProvider>
  );
}
