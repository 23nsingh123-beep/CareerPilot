import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/useToast';

function AdminUserManagement() {
  const { currentUser } = useAuth();
  
  // Stats state
  const [stats, setStats] = useState({ totalUsers: 0, students: 0, recruiters: 0, activeUsers: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Table state
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Pagination
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const { showToast, ToastComponent } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Drawer state
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);

  // Modal state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedNewRole, setSelectedNewRole] = useState('');

  // Scroll lock and Escape key handling
  useEffect(() => {
    if (selectedUserId || roleModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (roleModalOpen) setRoleModalOpen(false);
        else if (selectedUserId) closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedUserId, roleModalOpen]);

  useEffect(() => {
    fetchStats();
    
    // Parse query params on initial load
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    const statusParam = params.get('status');
    const emailParam = params.get('email');
    
    if (roleParam) setRoleFilter(roleParam);
    if (statusParam) setStatusFilter(statusParam);
    if (emailParam) setSearch(emailParam);
    
    setInitialLoadDone(true);
  }, []);

  useEffect(() => {
    if (initialLoadDone) {
      setPage(1);
      fetchUsers();
    }
  }, [search, roleFilter, statusFilter, initialLoadDone]);

  useEffect(() => {
    if (initialLoadDone) {
      fetchUsers();
    }
  }, [page]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await adminService.getDashboardData();
      if (res && res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter !== 'All') params.role = roleFilter;
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await adminService.getUsers(params);
      if (res && res.success) {
        setUsers(res.users);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
        
        // Auto-open drawer if exactly one result and we searched by exact email via query param
        const emailParam = new URLSearchParams(location.search).get('email');
        if (emailParam && res.users.length === 1 && res.users[0].email === emailParam && !selectedUserId) {
          openDrawer(res.users[0]._id);
          // Clear it from URL so it doesn't keep triggering
          navigate('/admin/users', { replace: true });
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = async (userId) => {
    setSelectedUserId(userId);
    setDrawerLoading(true);
    setDrawerError(null);
    try {
      const res = await adminService.getUserById(userId);
      if (res && res.success) {
        setSelectedUser(res.user);
      }
    } catch (err) {
      setDrawerError(err.response?.data?.error || 'Failed to load user details');
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedUserId(null);
    setSelectedUser(null);
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    
    if (selectedUser._id === currentUser._id) {
      showToast('You cannot suspend your own account.', 'error');
      return;
    }

    const newStatus = !selectedUser.isActive;
    
    if (!newStatus) { // Suspending
      if (!window.confirm(`Are you sure you want to suspend ${selectedUser.name}?`)) return;
    }

    try {
      const res = await adminService.updateUserStatus(selectedUser._id, newStatus);
      if (res && res.success) {
        setSelectedUser(prev => ({ ...prev, isActive: newStatus }));
        setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, isActive: newStatus } : u));
        fetchStats(); // Update active count
        showToast(`User ${newStatus ? 'activated' : 'suspended'} successfully.`, 'success');
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update user status', 'error');
    }
  };

  const openRoleModal = () => {
    if (!selectedUser) return;
    if (selectedUser._id === currentUser._id) {
      showToast('You cannot change your own role.', 'error');
      return;
    }
    setSelectedNewRole(selectedUser.role);
    setRoleModalOpen(true);
  };

  const submitChangeRole = async () => {
    if (!selectedUser) return;
    try {
      const res = await adminService.updateUserRole(selectedUser._id, selectedNewRole);
      if (res && res.success) {
        setSelectedUser(prev => ({ ...prev, role: selectedNewRole }));
        setUsers(prev => prev.map(u => u._id === selectedUser._id ? { ...u, role: selectedNewRole } : u));
        fetchStats(); 
        showToast('User role updated successfully.', 'success');
        setRoleModalOpen(false);
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    if (selectedUser._id === currentUser._id) {
      showToast('You cannot delete your own account.', 'error');
      return;
    }
    
    if (!window.confirm(`WARNING: Are you absolutely sure you want to permanently delete ${selectedUser.name}? This action cannot be undone.`)) return;

    try {
      const res = await adminService.deleteUser(selectedUser._id);
      if (res && res.success) {
        showToast('User deleted successfully', 'success');
        closeDrawer();
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete user';
      showToast(errorMessage, 'error');
      if (errorMessage.includes('associated')) {
         // It's a constraint warning. Show it explicitly.
         alert(`DELETION BLOCKED:\n\n${errorMessage}\n\nYou must remove associated records before deleting this user.`);
      }
    }
  };

  return (
    <div className="max-w-container-max mx-auto w-full flex-1 mb-24 relative">
      <ToastComponent />
      {/* Page Header */}
      <header className="mb-2xl">
        <h1 className="text-headline-lg font-headline-lg text-on-surface">User Management</h1>
        <p className="text-body-md text-on-surface-variant mt-xs">View, manage, and monitor all student, recruiter, and administrator accounts.</p>
      </header>

      <div className="flex flex-col gap-xl items-start w-full">
        <div className="flex flex-col gap-lg min-w-0 w-full relative">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-lg">
            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-md">
                <span className="text-label-md font-label-md text-on-surface-variant">Total Users</span>
              </div>
              <p className="text-headline-md font-bold">{statsLoading ? '...' : stats.totalUsers}</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-md">
                <span className="text-label-md font-label-md text-on-surface-variant">Students</span>
              </div>
              <p className="text-headline-md font-bold">{statsLoading ? '...' : stats.students}</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-md">
                <span className="text-label-md font-label-md text-on-surface-variant">Recruiters</span>
              </div>
              <p className="text-headline-md font-bold">{statsLoading ? '...' : stats.recruiters}</p>
            </div>
            <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start mb-md">
                <span className="text-label-md font-label-md text-on-surface-variant">Active Accounts</span>
              </div>
              <p className="text-headline-md font-bold">{statsLoading ? '...' : stats.activeUsers}</p>
            </div>
          </div>
          
          {/* Search & Filters */}
          <div className="bg-surface-container-lowest py-sm px-md rounded-xl border border-outline-variant flex flex-wrap items-center gap-md">
            <div className="flex-1 min-w-[200px] relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
              <input 
                className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-sm font-body-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                placeholder="Search by name or email..." 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="bg-surface-container-low border-none rounded-lg px-md py-2 text-label-md font-label-md focus:ring-2 focus:ring-primary/20 outline-none"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">Role: All</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
            <select 
              className="bg-surface-container-low border-none rounded-lg px-md py-2 text-label-md font-label-md focus:ring-2 focus:ring-primary/20 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="h-8 w-[1px] bg-outline-variant hidden md:block"></div>
            <button onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); setPage(1); }} className="text-on-surface-variant font-label-md text-label-md hover:text-on-surface">Clear filters</button>
          </div>
          
          {/* Error Feed */}
          {error && (
            <div className="bg-error-container text-error p-md rounded-xl flex justify-between items-center">
              <span>{error}</span>
              <button onClick={fetchUsers} className="underline font-bold">Retry</button>
            </div>
          )}

          {/* User Table */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] overflow-x-auto relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
              </div>
            )}
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="p-md text-label-md font-bold text-on-surface-variant">User</th>
                  <th className="p-md text-label-md font-bold text-on-surface-variant">Role</th>
                  <th className="p-md text-label-md font-bold text-on-surface-variant">Status</th>
                  <th className="p-md text-label-md font-bold text-on-surface-variant">Reg. Date</th>
                  <th className="p-md text-label-md font-bold text-on-surface-variant">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-xl text-center text-on-surface-variant">No users found.</td>
                  </tr>
                )}
                {users.map(user => (
                  <tr 
                    key={user._id} 
                    onClick={() => openDrawer(user._id)}
                    className={`hover:bg-surface-container-low transition-colors group cursor-pointer border-l-4 ${selectedUserId === user._id ? 'border-primary bg-surface-container-low' : 'border-transparent'}`}
                  >
                    <td className="p-md py-lg">
                      <div className="flex items-center gap-md">
                        {user.profileImage ? (
                          <img className="w-10 h-10 rounded-full object-cover" alt={user.name} src={user.profileImage} />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold">{user.name?.charAt(0)}</div>
                        )}
                        <div>
                          <p className="text-label-md font-bold">{user.name}</p>
                          <p className="text-body-sm text-on-surface-variant">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-md py-lg uppercase">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${user.role === 'student' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : user.role === 'recruiter' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-md py-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-error'}`}></div>
                        <span className="text-label-md text-on-surface">{user.isActive ? 'Active' : 'Inactive'}</span>
                      </div>
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant py-lg">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-md text-body-sm text-on-surface-variant py-lg">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-md border-t border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-sm">
              <span className="text-body-sm text-on-surface-variant">Showing {users.length} of {totalCount} users</span>
              <div className="flex gap-sm">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-1 border border-outline-variant rounded-lg text-label-md font-label-md hover:bg-surface-container-low disabled:opacity-50 transition-colors">Previous</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-1 bg-primary text-on-primary rounded-lg text-label-md font-label-md hover:bg-primary-container disabled:opacity-50 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop for all screens */}
        {selectedUserId && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[45]" onClick={closeDrawer}></div>
        )}

        {/* Right Sidebar Panel (Drawer) */}
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-full bg-surface z-[50] shadow-2xl border-l border-outline-variant transform transition-transform duration-300 ease-in-out ${selectedUserId ? 'translate-x-0' : 'translate-x-full'} flex flex-col overflow-y-auto`}>
          
          <div className="bg-surface-container-lowest min-h-full">
            {drawerLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-primary text-3xl mb-4">refresh</span>
                <p>Loading user details...</p>
              </div>
            ) : drawerError ? (
              <div className="p-lg text-center text-error">
                <p>{drawerError}</p>
                <button onClick={closeDrawer} className="mt-4 text-primary font-bold hover:underline">Close</button>
              </div>
            ) : selectedUser ? (
              <>
                <div className="p-lg bg-primary-container/5 border-b border-outline-variant flex flex-col items-center gap-md text-center relative">
                  <button onClick={closeDrawer} className="absolute top-4 right-4 p-1 hover:bg-surface-container rounded-full">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="relative mt-4">
                    {selectedUser.profileImage ? (
                      <img className="w-24 h-24 rounded-full border-4 border-surface object-cover shadow-md" alt={selectedUser.name} src={selectedUser.profileImage} />
                    ) : (
                      <div className="w-24 h-24 rounded-full border-4 border-surface shadow-md bg-surface-variant flex items-center justify-center text-3xl font-bold">{selectedUser.name?.charAt(0)}</div>
                    )}
                    <span className={`absolute bottom-1 right-1 w-5 h-5 border-2 border-surface rounded-full ${selectedUser.isActive ? 'bg-green-500' : 'bg-error'}`}></span>
                  </div>
                  <div>
                    <h3 className="text-headline-md font-bold">{selectedUser.name}</h3>
                    <p className="text-body-sm text-on-surface-variant break-words break-all px-4 text-center">{selectedUser.email}</p>
                    <div className="mt-md flex justify-center gap-sm">
                      <span className={`px-3 py-1 rounded-full text-label-sm font-bold uppercase ${selectedUser.role === 'student' ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : selectedUser.role === 'recruiter' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-primary-fixed text-on-primary-fixed-variant'}`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-label-sm font-bold ${selectedUser.isActive ? 'bg-green-100 text-green-700' : 'bg-error-container text-on-error-container'}`}>
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-lg flex flex-col gap-lg">
                  <div>
                    <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-sm">Profile Details</p>
                    <div className="space-y-md">
                      {selectedUser.phone && (
                        <div className="flex justify-between">
                          <span className="text-body-sm text-on-surface-variant">Phone</span>
                          <span className="text-body-sm font-bold">{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.location && (
                        <div className="flex justify-between">
                          <span className="text-body-sm text-on-surface-variant">Location</span>
                          <span className="text-body-sm font-bold">{selectedUser.location}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-body-sm text-on-surface-variant">Joined</span>
                        <span className="text-body-sm font-bold">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-sm text-on-surface-variant">Last Login</span>
                        <span className="text-body-sm font-bold">{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUser.role === 'student' && (
                    <div>
                      <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-sm">Student Stats</p>
                      <div className="space-y-md">
                        <div className="flex justify-between">
                          <span className="text-body-sm text-on-surface-variant">Resume Uploaded</span>
                          <span className="text-body-sm font-bold">{selectedUser.resumeOriginalName ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-body-sm text-on-surface-variant">AI Analysis</span>
                          <span className="text-body-sm font-bold">{selectedUser.resumeAnalysis?.analyzedAt ? 'Completed' : 'Pending'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-body-sm text-on-surface-variant">Applications</span>
                          <span className="text-body-sm font-bold">{selectedUser.applicationCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedUser.role === 'recruiter' && (
                    <div>
                      <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider mb-sm">Recruiter Stats</p>
                      <div className="space-y-md">
                        <div className="flex justify-between">
                          <span className="text-body-sm text-on-surface-variant">Jobs Posted</span>
                          <span className="text-body-sm font-bold">{selectedUser.jobCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-md border-t border-outline-variant grid grid-cols-2 gap-md mt-auto">
                    <button onClick={openRoleModal} className="col-span-2 px-md py-2 border border-outline-variant rounded-lg text-label-md font-bold hover:bg-surface-container-low transition-colors">Change Role</button>
                    <button 
                      onClick={handleToggleStatus} 
                      className={`px-md py-2 rounded-lg text-label-md font-bold transition-colors ${selectedUser.isActive ? 'border border-error/20 text-error hover:bg-error/5' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {selectedUser.isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button onClick={handleDeleteUser} className="px-md py-2 bg-error text-on-error rounded-lg text-label-md font-bold hover:bg-error/90 transition-colors shadow-soft">Delete</button>
                  </div>
                </div>
              </>
            ) : null}
          </div>

        </div>
      </div>

      {roleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-surface w-full max-w-sm rounded-2xl p-xl shadow-lg relative my-auto max-h-[calc(100vh-2rem)] overflow-y-auto">
            <h3 className="text-headline-md font-bold mb-md">Change Role</h3>
            <p className="text-body-sm text-on-surface-variant mb-lg">Select a new role for {selectedUser?.name}.</p>
            <select 
              value={selectedNewRole}
              onChange={(e) => setSelectedNewRole(e.target.value)}
              className="w-full px-md py-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface mb-lg focus:outline-none focus:border-primary"
            >
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-md pt-md">
              <button onClick={() => setRoleModalOpen(false)} className="flex-1 py-sm px-md rounded-xl font-bold border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancel</button>
              <button onClick={submitChangeRole} className="flex-1 py-sm px-md rounded-xl font-bold bg-primary text-on-primary hover:bg-primary-container transition-colors">Save Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserManagement
