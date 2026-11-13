import React, { useState } from 'react';
import { useGams } from '../../../context/GamsContext';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';
import {
  Users,
  Building2,
  Store,
  MapPin,
  Tag,
  Plus,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';

export const MasterDataView: React.FC = () => {
  const {
    employees,
    departments,
    vendors,
    locations,
    assetCategories,
    addEmployee,
    deleteEmployee,
    addVendor,
    deleteVendor,
    deleteDepartment,
    deleteLocation,
    deleteAssetCategory
  } = useGams();

  const [activeTab, setActiveTab] = useState<'employee' | 'department' | 'vendor' | 'location' | 'category'>('employee');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal form states
  const [empName, setEmpName] = useState('');
  const [empDept, setEmpDept] = useState('General Administration');
  const [empPos, setEmpPos] = useState('Staff Officer');
  const [empEmail, setEmpEmail] = useState('');

  const [vendorName, setVendorName] = useState('');
  const [vendorCat, setVendorCat] = useState<'IT Hardware' | 'Vehicle Service' | 'Facility & Maintenance' | 'Courier' | 'Stationery & Office' | 'Other'>('IT Hardware');
  const [vendorContact, setVendorContact] = useState('');

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.departmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveAdd = () => {
    if (activeTab === 'employee') {
      addEmployee({ name: empName, departmentName: empDept, position: empPos, email: empEmail });
      setEmpName('');
    } else if (activeTab === 'vendor') {
      addVendor({ name: vendorName, category: vendorCat, contactPerson: vendorContact });
      setVendorName('');
    }
    setShowAddModal(false);
  };

  const handleExportExcel = () => {
    if (activeTab === 'employee') exportToExcel(employees, 'GAMS_Employees_MasterData');
    if (activeTab === 'vendor') exportToExcel(vendors, 'GAMS_Vendors_MasterData');
  };

  return (
    <div className="p-3.5 sm:p-5 lg:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center">
            <Store className="w-5 h-5 mr-2 text-indigo-600" /> Master Data Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Maintain system parameters for Employees, Departments, Vendors, Locations, & Asset Categories.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center space-x-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Master Data</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center space-x-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Record</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-sm overflow-x-auto gap-1 sm:gap-0">
        <button
          onClick={() => setActiveTab('employee')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'employee'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employees ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('department')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'department'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vendor')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'vendor'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Vendors ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('location')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'location'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Locations ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('category')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'category'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Asset Categories ({assetCategories.length})</span>
        </button>
      </div>

      {/* Filter / Search Controls */}
      <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="flex-1 bg-transparent text-xs font-medium outline-none text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Content Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {activeTab === 'employee' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Division</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{emp.id}</td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <img src={emp.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <span>{emp.name}</span>
                  </td>
                  <td className="px-6 py-3 font-medium">{emp.departmentName}</td>
                  <td className="px-6 py-3 text-slate-500">{emp.division}</td>
                  <td className="px-6 py-3">{emp.position}</td>
                  <td className="px-6 py-3 font-mono text-[11px] text-slate-500">{emp.email}</td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus data karyawan "${emp.name}" (${emp.id})?`)) {
                          deleteEmployee(emp.id);
                        }
                      }}
                      title="Hapus Karyawan"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'vendor' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Vendor Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Contact Person</th>
                <th className="px-6 py-3">Phone / Email</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{v.code}</td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100">{v.name}</td>
                  <td className="px-6 py-3 font-semibold">{v.category}</td>
                  <td className="px-6 py-3">{v.contactPerson}</td>
                  <td className="px-6 py-3 font-mono text-[11px] text-slate-500">{v.phone}</td>
                  <td className="px-6 py-3 font-bold text-amber-600">{v.rating} / 5.0</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus data vendor "${v.name}" (${v.code})?`)) {
                          deleteVendor(v.id);
                        }
                      }}
                      title="Hapus Vendor"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'department' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Dept Code</th>
                <th className="px-6 py-3">Department Name</th>
                <th className="px-6 py-3">Department Head</th>
                <th className="px-6 py-3">Employee Count</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600">{d.code}</td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100">{d.name}</td>
                  <td className="px-6 py-3 font-medium">{d.headName}</td>
                  <td className="px-6 py-3 font-bold">{d.employeeCount} Staff</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus departemen "${d.name}" (${d.code})?`)) {
                          deleteDepartment(d.id);
                        }
                      }}
                      title="Hapus Departemen"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'location' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Location ID</th>
                <th className="px-6 py-3">Building</th>
                <th className="px-6 py-3">Floor</th>
                <th className="px-6 py-3">Room / Specific Spot</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600">{loc.id}</td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100">{loc.building}</td>
                  <td className="px-6 py-3 font-medium">{loc.floor}</td>
                  <td className="px-6 py-3">{loc.room}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus lokasi "${loc.building} - ${loc.room}" (${loc.id})?`)) {
                          deleteLocation(loc.id);
                        }
                      }}
                      title="Hapus Lokasi"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'category' && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Category Name</th>
                <th className="px-6 py-3">Useful Life</th>
                <th className="px-6 py-3">Depreciation Rate</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {assetCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-3 font-mono font-bold text-indigo-600">{cat.code}</td>
                  <td className="px-6 py-3 font-bold text-slate-900 dark:text-slate-100">{cat.name}</td>
                  <td className="px-6 py-3 font-semibold">{cat.usefulLifeYears} Years</td>
                  <td className="px-6 py-3 font-mono font-bold text-emerald-600">{cat.depreciationRatePercent}% / yr</td>
                  <td className="px-6 py-3 text-slate-500">{cat.description}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Apakah Anda yakin ingin menghapus kategori aset "${cat.name}" (${cat.code})?`)) {
                          deleteAssetCategory(cat.id);
                        }
                      }}
                      title="Hapus Kategori Aset"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors inline-flex"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add New Dialog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Add New {activeTab.toUpperCase()}
            </h3>

            {activeTab === 'employee' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Employee Full Name</label>
                  <input
                    type="text"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Department</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Position</label>
                  <input
                    type="text"
                    value={empPos}
                    onChange={(e) => setEmpPos(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={vendorContact}
                    onChange={(e) => setVendorContact(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdd}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
