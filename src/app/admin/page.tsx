'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/auth';
import AdminSideNav from '@/components/AdminSideNav';
import AdminHeader from '@/components/AdminHeader';
import AddUserModal from '@/components/AddUserModal';
import AddCompanyModal from '@/components/AddCompanyModal';
import { User } from '@/utils/auth';

// Mock user data for the admin panel
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@workbrand.com',
    name: 'Admin User',
    companyId: 'company-1',
    companyName: 'Workbrand Global',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-04-10T14:30:00Z'
  },
  {
    id: '2',
    email: 'user@acme.com',
    name: 'John Doe',
    companyId: 'company-2',
    companyName: 'Acme Corporation',
    role: 'user',
    status: 'active',
    lastLogin: '2023-04-09T09:15:00Z'
  },
  {
    id: '3',
    email: 'user@techcorp.com',
    name: 'Jane Smith',
    companyId: 'company-3',
    companyName: 'TechCorp Inc.',
    role: 'user',
    status: 'active',
    lastLogin: '2023-04-11T11:45:00Z'
  },
  {
    id: '4',
    email: 'user@mastercard.com',
    name: 'Michael Johnson',
    companyId: 'mastercard',
    companyName: 'Mastercard',
    role: 'user',
    status: 'active',
    lastLogin: '2023-04-11T08:20:00Z'
  },
  {
    id: '5',
    email: 'admin@mastercard.com',
    name: 'Sarah Williams',
    companyId: 'mastercard',
    companyName: 'Mastercard',
    role: 'admin',
    status: 'active',
    lastLogin: '2023-04-10T16:05:00Z'
  },
  {
    id: '6',
    email: 'user@inactive.com',
    name: 'Inactive User',
    companyId: 'company-4',
    companyName: 'Inactive Corp',
    role: 'user',
    status: 'inactive',
    lastLogin: '2023-03-15T10:30:00Z'
  }
];

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [companies, setCompanies] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeUserCount, setActiveUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState<Record<string, any>>({});
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);
  const [useApiForCompanies, setUseApiForCompanies] = useState<boolean>(false);

  // Redirect if not logged in or not an admin
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      // Calculate user statistics
      const active = users.filter(u => u.status === 'active').length;
      const admins = users.filter(u => u.role === 'admin').length;
      setActiveUserCount(active);
      setAdminCount(admins);
      
      // Check fetch preference from localStorage
      const fetchPreference = localStorage.getItem('adminFetchPreference') || 'local';
      const useApi = fetchPreference === 'api';
      setUseApiForCompanies(useApi);
      
      if (useApi) {
        // Fetch companies from API
        fetchCompanies();
      } else {
        // Extract unique company names from users
        extractCompaniesFromUsers();
      }
    }
  }, [user, users]);

  // Extract unique companies from user accounts instead of fetching from API
  const extractCompaniesFromUsers = () => {
    try {
      setIsLoading(true);
      
      // Get unique company names from user accounts
      const uniqueCompanies = Array.from(
        new Set(users.map(user => user.companyName))
      );
      
      setCompanies(uniqueCompanies);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch companies from API
    const fetchCompanies = async () => {
      try {
      setIsLoading(true);
      setError(null);
      
        const response = await fetch('/api/companies');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch companies');
        }

      // Set companies from API response
      if (data.companies && Array.isArray(data.companies)) {
        setCompanies(data.companies);
        
        // Initialize company details with timestamps for new companies
        const now = new Date().toISOString();
        const newCompanyDetails = { ...companyDetails };
        
        data.companies.forEach((company: string) => {
          if (!newCompanyDetails[company]) {
            newCompanyDetails[company] = {
              createdAt: now,
              lastAccessed: now,
              lastUpdated: now
            };
          }
        });
        
        setCompanyDetails(newCompanyDetails);
      }
      } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching companies');
      } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    }));
  };

  const toggleUserRole = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
      }
      return u;
    }));
  };

  // Delete a user
  const deleteUser = (userId: string) => {
    // Remove user from the users list
    setUsers(users.filter(user => user.id !== userId));
    // Clear the user to delete
    setUserToDelete(null);
  };

  // Prompt for user deletion confirmation
  const promptDeleteUser = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
  };

  const addNewUser = (userData: {
    name: string;
    email: string;
    companyName: string;
    role: 'user' | 'admin';
    password: string;
  }) => {
    // In a real app, this would be an API call
    const newUser = {
      id: `${users.length + 1}`,
      email: userData.email,
      name: userData.name,
      companyId: userData.companyName.toLowerCase().replace(/\s+/g, '-'),
      companyName: userData.companyName,
      role: userData.role,
      status: 'active',
      lastLogin: new Date().toISOString()
    };
    
    setUsers([...users, newUser]);
    
    // If this is a new company, add it to the companies list
    if (!companies.includes(userData.companyName)) {
      setCompanies([...companies, userData.companyName]);
    }
  };

  // Add a new company
  const addNewCompany = async (companyName: string, companyDetails: {
    logoUrl?: string;
    createdAt: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API endpoint to add the company
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: companyName,
          logoUrl: companyDetails.logoUrl || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add company');
      }

      console.log('API response:', data);

      // Add the company name to the list of companies
      if (!companies.includes(companyName)) {
        setCompanies(prevCompanies => [...prevCompanies, companyName]);
        
        // Store additional company details with timestamps
        const now = new Date().toISOString();
        setCompanyDetails(prev => ({
          ...prev,
          [companyName]: {
            logoUrl: companyDetails.logoUrl,
            createdAt: companyDetails.createdAt || now,
            lastAccessed: now,
            lastUpdated: now
          }
        }));

        console.log(`Company ${companyName} added successfully`);
      }
      
      // If we're using API for companies, refresh the list
      if (useApiForCompanies) {
        fetchCompanies();
      }
    } catch (err) {
      console.error('Error adding company:', err);
      setError(err instanceof Error ? err.message : 'Failed to add company');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a company
  const deleteCompany = (companyName: string) => {
    // Check if company has associated users
    const companyUsers = users.filter(u => u.companyName === companyName);
    
    if (companyUsers.length > 0) {
      // Show error if company has users
      setError(`Cannot delete ${companyName} because it has ${companyUsers.length} associated user(s). Please reassign or delete these users first.`);
      
      // Automatically clear the error after 5 seconds
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    // Remove company from the companies list
    setCompanies(companies.filter(company => company !== companyName));
    
    // Remove company details
    setCompanyDetails(prev => {
      const updated = { ...prev };
      delete updated[companyName];
      return updated;
    });

    // Clear the company to delete
    setCompanyToDelete(null);
  };

  // Prompt for delete confirmation
  const promptDeleteCompany = (companyName: string) => {
    setCompanyToDelete(companyName);
  };

  // Function to select a company for viewing users
  const selectCompanyForUsers = (companyName: string) => {
    setSelectedCompany(companyName);
    setActiveTab('users');
  };

  // Clear selected company when changing tabs
  useEffect(() => {
    if (activeTab !== 'users') {
      setSelectedCompany(null);
    }
  }, [activeTab]);

  // Toggle company data source preference
  const toggleCompanyDataSource = () => {
    const newPreference = !useApiForCompanies;
    setUseApiForCompanies(newPreference);
    localStorage.setItem('adminFetchPreference', newPreference ? 'api' : 'local');
    
    // Refetch companies based on new preference
    if (newPreference) {
    fetchCompanies();
    } else {
      extractCompaniesFromUsers();
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#FE619E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-workbrand-blue/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-t-[#FE619E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Mobile menu for small screens */}
      <div className={`lg:hidden fixed inset-0 bg-workbrand-blue/80 backdrop-blur-md z-40 transition-all duration-300 ${
        showMobileMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`bg-[#242857] h-full w-64 transition-all duration-300 transform ${
          showMobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <AdminSideNav activeTab={activeTab} setActiveTab={(tab) => {
            setActiveTab(tab);
            setShowMobileMenu(false);
          }} onLogout={handleLogout} />
        </div>
      </div>

      {/* Desktop sidebar - visible on lg screens and up */}
      <div className="hidden lg:block">
        <AdminSideNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </div>

      {/* Main content area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Navigation */}
        <AdminHeader
          title="Admin Dashboard"
          subtitle="System-wide administration and user management"
          showMobileMenu={showMobileMenu}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Main content container */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-6">
          {error && (
            <div className="glass-dark border border-red-400/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
                <div className="glass-dark p-6 rounded-xl shadow-md border border-white/10">
                  <h2 className="text-xl font-semibold mb-4 text-white">User Overview</h2>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">Active Users:</span>
                    <span className="text-white font-bold text-lg">{activeUserCount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">Admin Users:</span>
                    <span className="text-white font-bold text-lg">{adminCount}</span>
                  </div>
                  <div className="mt-4">
                    <button 
                      className="btn-primary py-2 px-4 w-full"
                      onClick={() => setActiveTab('users')}
                    >
                      Manage Users
                    </button>
                  </div>
                </div>
                
                <div className="glass-dark p-6 rounded-xl shadow-md border border-white/10">
                  <h2 className="text-xl font-semibold mb-4 text-white">Companies Overview</h2>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80">Total Companies:</span>
                    <span className="text-white font-bold text-lg">{companies.length}</span>
                  </div>
                  <div className="mt-4">
                    <button 
                      className="btn-primary py-2 px-4 w-full"
                      onClick={() => setActiveTab('companies')}
                    >
                      Manage Companies
                    </button>
                  </div>
                </div>
                
                <div className="glass-dark p-6 rounded-xl shadow-md border border-white/10">
                  <h2 className="text-xl font-semibold mb-4 text-white">System Status</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">API Status:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Database:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Last Backup:</span>
                      <span className="text-white/80 text-sm">Today, 03:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-dark p-6 rounded-xl shadow-md border border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-4 text-left text-white">Event</th>
                        <th className="py-3 px-4 text-left text-white">User</th>
                        <th className="py-3 px-4 text-left text-white">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-white">User login</td>
                        <td className="py-3 px-4 text-white">Michael Johnson</td>
                        <td className="py-3 px-4 text-white/70">Today, 08:20 AM</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-white">User login</td>
                        <td className="py-3 px-4 text-white">Sarah Williams</td>
                        <td className="py-3 px-4 text-white/70">Yesterday, 4:05 PM</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-3 px-4 text-white">Company data updated</td>
                        <td className="py-3 px-4 text-white">Admin User</td>
                        <td className="py-3 px-4 text-white/70">Yesterday, 2:30 PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="modern-card p-6 rounded-xl shadow-md">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    {selectedCompany ? (
                      <>
                        <button 
                          onClick={() => setSelectedCompany(null)} 
                          className="mr-2 text-white/70 hover:text-white"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                        </button>
                        Users for {selectedCompany}
                      </>
                    ) : (
                      "All Users"
                    )}
                  </h2>
                  {!selectedCompany && <p className="text-white/70 mt-1 text-sm">Select a company from the Companies tab to view specific users</p>}
                </div>
                <button 
                  className="btn-primary py-2 px-4 whitespace-nowrap"
                  onClick={() => setShowAddUserModal(true)}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add User
                  </span>
                </button>
              </div>
              
              <div className="overflow-x-auto glass-dark rounded-lg">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-3 px-4 text-left text-white">Name</th>
                      <th className="py-3 px-4 text-left text-white">Email</th>
                      {!selectedCompany && <th className="py-3 px-4 text-left text-white">Company</th>}
                      <th className="py-3 px-4 text-left text-white">Role</th>
                      <th className="py-3 px-4 text-left text-white">Status</th>
                      <th className="py-3 px-4 text-left text-white">Last Login</th>
                      <th className="py-3 px-4 text-left text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(user => !selectedCompany || user.companyName === selectedCompany)
                      .map(user => (
                      <tr key={user.id} className="hover:bg-white/5 border-b border-white/10">
                        <td className="py-3 px-4 text-white">{user.name}</td>
                        <td className="py-3 px-4 text-white">{user.email}</td>
                        {!selectedCompany && <td className="py-3 px-4 text-white">{user.companyName}</td>}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-500/20 text-purple-400' 
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white/70">{new Date(user.lastLogin).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-3 py-1 text-xs rounded-md ${
                                user.status === 'active'
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={() => promptDeleteUser(user.id, user.name)}
                              className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-400"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedCompany && users.filter(user => user.companyName === selectedCompany).length === 0 && (
                <div className="text-center py-8 mt-4">
                  <p className="text-white/70">No users found for this company.</p>
                  <button 
                    className="btn-primary py-2 px-4 mt-4"
                    onClick={() => setShowAddUserModal(true)}
                  >
                    Add User to {selectedCompany}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'companies' && (
            <div className="modern-card p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white">Companies</h2>
                  <p className="text-white/70 mt-1 text-sm">Click on a company to view its users</p>
                </div>
                <button 
                  className="btn-primary py-2 px-4"
                  onClick={() => setShowAddCompanyModal(true)}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Company
                  </span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Last Accessed</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Last Updated</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Users</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {companies.map((company, index) => {
                      const companyData = companyDetails[company] || {};
                      const companyUsers = users.filter(u => u.companyName === company);
                      
                      // Format timestamps
                      const formatDate = (timestamp: string | undefined) => {
                        if (!timestamp) return 'N/A';
                        const date = new Date(timestamp);
                        return date.toLocaleString();
                      };
                      
                      const created = formatDate(companyData.createdAt);
                      const lastAccessed = formatDate(companyData.lastAccessed);
                      const lastUpdated = formatDate(companyData.lastUpdated);
                      
                      return (
                        <tr 
                          key={index} 
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td 
                            className="px-4 py-4 whitespace-nowrap cursor-pointer"
                            onClick={() => selectCompanyForUsers(company)}
                          >
                            <div className="flex items-center">
                              {companyData.logoUrl ? (
                                <img 
                                  src={companyData.logoUrl} 
                                  alt={`${company} logo`} 
                                  className="h-8 w-8 mr-3 rounded-full object-contain bg-white/10 p-1" 
                                />
                              ) : (
                                <div className="h-8 w-8 mr-3 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                  {company.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div className="text-sm font-medium text-white hover:text-indigo-300">{company}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-white/70">
                            {created}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-white/70">
                            {lastAccessed}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-white/70">
                            {lastUpdated}
                          </td>
                          <td 
                            className="px-4 py-4 whitespace-nowrap text-sm text-white cursor-pointer hover:text-indigo-300"
                            onClick={() => selectCompanyForUsers(company)}
                          >
                            {companyUsers.length}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              className="text-indigo-400 hover:text-indigo-300 mr-3"
                              onClick={() => selectCompanyForUsers(company)}
                            >
                              View Users
                            </button>
                            <button className="text-indigo-400 hover:text-indigo-300 mr-3">
                              Edit
                            </button>
                            <button 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => promptDeleteCompany(company)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {companies.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-white/70">No companies found. Add a company to get started.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="modern-card p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-6 text-white">System Settings</h2>
              
              <div className="space-y-6">
                <div className="glass-dark p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-white">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-white/70 text-sm">Require 2FA for all admin users</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" checked={true} readOnly />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE619E]"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Session Timeout</p>
                        <p className="text-white/70 text-sm">Automatically log users out after inactivity</p>
                      </div>
                      <select className="modern-input bg-white/10 text-white border-white/20 py-1 px-2 rounded">
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="glass-dark p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-white">Data Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Company Data Source</p>
                        <p className="text-white/70 text-sm">
                          {useApiForCompanies 
                            ? "Using API data (all companies in database)" 
                            : "Using local data (only companies with users)"}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={useApiForCompanies}
                          onChange={toggleCompanyDataSource}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FE619E]"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="glass-dark p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 text-white">Backup & Maintenance</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Automatic Backups</p>
                        <p className="text-white/70 text-sm">Schedule regular database backups</p>
                      </div>
                      <button className="btn-primary py-2 px-4">Configure</button>
                    </div>
                    
                    <div className="flex justify-between items-center">
            <div>
                        <p className="text-white font-medium">System Maintenance</p>
                        <p className="text-white/70 text-sm">Schedule downtime for maintenance</p>
                      </div>
                      <button className="glass-border py-2 px-4 text-white">Schedule</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAddUser={addNewUser}
        existingCompanies={companies}
        preselectedCompany={selectedCompany}
      />

      {/* Add Company Modal */}
      <AddCompanyModal 
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        onAdd={addNewCompany}
      />

      {/* Delete Company Confirmation Modal */}
      {companyToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-workbrand-blue/70 backdrop-blur-sm">
          <div className="glass-dark relative rounded-xl overflow-hidden shadow-xl max-w-md w-full mx-4 md:mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
              <p className="text-white/80 mb-6">
                Are you sure you want to delete <span className="text-white font-medium">{companyToDelete}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setCompanyToDelete(null)}
                  className="px-4 py-2 border border-white/20 text-white/70 rounded-md hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteCompany(companyToDelete)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Delete Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-workbrand-blue/70 backdrop-blur-sm">
          <div className="glass-dark relative rounded-xl overflow-hidden shadow-xl max-w-md w-full mx-4 md:mx-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Confirm User Deletion</h3>
              <p className="text-white/80 mb-6">
                Are you sure you want to delete user <span className="text-white font-medium">{userToDelete.name}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 border border-white/20 text-white/70 rounded-md hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteUser(userToDelete.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                >
                  Delete User
                </button>
              </div>
        </div>
      </div>
    </div>
      )}
    </main>
  );
}
