import React, { useState, useEffect } from 'react';

interface UserDetails {
  role: string;
  companyName: string;
  password: string;
  avatarUrl?: string;
  createdAt: string;
  lastAccessed?: string;
  lastUpdated?: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (userData: {
    name: string;
    email: string;
    companyName: string;
    role: 'user' | 'admin';
    password: string;
  }) => void;
  existingCompanies: string[];
  preselectedCompany?: string | null;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddUser, 
  existingCompanies, 
  preselectedCompany 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Set preselected company when it changes
  useEffect(() => {
    if (preselectedCompany) {
      setCompanyName(preselectedCompany);
    }
  }, [preselectedCompany]);

  const roles = ['user', 'admin'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!companyName) {
      setError('Company is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }
    
    onAddUser({
      name,
      email,
      companyName,
      role,
      password
    });
    
    // Reset form
    setName('');
    setEmail('');
    setRole('user');
    setCompanyName(preselectedCompany || '');
    setPassword('');
    setError('');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-workbrand-blue/70">
      <div 
        className="glass-dark relative rounded-xl overflow-hidden shadow-xl max-w-md w-full mx-4 md:mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold text-white">Add New User</h3>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-white/70 text-sm font-medium mb-2">
                Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-white/70 text-sm font-medium mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-white/70 text-sm font-medium mb-2">
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                placeholder="Enter password"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="role" className="block text-white/70 text-sm font-medium mb-2">
                Role *
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                required
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-white/70 text-sm font-medium mb-2">
                Company *
              </label>
              <select
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                required
              >
                <option value="">Select company</option>
                {existingCompanies.map((comp) => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-white/20 text-white/70 rounded-md hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-md hover:opacity-90"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal; 