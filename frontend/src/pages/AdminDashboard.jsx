import { useEffect, useState, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Download, Shield, CheckCircle, Clock, Truck, XCircle, BarChart2, Eye, MapPin, Map, List, UserCheck } from 'lucide-react';
import FreeMap from '../components/FreeMap';
import GlobalOperationsMap from '../components/GlobalOperationsMap';
import { AuthContext } from '../context/AuthContext';

const STATUS_CONFIG = {
  PENDING:    { label: 'Pending',    cls: 'badge-pending',    next: 'APPROVED'   },
  APPROVED:   { label: 'Approved',   cls: 'badge-approved',   next: 'DISPATCHED' },
  DISPATCHED: { label: 'Dispatched', cls: 'badge-dispatched', next: 'COMPLETED'  },
  EN_ROUTE:   { label: 'En Route',   cls: 'badge-dispatched', next: 'ARRIVING'   },
  ARRIVING:   { label: 'Arriving',   cls: 'badge-dispatched', next: 'COMPLETED'  },
  COMPLETED:  { label: 'Completed',  cls: 'badge-completed',  next: null         },
  CANCELLED:  { label: 'Cancelled',  cls: 'badge-cancelled',  next: null         },
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-2xl p-5 shadow-sm border-b-4 ${color} flex items-center justify-between`}>
    <div>
      <p className="text-gray-500 text-sm font-semibold mb-1">{label}</p>
      <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center`}>{icon}</div>
  </div>
);

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [stats, setStats] = useState({ total:0, pending:0, approved:0, dispatched:0, completed:0, cancelled:0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map' | 'approvals'
  const [mapBooking, setMapBooking] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { user } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchPendingDrivers()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data.reverse());
        
        // Calculate basic stats manually for now
        const bs = data.data;
        setStats({
          total: bs.length,
          pending: bs.filter(b => b.status === 'PENDING').length,
          approved: bs.filter(b => b.status === 'APPROVED').length,
          dispatched: bs.filter(b => b.status === 'DISPATCHED' || b.status === 'EN_ROUTE' || b.status === 'ARRIVING').length,
          completed: bs.filter(b => b.status === 'COMPLETED').length,
          cancelled: bs.filter(b => b.status === 'CANCELLED').length,
        });
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchPendingDrivers = async () => {
    try {
      const token = localStorage.getItem('cpy_user') ? JSON.parse(localStorage.getItem('cpy_user')).token : '';
      const res = await fetch(`${API_URL}/admin/pending-drivers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingDrivers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending drivers:', error);
    }
  };

  const handleApproveDriver = async (id) => {
    try {
      const token = localStorage.getItem('cpy_user') ? JSON.parse(localStorage.getItem('cpy_user')).token : '';
      const res = await fetch(`${API_URL}/admin/approve-driver/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingDrivers(pendingDrivers.filter(d => d._id !== id));
      } else {
        alert(data.message || 'Failed to approve driver');
      }
    } catch (error) {
      console.error('Error approving driver:', error);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    } catch (_) {}
  };

  const exportCSV = () => {
    const headers = ['Booking ID','Patient','Phone','Emergency','Address','Status','Date'];
    const rows = bookings.map(b => [
      b.bookingId, b.patientName, b.phone, b.emergencyType,
      `"${b.address}"`, b.status, new Date(b.createdAt).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'bookings.csv' });
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);
  const activeBookings = bookings.filter(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-400" /> Command Center
            </h1>
            {lastUpdated && <p className="text-gray-400 text-sm mt-0.5">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500 transition-colors">
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard icon={<BarChart2 className="h-5 w-5 text-gray-400" />}    label="Total"     value={stats.total}     color="border-gray-400" />
          <StatCard icon={<Clock className="h-5 w-5 text-yellow-500" />}      label="Pending"   value={stats.pending}   color="border-yellow-500" />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-green-500" />} label="Approved"  value={stats.approved}  color="border-green-500" />
          <StatCard icon={<Truck className="h-5 w-5 text-blue-500" />}        label="Dispatched"value={stats.dispatched} color="border-blue-500" />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}label="Completed"value={stats.completed} color="border-emerald-500" />
          <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />}       label="Cancelled" value={stats.cancelled}  color="border-red-500" />
        </div>

        {/* Filter Tabs & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'APPROVED', 'DISPATCHED', 'COMPLETED', 'CANCELLED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'list' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'map' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Map className="h-4 w-4" /> Live Map
            </button>
            <button
              onClick={() => setViewMode('approvals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                viewMode === 'approvals' ? 'bg-red-50 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <UserCheck className="h-4 w-4" /> Drivers
              {pendingDrivers.length > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingDrivers.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="w-full h-[700px] bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
            {activeBookings.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm z-10">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No active emergencies to track</p>
                </div>
              </div>
            ) : (
              <GlobalOperationsMap bookings={activeBookings} />
            )}
          </div>
        ) : viewMode === 'approvals' ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Pending Driver Approvals</h2>
            </div>
            
            {pendingDrivers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <UserCheck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>No drivers pending approval right now.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {pendingDrivers.map((driver) => (
                      <tr key={driver._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-gray-900">{driver.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{driver.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(driver.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleApproveDriver(driver._id)}
                            className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-xl font-bold transition-colors"
                          >
                            Approve Driver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-premium rounded-2xl p-16 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-400 font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filtered.map((b) => {
              const sc = STATUS_CONFIG[b.status?.toUpperCase()] || STATUS_CONFIG.PENDING;
              const showMap = mapBooking === b._id;
              return (
                <div key={b._id} className="card-premium rounded-2xl overflow-hidden">
                  <div className="p-5">
                    {/* Top row */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-gray-900">{b.bookingId}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${sc.cls}`}>{sc.label}</span>
                        </div>
                        <p className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleString()}</p>
                      </div>
                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2">
                        {sc.next && (
                          <button
                            onClick={() => changeStatus(b._id, sc.next)}
                            className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors"
                          >
                            → {STATUS_CONFIG[sc.next]?.label}
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                          <button
                            onClick={() => changeStatus(b._id, 'CANCELLED')}
                            className="px-4 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-xl hover:bg-red-200 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <Link
                          to={`/tracking/${b._id}`}
                          className="px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-xl hover:bg-blue-200 transition-colors"
                        >
                          Track
                        </Link>
                        <Link
                          to={`/driver/${b._id}`}
                          target="_blank"
                          className="px-4 py-2 bg-orange-100 text-orange-700 text-xs font-bold rounded-xl hover:bg-orange-200 transition-colors flex items-center gap-1"
                        >
                          <Truck className="h-3 w-3" /> Driver App
                        </Link>
                        <button
                          onClick={() => setMapBooking(showMap ? null : b._id)}
                          className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                          title="View on map"
                        >
                          {showMap ? <Eye className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    {/* Details row */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-gray-400 text-xs">Patient</span><p className="font-semibold text-gray-900 truncate">{b.patientName}</p></div>
                      <div><span className="text-gray-400 text-xs">Phone</span><p className="font-semibold text-gray-900">+91 {b.phone}</p></div>
                      <div><span className="text-gray-400 text-xs">Emergency</span><p className="font-semibold text-gray-900">{b.emergencyType}</p></div>
                      <div><span className="text-gray-400 text-xs">Address</span><p className="font-medium text-gray-700 truncate">{b.address}</p></div>
                    </div>
                  </div>
                  {/* Mini Map */}
                  {showMap && b.latitude && b.longitude && (
                    <div className="border-t border-gray-100 p-4">
                      <FreeMap lat={b.latitude} lng={b.longitude} interactive={false} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
