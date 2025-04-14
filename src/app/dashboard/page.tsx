'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/auth';
import { CompanyData, Category, categoryLabels, categoryToSubcategories, subcategoryLabels } from '@/types';
import ComparisonChart from '@/components/ComparisonChart';
import ResultTabs from '@/components/ResultTabs';
import CompetitorCard from '@/components/CompetitorCard';
import SideNav from '@/components/SideNav';
import TopNav from '@/components/TopNav';
import DashboardOverview from '@/components/DashboardOverview';
import StatCard from '@/components/StatCard';
import DetailedMastercardAnalysis from '@/components/DetailedMastercardAnalysis';
import Image from "next/image";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [companies, setCompanies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCompanyData, setUserCompanyData] = useState<CompanyData | null>(null);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [competitorData, setCompetitorData] = useState<CompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCompetitor, setNewCompetitor] = useState('');

  // Redirect if not logged in or redirect admins to admin dashboard
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin') {
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  // Fetch user's company data on initial load
  useEffect(() => {
    if (user && user.companyId) {
      fetchUserCompanyData();
      fetchCompanies();
    }
  }, [user]);

  // Auto-fetch Mastercard data when user switches to compare tab
  useEffect(() => {
    if (activeTab === 'compare' && user && !competitorData && !isLoading) {
      // Don't automatically set competitor - let user choose
      // setSelectedCompetitor('Mastercard');
      // fetchCompetitorData('Mastercard');
    }
  }, [activeTab, user, competitorData, isLoading]);

  // Fetch competitor data when selected
  useEffect(() => {
    if (selectedCompetitor) {
      fetchCompetitorData(selectedCompetitor);
    } else {
      setCompetitorData(null);
    }
  }, [selectedCompetitor]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const fetchUserCompanyData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/companies/${user.companyId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch company data');
      }

      const data = await response.json();
      
      // For Mastercard users, set primary color to Mastercard's brand colors
      if (user.companyName === 'Mastercard') {
        data.primaryColor = '#EB001B'; // Mastercard red
        data.secondaryColor = '#FF5F00'; // Mastercard orange
        data.tertiaryColor = '#F79E1B'; // Mastercard yellow
      }
      
      setUserCompanyData(data);
    } catch (error) {
      console.error('Error fetching user company data:', error);
      setError('Failed to load your company data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      // Filter out the user's own company
      const filteredCompanies = data.companies.filter(
        (company: string) => company.toLowerCase() !== user?.companyName.toLowerCase()
      );

      setCompanies(filteredCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load available companies for comparison. Please try again later.');
    }
  };

  const fetchCompetitorData = async (companyName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if competitorData is already loaded for this competitor
      if (competitorData && selectedCompetitor === companyName) {
        setIsLoading(false);
        return;
      }
      
      // Check if user exists before accessing properties
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Prepare data for analysis - using the user's company info from auth context
      const analysisData = {
        companyName: user.companyName,
        selectedCompetitor: companyName,
        email: user.email || 'premium@workbrand.com' // Use email from auth or default
      };
      
      // Make API call to analyze the companies using our new analyze endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch competitor data');
      }

      // Get competitor data
      const data = await response.json();
      
      // Set competitor data
      setCompetitorData(data.competitor);
      
      // Smooth scroll to results
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          document.getElementById('comparison-results')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching competitor data:', error);
      setError('Failed to load competitor data. Please try again later.');
      setCompetitorData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#FE619E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Function to calculate total score and letter grade
  const calculateTotalScore = (
    company: CompanyData
  ): { score: number; grade: string; gradeColor: string } => {
    const categories = Object.keys(categoryLabels) as Category[];
    const totalPossible = categories.length * 20; // 5 categories * 20 points each
    const totalScore = categories.reduce((sum, category) => sum + company[category], 0);
    const percentage = (totalScore / totalPossible) * 100;

    // Determine letter grade based on percentage
    let grade = '';
    let gradeColor = '';

    if (percentage >= 90) {
      grade = 'A';
      gradeColor = '#22c55e'; // Green
    } else if (percentage >= 80) {
      grade = 'B';
      gradeColor = '#84cc16'; // Light green
    } else if (percentage >= 70) {
      grade = 'C';
      gradeColor = '#eab308'; // Yellow
    } else if (percentage >= 60) {
      grade = 'D';
      gradeColor = '#f97316'; // Orange
    } else {
      grade = 'F';
      gradeColor = '#ef4444'; // Red
    }

    return { score: totalScore, grade, gradeColor };
  };

  // Get titles for the topnav
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'company':
        return 'Company Analysis';
      case 'compare':
        return 'Competitor Comparison';
      case 'recommendations':
        return 'Recommendations';
      case 'detailed-analysis':
        return 'Detailed Analysis';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Key metrics and insights for your company';
      case 'company':
        return 'Detailed analysis of your Workbrand score';
      case 'compare':
        return 'Compare your company with competitors';
      case 'recommendations':
        return 'Personalized recommendations for improvement';
      case 'detailed-analysis':
        return 'Detailed analysis of your Workbrand score';
      default:
        return '';
    }
  };

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
          <SideNav 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              setShowMobileMenu(false);
            }} 
            onLogout={handleLogout} 
          />
        </div>
      </div>

      {/* Desktop sidebar - visible on lg screens and up */}
      <div className="hidden lg:block">
        <SideNav activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      </div>

      {/* Main content area */}
      <div className="lg:ml-64 min-h-screen">
        {/* Top Navigation */}
        <TopNav
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          showMobileMenu={showMobileMenu}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* Main content container */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          {error && (
            <div className="glass-dark border border-red-400/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md mt-6">
              {error}
            </div>
          )}

          {userCompanyData && (
            <>
              {/* Dashboard Overview Tab */}
              {activeTab === 'dashboard' && (
                <DashboardOverview 
                  userCompanyData={userCompanyData} 
                  setActiveTab={setActiveTab}
                />
              )}

              {/* Company Analysis Tab */}
              {activeTab === 'company' && (
                <div className="space-y-8 animate-slide-up py-6">
                  <div className="modern-card rounded-xl p-6 shadow-lg">
                    {/* Overview Section */}
                    <div className="mb-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white" style={{ color: userCompanyData.primaryColor || '#FE619E' }}>
                          {user.companyName} - Workbrand Score
                        </h2>
                        
                        {/* Score Badge */}
                        {userCompanyData && (
                          <div className="mt-4 lg:mt-0">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center">
                                <span className="text-3xl font-bold text-white">{calculateTotalScore(userCompanyData).score}</span>
                                <span className="text-sm text-white/70 ml-1">/100</span>
                              </div>
                              <span 
                                className="px-4 py-2 rounded-md font-bold text-white shadow-sm"
                                style={{
                                  backgroundColor: calculateTotalScore(userCompanyData).gradeColor
                                }}
                              >
                                Grade: {calculateTotalScore(userCompanyData).grade}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                        <div className="glass-dark rounded-xl p-6 shadow-md border border-white/10">
                          <p className="text-white/90 mb-4 leading-relaxed">{userCompanyData.analysis.overview}</p>
                          <p className="text-white/80 leading-relaxed italic">{userCompanyData.evpStatement}</p>
                          
                          <div className="mt-6">
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center bg-amber-500/20 px-3 py-2 rounded-lg">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-amber-400 mr-2"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-medium text-white">{userCompanyData.glassdoorScore.toFixed(1)}/5</span>
                                <span className="text-sm text-white/70 ml-1">Employee Rating</span>
                              </div>
                              <span className="text-sm text-white/70 bg-white/10 px-3 py-2 rounded-lg">
                                Employees: {userCompanyData.numEmployees.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="glass-dark rounded-xl p-6 shadow-md border border-white/10">
                          <h3 className="text-lg font-semibold mb-4 text-white">Top Words Associated with Your Brand:</h3>
                          <div className="flex flex-wrap gap-3 mb-6">
                            {userCompanyData.top3Words &&
                              userCompanyData.top3Words.map((word, index) => (
                                <span
                                  key={index}
                                  className="px-5 py-3 rounded-lg text-white text-md font-medium shadow-sm transition-transform hover:scale-105"
                                  style={{ backgroundColor: userCompanyData.primaryColor || '#2F3295' }}
                                >
                                  {word}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Category Scores Section */}
                    <div className="mb-10">
                      <h3 className="text-xl font-semibold mb-6 text-white">Category Scores</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {(Object.keys(categoryLabels) as Category[]).map(category => (
                          <div key={category} className="glass-dark rounded-xl shadow-md p-5 transition-all duration-300 hover:shadow-lg border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-white">{categoryLabels[category]}</h4>
                              <span className="font-semibold text-lg text-white">{userCompanyData[category]}/20</span>
                            </div>
                            <div className="w-full bg-workbrand-blue/30 rounded-full h-3 mb-4">
                              <div
                                className="h-3 rounded-full transition-all duration-700"
                                style={{
                                  width: `${(userCompanyData[category] / 20) * 100}%`,
                                  backgroundColor: userCompanyData.primaryColor || '#FE619E',
                                }}
                              ></div>
                            </div>
                            <p className="text-sm mt-3 text-white/80 leading-relaxed">{userCompanyData.analysis[category]}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subcategory Breakdown Section */}
                    <div>
                      <h3 className="text-xl font-semibold mb-6 text-white">Detailed Breakdown</h3>
                      <div className="space-y-8">
                        {(Object.keys(categoryLabels) as Category[]).map(category => (
                          <div key={category} className="glass-dark rounded-xl p-6 shadow-md border border-white/10">
                            <h4 className="text-lg font-semibold mb-4 text-white" style={{ color: userCompanyData.primaryColor || '#FE619E' }}>
                              {categoryLabels[category]} ({userCompanyData[category]}/20)
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                              {categoryToSubcategories[category].map(subcategory => (
                                <div key={subcategory} className="bg-white/5 p-4 rounded-lg border border-white/10 transition-all hover:shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-sm font-medium text-white/90">{subcategoryLabels[subcategory]}</h5>
                                    <span className="text-sm font-bold text-white">
                                      {userCompanyData.subcategories[subcategory as keyof typeof userCompanyData.subcategories]}/5
                                    </span>
                                  </div>
                                  <div className="w-full bg-workbrand-blue/30 rounded-full h-2.5 overflow-hidden">
                                    <div
                                      className="h-2.5 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${(userCompanyData.subcategories[subcategory as keyof typeof userCompanyData.subcategories] / 5) * 100}%`,
                                        backgroundColor: userCompanyData.primaryColor || '#FE619E',
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Tab */}
              {activeTab === 'compare' && (
                <div className="space-y-8 animate-slide-up py-6">
                  <div className="glass-dark rounded-xl p-6 shadow-lg border border-white/10">
                    <h2 className="text-2xl font-bold text-white mb-6">
                      Compare {user.companyName} with competitors
                    </h2>
                    
                    {error && (
                      <div className="glass-dark border border-red-400/30 text-red-400 px-5 py-4 rounded-lg mb-6 backdrop-blur-md">
                        {error}
                      </div>
                    )}
                    
                    <p className="text-white/80 mb-8">
                      Enter any company name to compare your company's Workbrand score against them.
                      Our analysis provides an in-depth comparison across all key categories.
                    </p>

                    {/* Custom competitor input */}
                    <div className="glass-dark rounded-lg p-6 border border-white/5">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Enter company name for comparison
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="text"
                          className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-workbrand-blue focus:border-transparent transition"
                          placeholder="Enter any company name (e.g., 'Mastercard', 'Google', 'Microsoft')"
                          value={newCompetitor}
                          onChange={(e) => setNewCompetitor(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            if (newCompetitor) {
                              setSelectedCompetitor(newCompetitor);
                              fetchCompetitorData(newCompetitor);
                            }
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-[#2F3295] to-[#FE619E] text-white rounded-lg hover:opacity-90 transition"
                          disabled={!newCompetitor || isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Analyzing...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              Compare
                            </span>
                          )}
                        </button>
                      </div>
                      <p className="text-white/60 text-sm mt-2">
                        Our AI will analyze the selected company and compare it with {user.companyName}
                      </p>
                    </div>

                    {isLoading && (
                      <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-3">
                          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-white">Loading comparison data...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {competitorData ? (
                    <div className="space-y-8" id="comparison-results">
                      <ComparisonChart
                        userCompany={userCompanyData}
                        competitor={competitorData}
                        userCompanyName={user.companyName}
                        competitorName={selectedCompetitor || 'Competitor'}
                      />

                      <ResultTabs
                        userCompany={userCompanyData}
                        competitor={competitorData}
                        userCompanyName={user.companyName}
                        competitorName={selectedCompetitor || 'Competitor'}
                      />
                      
                      {/* Key findings */}
                      <div className="glass-dark rounded-xl p-6 shadow-lg border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-4">Key Takeaways</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-workbrand-blue to-workbrand-pink flex items-center justify-center text-white font-medium mr-3">
                              1
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Strengths Compared to {selectedCompetitor}</h4>
                              <p className="text-white/80">
                                {userCompanyData.top3Words[0]} and {userCompanyData.top3Words[1]} are key attributes where your company excels.
                                {userCompanyData.interpersonalFit > (competitorData?.interpersonalFit || 0) && ' Your interpersonal fit score is higher than your competitor.'}
                                {userCompanyData.thrivingAtWork > (competitorData?.thrivingAtWork || 0) && ' Your employees report better thriving at work conditions.'}
                                {userCompanyData.experienceAndCompetency > (competitorData?.experienceAndCompetency || 0) && ' Your experience and competency metrics exceed your competitor.'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-workbrand-blue to-workbrand-pink flex items-center justify-center text-white font-medium mr-3">
                              2
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Areas for Improvement</h4>
                              <p className="text-white/80">
                                {userCompanyData.interpersonalFit < (competitorData?.interpersonalFit || 0) && ' Your interpersonal fit score could be improved compared to your competitor.'}
                                {userCompanyData.thrivingAtWork < (competitorData?.thrivingAtWork || 0) && ' Employees at your competitor report better thriving at work conditions.'}
                                {userCompanyData.experienceAndCompetency < (competitorData?.experienceAndCompetency || 0) && ' Your competitor has stronger experience and competency metrics.'}
                                {userCompanyData.recognitionAndCompensation < (competitorData?.recognitionAndCompensation || 0) && ' Your competitor scores higher in recognition and compensation.'}
                                {userCompanyData.purposeAndInvolvement < (competitorData?.purposeAndInvolvement || 0) && ' Your competitor has a stronger sense of purpose and involvement.'}
                                {(userCompanyData.interpersonalFit >= (competitorData?.interpersonalFit || 0) && 
                                  userCompanyData.thrivingAtWork >= (competitorData?.thrivingAtWork || 0) && 
                                  userCompanyData.experienceAndCompetency >= (competitorData?.experienceAndCompetency || 0) && 
                                  userCompanyData.recognitionAndCompensation >= (competitorData?.recognitionAndCompensation || 0) && 
                                  userCompanyData.purposeAndInvolvement >= (competitorData?.purposeAndInvolvement || 0)) && 
                                  ' You are performing well across all major categories compared to your competitor!'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-workbrand-blue to-workbrand-pink flex items-center justify-center text-white font-medium mr-3">
                              3
                            </div>
                            <div>
                              <h4 className="text-white font-medium mb-1">Key Differentiator</h4>
                              <p className="text-white/80">
                                Your employer value proposition focuses on {userCompanyData.top3Words[0]}, while {selectedCompetitor} 
                                emphasizes {competitorData?.top3Words[0] || 'different values'}.
                                This distinction shapes employee expectations and experiences at both organizations.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 glass rounded-xl">
                      <div className="opacity-70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-white font-medium text-lg">
                        Select a competitor and click "Compare" to analyze against {user.companyName}
                      </p>
                      <p className="text-white/70 mt-2">
                        See how your Workbrand score compares to industry leaders
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Recommendations Tab */}
              {activeTab === 'recommendations' && (
                <div className="modern-card p-6 rounded-xl shadow-md animate-slide-up py-6 border border-white/10">
                  <h2 className="text-xl font-semibold mb-6 text-white">Recommendations for Improvement</h2>
                  
                  <div className="space-y-6">
                    {(Object.keys(categoryLabels) as Category[]).map(category => {
                      // Find the lowest scoring subcategories
                      const subcategories = categoryToSubcategories[category];
                      const lowestScore = Math.min(
                        ...subcategories.map(
                          sub => userCompanyData.subcategories[sub as keyof typeof userCompanyData.subcategories]
                        )
                      );
                      
                      const weakestAreas = subcategories.filter(
                        sub => userCompanyData.subcategories[sub as keyof typeof userCompanyData.subcategories] === lowestScore
                      );
                      
                      return (
                        <div key={category} className="glass-dark rounded-xl border border-white/10 p-6 shadow-md transition-all hover:shadow-lg">
                          <h3 className="font-semibold mb-3 text-white">{categoryLabels[category]}</h3>
                          
                          {weakestAreas.length > 0 && (
                            <div>
                              <p className="text-white/80 mb-3">Focus areas for improvement:</p>
                              <ul className="space-y-2 mb-4">
                                {weakestAreas.map(area => (
                                  <li key={area} className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                      <span className="font-medium text-white">{subcategoryLabels[area]}</span> 
                                      <div className="flex items-center mt-1">
                                        <div className="w-24 bg-workbrand-blue/30 rounded-full h-1.5 mr-2">
                                          <div
                                            className="h-1.5 rounded-full bg-green-500"
                                            style={{ width: `${(userCompanyData.subcategories[area as keyof typeof userCompanyData.subcategories] / 5) * 100}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs text-white/60">Currently scoring {userCompanyData.subcategories[area as keyof typeof userCompanyData.subcategories]}/5</span>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              
                              <div className="mt-4 bg-blue-900/30 p-5 rounded-lg border border-blue-500/20">
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div>
                                    <p className="text-blue-300 font-medium mb-2">Recommendation:</p>
                                    <p className="text-white/80 leading-relaxed">
                                      {category === 'interpersonalFit' && 'Consider implementing more structured diversity and inclusion programs, and provide leadership training to improve workplace relationships.'}
                                      {category === 'thrivingAtWork' && 'Focus on improving career development opportunities and work-life balance policies to boost employee satisfaction.'}
                                      {category === 'experienceAndCompetency' && 'Invest in better resources and tools for employees, and create clearer paths for professional growth within the organization.'}
                                      {category === 'recognitionAndCompensation' && 'Review your compensation structure for competitiveness, and develop more consistent performance recognition systems.'}
                                      {category === 'purposeAndInvolvement' && 'Strengthen your corporate social responsibility initiatives and create more opportunities for employees to engage in meaningful work.'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Detailed Analysis Tab */}
              {activeTab === 'detailed-analysis' && (
                <div className="modern-card p-6 rounded-xl shadow-md animate-slide-up py-6 border border-white/10">
                  <h2 className="text-xl font-semibold mb-6 text-white">Detailed Analysis</h2>
                  
                  <div className="space-y-6">
                    {userCompanyData && (
                      <DetailedMastercardAnalysis
                        companyData={userCompanyData}
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
