import React from 'react';
import { useGams } from '../../context/GamsContext';
import {
  LayoutDashboard,
  Package,
  Car,
  Wrench,
  Send,
  Clock,
  Database,
  Settings,
  ShieldCheck,
  X,
  ChevronRight
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { currentRole, currentUser } = useGams();

  const coreModules = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-3 shrink-0" /> },
    { id: 'assets', label: 'Asset Management', icon: <Package className="w-4 h-4 mr-3 shrink-0" /> },
    { id: 'vehicles', label: 'Vehicle Tracking', icon: <Car className="w-4 h-4 mr-3 shrink-0" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4 mr-3 shrink-0" /> },
    { id: 'messenger', label: 'Messenger / GA', icon: <Send className="w-4 h-4 mr-3 shrink-0" /> },
    { id: 'overtime', label: 'Overtime Admin', icon: <Clock className="w-4 h-4 mr-3 shrink-0" /> }
  ];

  const configModules = [
    { id: 'master-data', label: 'Master Data', icon: <Database className="w-4 h-4 mr-3 shrink-0" /> },
    { id: 'system-admin', label: 'System Settings', icon: <Settings className="w-4 h-4 mr-3 shrink-0" /> }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800 select-none">
      {/* App Logo & Mobile Close */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
            G
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center">
              GAMS <span className="font-medium text-slate-400 text-xs ml-1.5 bg-slate-800 px-1.5 py-0.5 rounded">v1.0</span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">Enterprise General Admin</p>
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-3">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Core Modules
        </div>
        {coreModules.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center px-3.5 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold scale-[1.01]'
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-300 active:bg-slate-800'
              }`}
            >
              <span className="flex items-center">{item.icon}</span>
              <span className="truncate flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
            </button>
          );
        })}

        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mt-6 mb-2">
          Configuration
        </div>
        {configModules.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center px-3.5 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold scale-[1.01]'
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-300 active:bg-slate-800'
              }`}
            >
              <span className="flex items-center">{item.icon}</span>
              <span className="truncate flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
            </button>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-full border-2 border-indigo-500/50 object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
          <p className="text-[10px] text-indigo-400 font-semibold truncate flex items-center mt-0.5">
            <ShieldCheck className="w-3 h-3 mr-1 shrink-0" />
            {currentRole}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-full shadow-xl">
        {SidebarContent}
      </aside>

      {/* Mobile Off-Canvas Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10 transition-transform duration-300 ease-in-out">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
