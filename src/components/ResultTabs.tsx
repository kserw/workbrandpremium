import { useState } from 'react';
import { CompanyData, Category, categoryLabels } from '@/types';
import CTAPopup from './CTAPopup';
import CategoryBreakdown from './CategoryBreakdown';

interface ResultTabsProps {
  userCompany: CompanyData;
  competitor: CompanyData;
  userCompanyName: string;
  competitorName: string;
}

// Define the tab types
type TabType = Category | 'overview';

export default function ResultTabs({
  userCompany,
  competitor,
  userCompanyName,
  competitorName,
}: ResultTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Define which tabs are accessible (all tabs in premium version)
  const accessibleTabs: TabType[] = ['overview', 'interpersonalFit', 'thrivingAtWork', 'experienceAndCompetency', 'recognitionAndCompensation', 'purposeAndInvolvement'];
  
  const handleTabClick = (tab: TabType) => {
    if (accessibleTabs.includes(tab)) {
      setActiveTab(tab);
    } else {
      setIsPopupOpen(true);
    }
  };

  const isCategory = (tab: TabType): tab is Category => {
    return tab !== 'overview';
  };

  const getTabLabel = (tab: TabType): string => {
    if (tab === 'overview') {
      return 'Overview';
    }
    return categoryLabels[tab as Category];
  };

  return (
    <div className="mt-8">
      <div className="glass-border p-0.5 rounded-lg mb-6">
        <div className="flex overflow-x-auto">
          {['overview', 'interpersonalFit', 'thrivingAtWork', 'experienceAndCompetency', 'recognitionAndCompensation', 'purposeAndInvolvement'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab as TabType)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab
                  ? 'bg-pink-500 text-white'
                  : 'text-white/80 hover:bg-white/5'
              }`}
            >
              {getTabLabel(tab as TabType)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-dark p-6 rounded-lg">
        {activeTab === 'overview' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ color: userCompany.primaryColor || '#2F3295' }}>{userCompanyName}</h3>
                <p className="text-white/80 mb-4">{userCompany.analysis.overview}</p>
                
                {/* Top 3 Words Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Top 3 Words Associated with {userCompanyName}'s Employer Brand:</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {userCompany.top3Words && userCompany.top3Words.map((word, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: userCompany.primaryColor || '#2F3295' }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-white">{userCompany.glassdoorScore.toFixed(1)}</span>
                    <span className="text-sm text-white ml-1">Average Employee Rating</span>
                  </div>
                  <div>
                    <span className="text-sm text-white">Employees: {userCompany.numEmployees.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="glass p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ color: competitor.primaryColor || '#FE619E' }}>{competitorName}</h3>
                <p className="text-white/80 mb-4">{competitor.analysis.overview}</p>
                
                {/* Top 3 Words Section */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Top 3 Words Associated with {competitorName}'s Employer Brand:</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {competitor.top3Words && competitor.top3Words.map((word, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: competitor.primaryColor || '#FE619E' }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-white">{competitor.glassdoorScore.toFixed(1)}</span>
                    <span className="text-sm text-white ml-1">Average Employee Rating</span>
                  </div>
                  <div>
                    <span className="text-sm text-white">Employees: {competitor.numEmployees.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Category Comparison</h3>
              <div className="space-y-4">
                {Object.keys(categoryLabels).map((category) => (
                  <div key={category} className="glass p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{categoryLabels[category as Category]}</h4>
                      <div className="flex space-x-4">
                        <span className="text-sm font-medium text-white">{userCompany[category as Category]}/20</span>
                        <span className="text-sm font-medium text-white">{competitor[category as Category]}/20</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{userCompanyName}</span>
                        </div>
                        <div className="w-full bg-workbrand-blue/20 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(userCompany[category as Category] / 20) * 100}%`,
                              backgroundColor: userCompany.primaryColor || '#2F3295'
                            }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-white">{competitorName}</span>
                        </div>
                        <div className="w-full bg-workbrand-blue/20 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(competitor[category as Category] / 20) * 100}%`,
                              backgroundColor: competitor.primaryColor || '#FE619E'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : isCategory(activeTab) ? (
          <CategoryBreakdown
            category={activeTab}
            userCompany={userCompany}
            competitor={competitor}
            userCompanyName={userCompanyName}
            competitorName={competitorName}
          />
        ) : null}
      </div>

      <CTAPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
} 