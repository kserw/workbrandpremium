import React, { useState } from 'react';

interface CompanyDetails {
  logoUrl?: string;
  createdAt: string;
}

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (companyName: string, details: CompanyDetails) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }
    
    onAdd(companyName, {
      logoUrl: logoUrl || undefined,
      createdAt: new Date().toISOString()
    });
    
    // Reset form
    setCompanyName('');
    setLogoUrl('');
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
            <h3 className="text-xl font-bold text-white">Add New Company</h3>
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
              <label htmlFor="companyName" className="block text-white/70 text-sm font-medium mb-2">
                Company Name *
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                placeholder="Enter company name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="logoUrl" className="block text-white/70 text-sm font-medium mb-2">
                Logo URL
              </label>
              <input
                id="logoUrl"
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:border-indigo-500 text-white"
                placeholder="https://example.com/logo.png"
              />
              {logoUrl && (
                <div className="mt-2 p-2 rounded-md bg-white/5 flex items-center">
                  <img 
                    src={logoUrl} 
                    alt="Company logo preview" 
                    className="h-8 w-8 object-contain mr-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=X';
                    }}
                  />
                  <span className="text-xs text-white/70">Logo preview (if URL is valid)</span>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-white/70 text-sm">
                The following timestamps will be automatically generated:
              </p>
              <ul className="list-disc ml-5 mt-2 text-white/70 text-sm">
                <li>Created: Current date and time</li>
                <li>Last Accessed: Current date and time</li>
                <li>Last Updated: Current date and time</li>
              </ul>
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
                Add Company
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal; 