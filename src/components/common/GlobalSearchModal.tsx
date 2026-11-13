import React from 'react';
import { useGams } from '../../context/GamsContext';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { Search, Package, Car, Wrench, Send, Clock, X, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule: (module: string) => void;
}

export const GlobalSearchModal: React.FC<Props> = ({ isOpen, onClose, onNavigateToModule }) => {
  const {
    globalSearchQuery,
    setGlobalSearchQuery,
    assets,
    vehicles,
    maintenanceRequests,
    messengerDeliveries,
    overtimeRequests,
    employees
  } = useGams();

  if (!isOpen) return null;

  const query = globalSearchQuery.toLowerCase().trim();

  const filteredAssets = query
    ? assets.filter(
        (a) =>
          a.id.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.categoryName.toLowerCase().includes(query) ||
          a.brandModel.toLowerCase().includes(query)
      )
    : [];

  const filteredVehicles = query
    ? vehicles.filter(
        (v) =>
          v.id.toLowerCase().includes(query) ||
          v.brandModel.toLowerCase().includes(query) ||
          v.assignedDriverName?.toLowerCase().includes(query)
      )
    : [];

  const filteredWorkOrders = query
    ? maintenanceRequests.filter(
        (m) =>
          m.id.toLowerCase().includes(query) ||
          m.title.toLowerCase().includes(query) ||
          m.targetName.toLowerCase().includes(query)
      )
    : [];

  const filteredDeliveries = query
    ? messengerDeliveries.filter(
        (d) =>
          d.id.toLowerCase().includes(query) ||
          d.trackingNumber.toLowerCase().includes(query) ||
          d.recipientName.toLowerCase().includes(query)
      )
    : [];

  const filteredOvertime = query
    ? overtimeRequests.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.employeeName.toLowerCase().includes(query) ||
          o.taskDescription.toLowerCase().includes(query)
      )
    : [];

  const filteredEmployees = query
    ? employees.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.id.toLowerCase().includes(query) ||
          e.departmentName.toLowerCase().includes(query)
      )
    : [];

  const totalResults =
    filteredAssets.length +
    filteredVehicles.length +
    filteredWorkOrders.length +
    filteredDeliveries.length +
    filteredOvertime.length +
    filteredEmployees.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <input
            type="text"
            autoFocus
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Type to search across Assets, Vehicles, Work Orders, Courier, Overtime, Employees..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-md">
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!query ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
              <p className="font-semibold text-slate-600 dark:text-slate-300">Global Search Engine Active</p>
              <p className="mt-1">Try searching for asset tag e.g. <span className="font-mono text-indigo-600">AST-2024-001</span>, plate <span className="font-mono text-indigo-600">B 1982 GAMS</span>, or staff name <span className="font-mono text-indigo-600">Michael</span></p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Assets Section */}
              {filteredAssets.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b pb-1">
                    <span className="flex items-center"><Package className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Assets ({filteredAssets.length})</span>
                    <button onClick={() => { onNavigateToModule('assets'); onClose(); }} className="text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-1.5">
                    {filteredAssets.map((a) => (
                      <div key={a.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{a.name} <span className="font-mono text-indigo-600 ml-2">[{a.id}]</span></p>
                          <p className="text-slate-500 text-[11px]">{a.categoryName} • {a.locationName}</p>
                        </div>
                        <WorkflowStatusBadge status={a.workflowStatus} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vehicles Section */}
              {filteredVehicles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b pb-1">
                    <span className="flex items-center"><Car className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> Vehicles ({filteredVehicles.length})</span>
                    <button onClick={() => { onNavigateToModule('vehicles'); onClose(); }} className="text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-1.5">
                    {filteredVehicles.map((v) => (
                      <div key={v.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{v.brandModel} <span className="font-mono text-indigo-600 ml-2">[{v.id}]</span></p>
                          <p className="text-slate-500 text-[11px]">Driver: {v.assignedDriverName || 'Pool'}</p>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded">{v.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maintenance Work Orders */}
              {filteredWorkOrders.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b pb-1">
                    <span className="flex items-center"><Wrench className="w-3.5 h-3.5 mr-1.5 text-rose-500" /> Maintenance Work Orders ({filteredWorkOrders.length})</span>
                    <button onClick={() => { onNavigateToModule('maintenance'); onClose(); }} className="text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-1.5">
                    {filteredWorkOrders.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{m.title} <span className="font-mono text-indigo-600 ml-2">[{m.id}]</span></p>
                          <p className="text-slate-500 text-[11px]">Target: {m.targetName}</p>
                        </div>
                        <WorkflowStatusBadge status={m.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overtime & Employees */}
              {filteredOvertime.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 border-b pb-1">
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Overtime ({filteredOvertime.length})</span>
                    <button onClick={() => { onNavigateToModule('overtime'); onClose(); }} className="text-indigo-600 hover:underline">View All</button>
                  </div>
                  <div className="space-y-1.5">
                    {filteredOvertime.map((o) => (
                      <div key={o.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{o.employeeName} - {o.taskDescription} <span className="font-mono text-indigo-600 ml-2">[{o.id}]</span></p>
                          <p className="text-slate-500 text-[11px]">{o.date} ({o.totalHours} Hours)</p>
                        </div>
                        <WorkflowStatusBadge status={o.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
