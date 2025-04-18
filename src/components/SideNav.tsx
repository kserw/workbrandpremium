import { useAuth } from '@/utils/auth';
import Link from 'next/link';
import LogoImage from './LogoImage';
import { useState } from 'react';
import MoreToolsPanel from './MoreToolsPanel';

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function SideNav({ activeTab, setActiveTab, onLogout }: SideNavProps) {
  const { user } = useAuth();
  const isMastercardUser = user?.companyName === 'Mastercard';
  const [showMoreTools, setShowMoreTools] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowMoreTools(false);
  };

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-64 glass overflow-hidden z-10 border-r border-white/10">
        <div className="flex flex-col h-full">
          {/* Logo/Brand Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-center">
              <div className="h-16 w-48 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
                <LogoImage />
              </div>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="p-4 border-b border-white/10">
            <button 
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center space-x-3 rounded-lg transition-all p-2 ${
                activeTab === 'profile'
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#5B60D6] to-[#8D90EB] flex items-center justify-center text-sm font-bold text-white">
                {user?.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <h2 className="text-sm font-medium text-white">{user?.name}</h2>
                <p className="text-xs text-white/70">{user?.companyName}</p>
              </div>
            </button>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1 pt-1">
              <li>
                <button 
                  onClick={() => handleTabChange('dashboard')}
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
                  onClick={() => handleTabChange('detailed-analysis')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'detailed-analysis' 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Company Analysis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('social')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'social' 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Social Presence
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('competitors')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'competitors' 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Competitors
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleTabChange('compare')}
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
              <li>
                <button 
                  onClick={() => handleTabChange('recommendations')}
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
              <li>
                <button 
                  onClick={() => handleTabChange('content-calendar')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    activeTab === 'content-calendar' 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Content Calendar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowMoreTools(!showMoreTools)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                    showMoreTools 
                      ? 'bg-white/10 text-white font-medium' 
                      : 'text-white/70 hover:bg-white/5 hover:text-[#5474fe]'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  More Tools
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <MoreToolsPanel 
        isOpen={showMoreTools}
        onClose={() => setShowMoreTools(false)}
        setActiveTab={handleTabChange}
      />
    </>
  );
} 