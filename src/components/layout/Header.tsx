import React, { useState } from 'react';
import { useGams } from '../../context/GamsContext';
import { UserRole } from '../../types/gams';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Shield,
  ChevronDown,
  Check,
  X,
  Menu,
  FileText
} from 'lucide-react';

interface Props {
  activeTab: string;
  onOpenGlobalSearch: () => void;
  onOpenAuditTrail: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onOpenGlobalSearch,
  onOpenAuditTrail,
  onOpenMobileMenu
}) => {
  const {
    currentRole,
    setCurrentRole,
    darkMode,
    setDarkMode,
    notifications,
    markNotificationRead,
    clearNotifications
  } = useGams();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const rolesList: UserRole[] = [
    'Super Administrator',
    'General Administration Manager',
    'General Administration Staff',
    'Department Head',
    'Employee'
  ];

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'assets':
        return 'Asset Management';
      case 'vehicles':
        return 'Vehicle Tracking';
      case 'maintenance':
        return 'Maintenance Orders';
      case 'messenger':
        return 'Messenger Delivery';
      case 'overtime':
        return 'Overtime Admin';
      case 'master-data':
        return 'Master Data';
      case 'system-admin':
        return 'System Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 lg:px-8 z-20 shrink-0 sticky top-0">
      {/* Left: Mobile Menu Button & Breadcrumb */}
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Buka Menu Sidebar"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}

        <div className="flex items-center">
          <nav className="flex text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
            <ol className="inline-flex items-center space-x-1.5 sm:space-x-2">
              <li className="hidden sm:inline hover:text-indigo-600 transition-colors">Home</li>
              <li className="hidden sm:inline">/</li>
              <li className="text-indigo-600 dark:text-indigo-400 font-bold truncate max-w-[140px] sm:max-w-none">
                {getBreadcrumb()}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-3">
        {/* Global Search Button (Desktop: Input box, Mobile: Compact Icon) */}
        <button
          onClick={onOpenGlobalSearch}
          className="hidden md:flex relative items-center w-48 lg:w-64 pl-3 pr-8 py-1.5 text-xs text-slate-400 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 hover:border-indigo-500 cursor-pointer transition-colors"
        >
          <Search className="w-3.5 h-3.5 mr-2 text-indigo-500 shrink-0" />
          <span className="truncate">Cari aset, kendaraan, WO...</span>
          <kbd className="absolute right-2 px-1.5 py-0.5 text-[9px] font-mono bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onOpenGlobalSearch}
          className="md:hidden p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Cari Data"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Audit Trail Button */}
        <button
          onClick={onOpenAuditTrail}
          title="System Audit Trail & Logs"
          className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <Shield className="w-4 h-4" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title="Mode Gelap / Terang"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                  Notifikasi ({unreadCount})
                </span>
                <button
                  onClick={clearNotifications}
                  className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Bersihkan
                </button>
              </div>

              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">Tidak ada notifikasi baru</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        n.read
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500'
                          : 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span>{n.title}</span>
                        <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[10px] mt-0.5 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

        {/* Role Switching Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline truncate max-w-[120px] lg:max-w-none">
              Role: {currentRole}
            </span>
            <span className="sm:hidden truncate max-w-[80px]">
              {currentRole.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 shrink-0" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-60 sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                Pilih Role Akses
              </div>
              {rolesList.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setCurrentRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between font-medium hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    currentRole === role
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="truncate">{role}</span>
                  {currentRole === role && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
