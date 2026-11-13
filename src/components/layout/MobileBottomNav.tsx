import React from 'react';
import {
  LayoutDashboard,
  Package,
  Car,
  Wrench,
  Send,
  Clock,
  Menu,
  MoreHorizontal
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  pendingApprovalsCount?: number;
}

export const MobileBottomNav: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
  pendingApprovalsCount = 0
}) => {
  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Aset', icon: Package },
    { id: 'vehicles', label: 'Armada', icon: Car },
    { id: 'maintenance', label: 'Servis', icon: Wrench },
    { id: 'messenger', label: 'Kurir', icon: Send },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-1 py-1 shadow-2xl transition-all">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-w-[56px] min-h-[48px] ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60 scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'dashboard' && pendingApprovalsCount > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-rose-500 text-white text-[9px] font-black rounded-full ring-2 ring-white dark:ring-slate-900">
                    {pendingApprovalsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium tracking-tight truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Menu / Lainnya Drawer Trigger */}
        <button
          onClick={onOpenMobileMenu}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all min-w-[56px] min-h-[48px] ${
            ['overtime', 'master-data', 'system-admin'].includes(activeTab)
              ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/60'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5 stroke-2" />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">Menu</span>
        </button>
      </div>
    </div>
  );
};
