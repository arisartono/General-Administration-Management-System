import React, { useState } from 'react';
import { useGams } from '../../context/GamsContext';
import { WorkflowStatusBadge } from '../common/WorkflowStatusBadge';
import { formatCurrency, exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportUtils';
import {
  Package,
  Car,
  Wrench,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  onNavigateToModule: (module: string) => void;
  onOpenApprovalModal: (module: 'Asset' | 'Vehicle' | 'Maintenance' | 'Messenger' | 'Overtime', id: string, title: string) => void;
}

export const MainDashboard: React.FC<Props> = ({ onNavigateToModule, onOpenApprovalModal }) => {
  const {
    assets,
    vehicles,
    vehicleBookings,
    maintenanceRequests,
    serviceLogs = [],
    messengerDeliveries,
    overtimeRequests,
    currentRole
  } = useGams();

  const [dateFilter, setDateFilter] = useState('This Month');

  // Calculations for KPIs
  const totalAssetsCount = assets.length;
  const activeVehiclesCount = vehicles.filter((v) => v.status === 'Available' || v.status === 'In Trip').length;
  const totalVehiclesCount = vehicles.length;
  const upcomingMaintenanceCount = maintenanceRequests.filter((m) => m.status === 'Submitted' || m.status === 'Approved').length;
  const messengerActivitiesCount = messengerDeliveries.filter((d) => d.status !== 'Delivered').length;
  const pendingOvertimeCount = overtimeRequests.filter((o) => o.status === 'Submitted').length;

  const pendingApprovalsCount =
    assets.filter((a) => a.workflowStatus === 'Submitted').length +
    vehicleBookings.filter((b) => b.status === 'Submitted').length +
    maintenanceRequests.filter((m) => m.status === 'Submitted').length +
    messengerDeliveries.filter((d) => d.workflowStatus === 'Submitted').length +
    overtimeRequests.filter((o) => o.status === 'Submitted').length;

  // Calculate Monthly Expenses dynamically from base + completed service logs / work order actual costs
  const serviceLogExpenses = serviceLogs.reduce((sum, log) => sum + (log.totalCost || 0), 0);
  const baseOperationalExpense = 42500000;
  const monthlyExpenses = baseOperationalExpense + serviceLogExpenses;

  // Combined Workflow Activities
  const recentActivities = [
    ...assets.map((a) => ({ id: a.id, module: 'Asset', type: 'Asset Registration', user: a.assignedEmployeeName || 'GA Staff', desc: a.name, status: a.workflowStatus, date: a.purchaseDate })),
    ...vehicleBookings.map((b) => ({ id: b.id, module: 'Vehicle', type: 'Vehicle Booking', user: b.employeeName, desc: `${b.vehicleName} to ${b.destination}`, status: b.status, date: b.startDate.slice(0, 10) })),
    ...maintenanceRequests.map((m) => ({ id: m.id, module: 'Maintenance', type: 'Work Order', user: m.requestedBy, desc: m.title, status: m.status, date: '2026-07-24' })),
    ...messengerDeliveries.map((d) => ({ id: d.id, module: 'Messenger', type: 'Courier Dispatch', user: d.senderName, desc: `To ${d.recipientName} (${d.courierName})`, status: d.workflowStatus, date: d.sentDate.slice(0, 10) })),
    ...overtimeRequests.map((o) => ({ id: o.id, module: 'Overtime', type: 'Overtime Request', user: o.employeeName, desc: `${o.totalHours} hrs - ${o.taskDescription}`, status: o.status, date: o.date }))
  ].slice(0, 6);

  // Chart Data Configurations
  const expenseTrendData = {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        fill: true,
        label: 'Monthly GA Operational Expense (IDR)',
        data: [38000000, 42000000, 39500000, 48000000, 41000000, 45820000],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.35,
        pointBackgroundColor: '#4f46e5'
      }
    ]
  };

  const assetDistributionData = {
    labels: ['IT Hardware', 'Furniture', 'Electronics', 'Vehicles', 'Machinery'],
    datasets: [
      {
        data: [45, 20, 15, 12, 8],
        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
        borderWidth: 0
      }
    ]
  };

  const weeklyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Vehicle Trips',
        data: [12, 18, 15, 22, 19, 6, 2],
        backgroundColor: '#4f46e5'
      },
      {
        label: 'Maintenance Orders',
        data: [4, 6, 8, 5, 7, 3, 1],
        backgroundColor: '#f59e0b'
      },
      {
        label: 'Messenger Dispatches',
        data: [15, 22, 19, 25, 20, 8, 3],
        backgroundColor: '#10b981'
      }
    ]
  };

  const handleExportSummaryPDF = () => {
    const rows = recentActivities.map((a) => [a.id, a.module, a.user, a.desc, a.status, a.date]);
    exportToPDF('GAMS Executive Overview Report', ['Request ID', 'Module', 'User', 'Description', 'Status', 'Date'], rows, 'GAMS_Main_Dashboard');
  };

  const handleExportExcel = () => {
    exportToExcel(recentActivities, 'GAMS_Main_Dashboard_Activities');
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Top Banner / Executive Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex flex-wrap items-center gap-2">
            <span>GAMS Integrated Administration Dashboard</span>
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] rounded-full uppercase">
              {currentRole}
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status monitor for Assets, Fleet Vehicles, Facility Maintenance, Courier Dispatches, & Overtime.
          </p>
        </div>

        {/* Quick Report Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <button
            onClick={handleExportSummaryPDF}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>PDF Summary</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel Export</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print View</span>
          </button>
        </div>
      </div>

      {/* 8 KPI CARDS WITH ACCENT TOP BORDERS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Assets */}
        <div
          onClick={() => onNavigateToModule('assets')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-emerald-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Total Assets
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center">
              +12% <TrendingUp className="w-3 h-3 ml-0.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">{totalAssetsCount}</div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex items-center justify-between">
            <span>Verified physical inventory</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
        </div>

        {/* KPI 2: Vehicle Status */}
        <div
          onClick={() => onNavigateToModule('vehicles')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-amber-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Active Fleet
            </span>
            <span className="text-amber-600 dark:text-amber-400 text-xs font-bold">
              {Math.round((activeVehiclesCount / (totalVehiclesCount || 1)) * 100)}%
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {activeVehiclesCount} / {totalVehiclesCount}
          </div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex items-center justify-between">
            <span>1 vehicle in maintenance</span>
            <Car className="w-4 h-4 text-amber-500" />
          </div>
        </div>

        {/* KPI 3: Upcoming Maintenance */}
        <div
          onClick={() => onNavigateToModule('maintenance')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-rose-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Maintenance Due
            </span>
            <span className="text-rose-600 dark:text-rose-400 text-xs font-bold">HIGH</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {upcomingMaintenanceCount}
          </div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex items-center justify-between">
            <span>2 work orders scheduled</span>
            <Wrench className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        {/* KPI 4: Messenger Activities */}
        <div
          onClick={() => onNavigateToModule('messenger')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-indigo-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Courier Dispatches
            </span>
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">LIVE</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {messengerActivitiesCount}
          </div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex items-center justify-between">
            <span>Active in transit deliveries</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
        </div>

        {/* KPI 5: Pending Overtime */}
        <div
          onClick={() => onNavigateToModule('overtime')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-purple-500 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Pending Overtime
            </span>
            <span className="text-purple-600 dark:text-purple-400 text-xs font-bold">HR/GA</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {pendingOvertimeCount}
          </div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex items-center justify-between">
            <span>Requests awaiting review</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
        </div>

        {/* KPI 6: Pending Approval */}
        <div
          onClick={() => onNavigateToModule('dashboard')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-rose-600 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Pending Approvals
            </span>
            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-black rounded uppercase">
              URGENT
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {pendingApprovalsCount}
          </div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex items-center justify-between">
            <span>Cross-module workflows</span>
            <ShieldCheck className="w-4 h-4 text-rose-600" />
          </div>
        </div>

        {/* KPI 7: Monthly Expenses */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-blue-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Monthly Expenses
            </span>
            <span className="text-slate-400 text-xs font-mono font-bold">IDR</span>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
            {formatCurrency(monthlyExpenses, 'IDR')}
          </div>
          <div className="text-slate-400 text-[10px] mt-1 italic flex flex-col space-y-0.5">
            <span>Budget: IDR 50,000,000 ({Math.round((monthlyExpenses / 50000000) * 100)}%)</span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Incl. {formatCurrency(serviceLogExpenses, 'IDR')} Service Logs</span>
          </div>
        </div>

        {/* KPI 8: Open Requests */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm kpi-card border-t-indigo-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
              Open Requests
            </span>
            <span className="text-emerald-500 text-xs font-bold">NORMAL</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">8</div>
          <div className="text-slate-400 text-[10px] mt-1 italic">SLA Compliance: 98.4%</div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Line Chart - Monthly Expense Trend */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Operational Expense Trend (IDR)
              </h3>
              <p className="text-[11px] text-slate-400">Monthly budget consumption & spending history</p>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded px-2 py-1 outline-none font-medium"
            >
              <option>Last 6 Months</option>
              <option>Year 2026</option>
            </select>
          </div>
          <div className="h-56 w-full">
            <Line data={expenseTrendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        {/* Chart 2: Pie Chart - Asset Category Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Asset Distribution</h3>
            <p className="text-[11px] text-slate-400">Inventory count by category</p>
          </div>
          <div className="h-44 w-full my-2 flex items-center justify-center">
            <Pie data={assetDistributionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } } } }} />
          </div>
        </div>
      </div>

      {/* Chart 3: Weekly Activity Breakdown Bar Chart & Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Weekly GA Operational Load Breakdown
            </h3>
            <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
              BAR CHART METRICS
            </span>
          </div>
          <div className="h-48 w-full">
            <Bar data={weeklyActivityData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Heatmap Activity Matrix */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            Activity Heatmap Matrix
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">Daily request density by time of day</p>

          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
            <div className="font-bold text-slate-400">Time</div>
            <div className="font-bold text-slate-400">Mon</div>
            <div className="font-bold text-slate-400">Wed</div>
            <div className="font-bold text-slate-400">Fri</div>
            <div className="font-bold text-slate-400">Sat</div>

            <div className="text-slate-500 font-mono">08:00</div>
            <div className="h-6 bg-indigo-100 rounded text-indigo-800 font-bold flex items-center justify-center">4</div>
            <div className="h-6 bg-indigo-300 rounded text-indigo-900 font-bold flex items-center justify-center">12</div>
            <div className="h-6 bg-indigo-200 rounded text-indigo-900 font-bold flex items-center justify-center">8</div>
            <div className="h-6 bg-slate-100 rounded text-slate-400 font-bold flex items-center justify-center">0</div>

            <div className="text-slate-500 font-mono">12:00</div>
            <div className="h-6 bg-indigo-400 rounded text-white font-bold flex items-center justify-center">18</div>
            <div className="h-6 bg-indigo-600 rounded text-white font-bold flex items-center justify-center">25</div>
            <div className="h-6 bg-indigo-500 rounded text-white font-bold flex items-center justify-center">21</div>
            <div className="h-6 bg-indigo-100 rounded text-indigo-800 font-bold flex items-center justify-center">3</div>

            <div className="text-slate-500 font-mono">16:00</div>
            <div className="h-6 bg-indigo-500 rounded text-white font-bold flex items-center justify-center">22</div>
            <div className="h-6 bg-indigo-400 rounded text-white font-bold flex items-center justify-center">16</div>
            <div className="h-6 bg-indigo-600 rounded text-white font-bold flex items-center justify-center">28</div>
            <div className="h-6 bg-indigo-200 rounded text-indigo-900 font-bold flex items-center justify-center">5</div>
          </div>
        </div>
      </div>

      {/* RECENT WORKFLOW ACTIVITIES TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center">
            Recent Cross-Module Workflow Activities
          </h3>
          <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
            View Complete Workflow Trail <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <th className="px-6 py-3">Request ID</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivities.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {row.id}
                  </td>
                  <td className="px-6 py-3 font-semibold text-slate-800 dark:text-slate-200">
                    {row.module}
                  </td>
                  <td className="px-6 py-3 font-medium">{row.user}</td>
                  <td className="px-6 py-3 truncate max-w-xs">{row.desc}</td>
                  <td className="px-6 py-3">
                    <WorkflowStatusBadge status={row.status as any} />
                  </td>
                  <td className="px-6 py-3 text-slate-400 font-mono text-[11px]">{row.date}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => onOpenApprovalModal(row.module as any, row.id, row.desc)}
                      className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950 rounded transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
