import { useAuth } from '@/utils/auth';
import Link from 'next/link';
import LogoImage from './LogoImage';

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function SideNav({ activeTab, setActiveTab, onLogout }: SideNavProps) {
  const { user } = useAuth();
  const isMastercardUser = user?.companyName === 'Mastercard';

  return (
    <div className="fixed top-0 left-0 h-full w-64 glass overflow-hidden z-10 border-r border-white/10">
      <div className="flex flex-col h-full">
        {/* Logo/Brand Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-center">
            <div className="h-16 w-48">
              <LogoImage />
            </div>
          </div>
        </div>
        
        {/* User Profile Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-[#5B60D6] to-[#8D90EB] flex items-center justify-center text-xl font-bold text-white mb-3">
              {user?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-white font-medium">{user?.name}</h2>
            <p className="text-white/70 text-sm">{user?.companyName}</p>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'company' 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Company Analysis
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('compare')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'compare' 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Comparison
              </button>
            </li>
            {isMastercardUser && (
              <li>
                <button 
                  onClick={() => setActiveTab('detailed-analysis')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'detailed-analysis' 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Detailed Analysis
                </button>
              </li>
            )}
            <li>
              <button 
                onClick={() => setActiveTab('recommendations')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                  activeTab === 'recommendations' 
                    ? 'bg-white/10 text-white font-medium' 
                    : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Recommendations
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Footer with Logout */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 hover:text-[#5474fe] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 