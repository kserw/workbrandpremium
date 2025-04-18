'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
import SocialPresence from '@/components/SocialPresence';
import ContentCalendar from '@/components/ContentCalendar';
import UserPreferences from '@/components/UserPreferences';

export default function Dashboard() {
  const { user, loading, logout, updatePreferences } = useAuth();
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');
  const [isEditingFirstName, setIsEditingFirstName] = useState(false);
  const [isEditingLastName, setIsEditingLastName] = useState(false);
  const [nameError, setNameError] = useState('');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    showDateTime: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    fiscalYearStart: 1,
    darkMode: true,
  });
  const [isUpdatingPreferences, setIsUpdatingPreferences] = useState(false);
  const [calendarView, setCalendarView] = useState<'calendar' | 'add-content'>('calendar');
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | null>(null);
  const [calendarContentItems, setCalendarContentItems] = useState([]);
  const [calendarNewContent, setCalendarNewContent] = useState({
    platform: 'LinkedIn',
    content: '',
    title: '',
    caption: '',
    imageUrl: '',
  });
  const [calendarSelectedQuarter, setCalendarSelectedQuarter] = useState<number | null>(null);

  // Memoize preferences to prevent unnecessary re-renders
  const memoizedPreferences = useMemo(() => preferences, [preferences.emailNotifications, preferences.showDateTime, preferences.timezone, preferences.fiscalYearStart, preferences.darkMode]);

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

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

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

  // Initialize editedName when user data is available
  useEffect(() => {
    if (user?.name) {
      const [firstName, ...lastNameParts] = user.name.split(' ');
      setEditedFirstName(firstName);
      setEditedLastName(lastNameParts.join(' '));
    }
  }, [user?.name]);

  // Initialize preferences when user data is available
  useEffect(() => {
    if (user) {
      setPreferences({
        emailNotifications: user.emailNotifications ?? true,
        showDateTime: user.showDateTime ?? true,
        timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        fiscalYearStart: user.fiscalYearStart || 1, // Default to January if not set
        darkMode: user.darkMode ?? true,
      });
    }
  }, [user]);

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
        throw new Error(data.error || 'Failed to fetch companies');
      }

      // Filter out the user's own company
      const filteredCompanies = (Array.isArray(data) ? data : []).filter(
        (company: string) => company.toLowerCase() !== user?.companyName?.toLowerCase()
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

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      formData.append('userId', user?.id || '');

      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }

      const data = await response.json();
      setProfilePicture(data.imageUrl);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  const handlePasswordChange = async () => {
    // Reset error state
    setPasswordError('');

    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }

      // Reset form and close modal
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    }
  };

  const handleNameSave = async () => {
    if (!editedFirstName.trim()) {
      setNameError('First name cannot be empty');
      return;
    }

    try {
      const fullName = `${editedFirstName.trim()} ${editedLastName.trim()}`.trim();
      const response = await fetch('/api/update-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          name: fullName
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update name');
      }

      const data = await response.json();
      if (typeof window !== 'undefined') {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setIsEditingFirstName(false);
      setIsEditingLastName(false);
      setNameError('');
      
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-[#5B60D6] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      successMessage.textContent = 'Name updated successfully';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

      window.location.reload();
    } catch (error) {
      console.error('Error updating name:', error);
      setNameError(error instanceof Error ? error.message : 'Failed to update name. Please try again.');
    }
  };

  const handlePreferenceToggle = async (preference: 'emailNotifications' | 'showDateTime' | 'darkMode') => {
    if (!user?.id || isUpdatingPreferences) return;

    setIsUpdatingPreferences(true);
    const newPreferences = {
      ...preferences,
      [preference]: !preferences[preference]
    };

    try {
      // Update preferences in auth context
      await updatePreferences(newPreferences);
      setPreferences(newPreferences);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-[#5B60D6] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      successMessage.textContent = 'Preferences updated successfully';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

    } catch (error) {
      console.error('Error updating preferences:', error);
      // Revert the toggle
      setPreferences(preferences);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      errorMessage.textContent = error instanceof Error ? error.message : 'Failed to update preferences';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  const handlePreferencesUpdate = async (newPreferences: { fiscalYearStart: number }) => {
    if (!user?.id || isUpdatingPreferences) return;

    setIsUpdatingPreferences(true);
    const updatedPreferences = {
      ...preferences,
      ...newPreferences
    };

    try {
      // Update preferences in auth context
      await updatePreferences(updatedPreferences);
      setPreferences(updatedPreferences);

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed bottom-4 right-4 bg-[#5B60D6] text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      successMessage.textContent = 'Preferences updated successfully';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 3000);

    } catch (error) {
      console.error('Error updating preferences:', error);
      // Revert the changes
      setPreferences(preferences);
      
      // Show error message
      const errorMessage = document.createElement('div');
      errorMessage.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up';
      errorMessage.textContent = error instanceof Error ? error.message : 'Failed to update preferences';
      document.body.appendChild(errorMessage);
      
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    } finally {
      setIsUpdatingPreferences(false);
    }
  };

  // Add password change modal component
  const PasswordChangeModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass p-6 rounded-xl w-full max-w-md">
        <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
        {passwordError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg mb-4">
            {passwordError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              placeholder="Confirm new password"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={() => setShowPasswordModal(false)}
            className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 rounded-lg bg-[#5B60D6] text-white hover:bg-[#4347B5] transition-all"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );

  // Hidden file input for profile picture upload
  const hiddenFileInput = (
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      accept="image/*"
      onChange={handleProfilePictureUpload}
    />
  );

  // Memoize ContentCalendar so it only remounts when fiscalYearStart changes
  const contentCalendar = useMemo(
    () => (
      <ContentCalendar
        fiscalYearStart={memoizedPreferences.fiscalYearStart}
        view={calendarView}
        setView={setCalendarView}
        selectedQuarter={calendarSelectedQuarter}
        setSelectedQuarter={setCalendarSelectedQuarter}
        selectedDate={calendarSelectedDate}
        setSelectedDate={setCalendarSelectedDate}
        contentItems={calendarContentItems}
        setContentItems={setCalendarContentItems}
        newContent={calendarNewContent}
        setNewContent={setCalendarNewContent}
      />
    ),
    [memoizedPreferences.fiscalYearStart, calendarView, calendarSelectedQuarter, calendarSelectedDate, calendarContentItems, calendarNewContent]
  );

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
      case 'social':
        return 'Social Presence';
      case 'competitors':
        return 'Competitor Analysis';
      case 'compare':
        return 'Workbrand Comparison Tool';
      case 'detailed-analysis':
        return 'Detailed Analysis';
      case 'recommendations':
        return 'Recommendations';
      case 'profile':
        return 'User Profile';
      case 'careers':
        return 'Careers Page Evaluator';
      case 'job-descriptions':
        return 'Job Description Analyzer';
      case 'interview':
        return 'Interview Process Optimizer';
      case 'diversity':
        return 'Diversity & Inclusion Analyzer';
      case 'benefits':
        return 'Benefits & Perks Analyzer';
      case 'content-calendar':
        return 'Content Calendar';
      default:
        return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Your company\'s performance overview';
      case 'company':
        return 'Detailed analysis of your company\'s metrics';
      case 'social':
        return 'Social media presence and engagement metrics';
      case 'competitors':
        return 'Track and analyze your competitors';
      case 'compare':
        return 'Compare your company to others';
      case 'detailed-analysis':
        return 'In-depth analysis of company performance';
      case 'recommendations':
        return 'Personalized recommendations for improvement';
      case 'profile':
        return 'Manage your account settings and preferences';
      case 'careers':
        return 'Analyze and optimize your careers page';
      case 'job-descriptions':
        return 'Optimize your job descriptions for better results';
      case 'interview':
        return 'Evaluate and improve your interview process';
      case 'diversity':
        return 'Assess and enhance your D&I initiatives';
      case 'benefits':
        return 'Compare and optimize your benefits package';
      case 'content-calendar':
        return 'Manage your content calendar';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen">
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
          showDateTime={preferences.showDateTime}
        />

        {/* Main content container */}
        <div className={`px-4 sm:px-6 lg:px-8 pb-8 ${activeTab === 'dashboard' ? 'mt-2' : 'mt-8'}`}>
          {error && (
            <div className="glass-dark border border-red-400/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md mt-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-t-[#FE619E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="animate-fade-in">
                  <DashboardOverview userCompanyData={userCompanyData} setActiveTab={setActiveTab} />
                </div>
              )}

              {activeTab === 'company' && (
                <div className="animate-fade-in">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(categoryLabels).map(([category, label]) => (
                        <StatCard
                          key={category}
                          title={label}
                          value={userCompanyData?.scores?.[category as Category]?.totalScore || 0}
                          grade={userCompanyData?.scores?.[category as Category]?.grade || 'N/A'}
                          color={userCompanyData?.scores?.[category as Category]?.color || '#6B7280'}
                          icon={
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          }
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
                        <div className="space-y-4">
                          {Object.entries(categoryLabels).map(([category, label]) => (
                            <div key={category} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">{label}</span>
                                <span className="text-white font-medium">
                                  {userCompanyData?.scores?.[category as Category]?.totalScore || 0}%
                                </span>
                              </div>
                              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${userCompanyData?.scores?.[category as Category]?.totalScore || 0}%`,
                                    backgroundColor: userCompanyData?.scores?.[category as Category]?.color || '#6B7280'
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Changes</h3>
                        <div className="space-y-4">
                          {Object.entries(categoryLabels).map(([category, label]) => (
                            <div key={category} className="flex items-center justify-between">
                              <span className="text-white/70">{label}</span>
                              <span className="text-white font-medium">+2.5%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="animate-fade-in">
                  <div className="space-y-8">
                    <SocialPresence companyData={userCompanyData} />
                  </div>
                </div>
              )}

              {activeTab === 'competitors' && (
                <div className="animate-fade-in">
                  <div className="space-y-8">
                    <div className="glass p-6 rounded-xl">
                      <h2 className="text-2xl font-bold text-white mb-4">Competitor Tracking</h2>
                      <p className="text-white/70 mb-6">Monitor and analyze your competitors' employer brand performance over time.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.slice(0, 6).map((company, index) => (
                          <div key={company} className="glass p-6 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-white">{company}</h3>
                              <button
                                onClick={() => {
                                  setSelectedCompetitor(company);
                                  setActiveTab('compare');
                                }}
                                className="text-sm px-3 py-1.5 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 transition-all"
                              >
                                Compare
                              </button>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Last analyzed</span>
                                <span className="text-white">2 days ago</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Workbrand Score</span>
                                <span className="text-white">78/100</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/70">Trend</span>
                                <span className="text-green-400">↑ 2.3%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => setActiveTab('compare')}
                          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#2F3295] to-[#FE619E] text-white hover:opacity-90 transition-all"
                        >
                          Analyze New Competitor
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compare' && (
                <div className="animate-fade-in">
                  <div className="space-y-8">
                    <div className="glass rounded-xl p-6 shadow-lg border border-white/10">
                      <h2 className="text-2xl font-bold text-white mb-6">
                        Compare {user.companyName}'s Workbrand
                      </h2>
                      
                      {error && (
                        <div className="glass-dark border border-red-400/30 text-red-400 px-5 py-4 rounded-lg mb-6 backdrop-blur-md">
                          {error}
                        </div>
                      )}
                      
                      <p className="text-white/80 mb-8">
                        Enter any company name to compare {user.companyName}'s Workbrand score against them.
                        Our analysis provides an in-depth comparison across all key categories.
                      </p>

                      {/* Custom competitor input */}
                      <div className="glass rounded-lg p-6 border border-white/5">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <input
                            type="text"
                            className="flex-1 p-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 outline-none"
                            placeholder="Enter any company name (e.g., 'Mastercard', 'Google', 'Microsoft')"
                            value={newCompetitor}
                            onChange={(e) => setNewCompetitor(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && newCompetitor) {
                                setSelectedCompetitor(newCompetitor);
                                fetchCompetitorData(newCompetitor);
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              if (newCompetitor) {
                                setSelectedCompetitor(newCompetitor);
                                fetchCompetitorData(newCompetitor);
                              }
                            }}
                            className="px-6 py-3 bg-[#5B60D6] text-white rounded-lg hover:bg-[#4347B5] transition-all flex items-center justify-center min-w-[120px]"
                            disabled={!newCompetitor || isLoading}
                          >
                            {isLoading ? (
                              <span className="flex items-center text-white">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analyzing...
                              </span>
                            ) : (
                              <span className="flex items-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Compare
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comparison Results Section */}
                    {isLoading ? (
                      <div className="space-y-8 mt-8" id="comparison-results">
                        <div className="glass rounded-xl p-8 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-t-[#FE619E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <p className="text-white/70">Analyzing {newCompetitor}...</p>
                          </div>
                        </div>
                      </div>
                    ) : competitorData ? (
                      <div className="space-y-8 mt-8" id="comparison-results">
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
                      <div className="text-center py-16 glass rounded-xl mt-8">
                        <div className="opacity-70">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-white/60 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-white font-medium text-lg">
                          Input a competitor and click "Compare" to analyze against {user.companyName}
                        </p>
                        <p className="text-white/70 mt-2">
                          See how your Workbrand score compares to industry leaders
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'detailed-analysis' && (
                <div className="animate-fade-in space-y-8">
                  <DetailedMastercardAnalysis companyData={userCompanyData} />
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="animate-fade-in space-y-8">
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
                </div>
              )}

              {/* New tool sections */}
              {activeTab === 'careers' && (
                <div className="animate-fade-in space-y-8">
                  <div className="glass p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Careers Page Evaluator</h2>
                    <p className="text-white/70 mb-6">Analyze your careers page to improve candidate experience and conversion rates.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Page Structure</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Navigation</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Mobile Responsiveness</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Page Load Speed</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Content Quality</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Company Culture</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Benefits Showcase</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Diversity Statement</span>
                            <span className="text-red-400">✗</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'job-descriptions' && (
                <div className="animate-fade-in space-y-8">
                  <div className="glass p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Job Description Analyzer</h2>
                    <p className="text-white/70 mb-6">Optimize your job descriptions for better candidate attraction and diversity.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Content Analysis</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Inclusive Language</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Required Skills</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Salary Range</span>
                            <span className="text-red-400">✗</span>
                          </div>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">SEO Optimization</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Keywords</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Meta Description</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Title Tag</span>
                            <span className="text-green-400">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'interview' && (
                <div className="animate-fade-in space-y-8">
                  <div className="glass p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Interview Process Optimizer</h2>
                    <p className="text-white/70 mb-6">Evaluate and improve your interview process for better candidate experience.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Process Structure</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Clear Timeline</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Feedback Loop</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Candidate Communication</span>
                            <span className="text-red-400">✗</span>
                          </div>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Diversity & Inclusion</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Unconscious Bias Training</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Diverse Interview Panels</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Standardized Questions</span>
                            <span className="text-green-400">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'diversity' && (
                <div className="animate-fade-in space-y-8">
                  <div className="glass p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Diversity & Inclusion Analyzer</h2>
                    <p className="text-white/70 mb-6">Assess and improve your diversity and inclusion initiatives.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Current State</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Gender Diversity</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Ethnic Diversity</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Age Diversity</span>
                            <span className="text-red-400">✗</span>
                          </div>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Initiatives</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">D&I Training</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Employee Resource Groups</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Mentorship Programs</span>
                            <span className="text-green-400">✓</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div className="animate-fade-in space-y-8">
                  <div className="glass p-6 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-4">Benefits & Perks Analyzer</h2>
                    <p className="text-white/70 mb-6">Compare and optimize your benefits package against industry standards.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Core Benefits</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Health Insurance</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Retirement Plans</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Paid Time Off</span>
                            <span className="text-green-400">✓</span>
                          </div>
                        </div>
                      </div>
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Additional Perks</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Remote Work Options</span>
                            <span className="text-green-400">✓</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Professional Development</span>
                            <span className="text-yellow-400">⚠️</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/70">Wellness Programs</span>
                            <span className="text-red-400">✗</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="animate-fade-in space-y-8">
                  <div className="glass p-6 rounded-xl">
                    <div className="flex items-center space-x-6 mb-8">
                      <div className="relative group">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#5B60D6] to-[#8D90EB] flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                          {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.split(' ').map(n => n[0]).join('')
                          )}
                        </div>
                        <button 
                          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col">
                          <div className="text-2xl font-bold text-white mb-1">
                            <span className="text-white/70">{user?.name?.split(' ')[0]} {user?.name?.split(' ').slice(1).join(' ')}</span>
                          </div>
                        </div>
                        <p className="text-white/70">{user?.email}</p>
                        <p className="text-white/70">{user?.companyName}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center px-6 py-3 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 hover:text-[#5474fe] transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-white/70 text-sm mb-2">First Name</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white pr-10"
                                  value={isEditingFirstName ? editedFirstName : user?.name?.split(' ')[0]}
                                  onChange={(e) => {
                                    setEditedFirstName(e.target.value);
                                    setNameError('');
                                  }}
                                  readOnly={!isEditingFirstName}
                                  placeholder="First name"
                                />
                                {isEditingFirstName ? (
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                                    <button
                                      onClick={handleNameSave}
                                      className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                      title="Save"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIsEditingFirstName(false);
                                        const [firstName] = (user?.name || '').split(' ');
                                        setEditedFirstName(firstName || '');
                                        setNameError('');
                                      }}
                                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                      title="Cancel"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setIsEditingFirstName(true)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white/80 transition-colors"
                                    title="Edit first name"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className="block text-white/70 text-sm mb-2">Last Name</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white pr-10"
                                  value={isEditingLastName ? editedLastName : user?.name?.split(' ').slice(1).join(' ')}
                                  onChange={(e) => {
                                    setEditedLastName(e.target.value);
                                    setNameError('');
                                  }}
                                  readOnly={!isEditingLastName}
                                  placeholder="Last name"
                                />
                                {isEditingLastName ? (
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                                    <button
                                      onClick={handleNameSave}
                                      className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                      title="Save"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setIsEditingLastName(false);
                                        const lastNameParts = (user?.name || '').split(' ').slice(1);
                                        setEditedLastName(lastNameParts.join(' '));
                                        setNameError('');
                                      }}
                                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                      title="Cancel"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setIsEditingLastName(true)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white/80 transition-colors"
                                    title="Edit last name"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          {nameError && (
                            <p className="text-red-400 text-sm mt-1">{nameError}</p>
                          )}
                          <div>
                            <button 
                              onClick={() => setShowPasswordModal(true)}
                              className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/15 hover:text-[#5474fe] transition-all mt-4"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                              </svg>
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white block">Email Notifications</span>
                              <span className="text-white/70 text-sm">Receive updates about your company's performance</span>
                            </div>
                            <button
                              onClick={() => handlePreferenceToggle('emailNotifications')}
                              className="relative inline-block w-12 h-6"
                              disabled={isUpdatingPreferences}
                            >
                              <div
                                className={`block w-12 h-6 rounded-full transition-colors ${
                                  preferences.emailNotifications ? 'bg-[#5B60D6]' : 'bg-white/10'
                                }`}
                              />
                              <div
                                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white block">Light Mode</span>
                              <span className="text-white/70 text-sm">Style your Workbrand interface</span>
                            </div>
                            <button
                              onClick={() => handlePreferenceToggle('darkMode')}
                              className="relative inline-block w-12 h-6"
                              disabled={isUpdatingPreferences}
                            >
                              <div
                                className={`block w-12 h-6 rounded-full transition-colors ${
                                  preferences.darkMode ? 'bg-[#5B60D6]' : 'bg-white/10'
                                }`}
                              />
                              <div
                                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  preferences.darkMode ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-white block">Show Date/Time</span>
                              <span className="text-white/70 text-sm">Display timestamps in your local timezone ({preferences.timezone})</span>
                            </div>
                            <button
                              onClick={() => handlePreferenceToggle('showDateTime')}
                              className="relative inline-block w-12 h-6"
                              disabled={isUpdatingPreferences}
                            >
                              <div
                                className={`block w-12 h-6 rounded-full transition-colors ${
                                  preferences.showDateTime ? 'bg-[#5B60D6]' : 'bg-white/10'
                                }`}
                              />
                              <div
                                className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                                  preferences.showDateTime ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          <div>
                            <span className="text-white block mb-2">Fiscal Year Start</span>
                            <span className="text-white/70 text-sm block mb-3">Choose when your fiscal year begins</span>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                                <button
                                  key={month}
                                  onClick={() => {
                                    setPreferences(prev => ({
                                      ...prev,
                                      fiscalYearStart: index + 1
                                    }));
                                    handlePreferencesUpdate({ fiscalYearStart: index + 1 });
                                  }}
                                  className={`p-2 rounded-lg text-sm transition-all ${
                                    preferences.fiscalYearStart === index + 1
                                      ? 'bg-[#5B60D6] text-white'
                                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                  }`}
                                >
                                  {month}
                                </button>
                              ))}
                            </div>
                            <p className="mt-2 text-white/60 text-sm">
                              This setting affects how quarters are calculated in the Content Calendar
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content-calendar' && (
                <div className="animate-fade-in space-y-8">
                  {contentCalendar}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showPasswordModal && <PasswordChangeModal />}
      {hiddenFileInput}
    </div>
  );
}
