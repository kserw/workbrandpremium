import { useEffect, useState } from 'react';
import { CompanyData, Category, categoryLabels } from '@/types';
import { useAuth } from '@/utils/auth';
import StatCard from './StatCard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DashboardOverviewProps {
  userCompanyData: CompanyData | null;
  setActiveTab: (tab: string) => void;
}

export default function DashboardOverview({ userCompanyData, setActiveTab }: DashboardOverviewProps) {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any>(null);
  
  // Function to calculate total score and letter grade
  const calculateTotalScore = (company: CompanyData | null) => {
    if (!company?.scores) return { score: 0, grade: 'N/A', gradeColor: '#6B7280' };
    
    const categories = Object.keys(categoryLabels) as Category[];
    const totalPossible = categories.length * 20; // 5 categories * 20 points each
    const totalScore = categories.reduce((sum, category) => {
      const categoryScore = company.scores[category]?.totalScore || 0;
      return sum + categoryScore;
    }, 0);
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
  
  // Prepare chart data
  useEffect(() => {
    if (userCompanyData?.scores) {
      const categories = Object.keys(categoryLabels) as Category[];
      const chartColors = {
        background: 'rgba(47, 50, 149, 0.7)',
        border: '#2F3295',
      };
      
      setChartData({
        labels: categories.map(category => categoryLabels[category]),
        datasets: [
          {
            label: 'Score (out of 20)',
            data: categories.map(category => userCompanyData.scores[category]?.totalScore || 0),
            backgroundColor: chartColors.background,
            borderColor: chartColors.border,
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      });
    }
  }, [userCompanyData]);
  
  // Find strongest and weakest categories
  const findStrongestCategory = (): { category: Category; score: number } => {
    if (!userCompanyData?.scores) return { category: 'interpersonalFit', score: 0 };
    
    const categories = Object.keys(categoryLabels) as Category[];
    let strongest = { 
      category: categories[0], 
      score: userCompanyData.scores[categories[0]]?.totalScore || 0 
    };
    
    categories.forEach(category => {
      const categoryScore = userCompanyData.scores[category]?.totalScore || 0;
      if (categoryScore > strongest.score) {
        strongest = { category, score: categoryScore };
      }
    });
    
    return strongest;
  };
  
  const findWeakestCategory = (): { category: Category; score: number } => {
    if (!userCompanyData?.scores) return { category: 'interpersonalFit', score: 0 };
    
    const categories = Object.keys(categoryLabels) as Category[];
    let weakest = { 
      category: categories[0], 
      score: userCompanyData.scores[categories[0]]?.totalScore || 0 
    };
    
    categories.forEach(category => {
      const categoryScore = userCompanyData.scores[category]?.totalScore || 0;
      if (categoryScore < weakest.score) {
        weakest = { category, score: categoryScore };
      }
    });
    
    return weakest;
  };
  
  const { score, grade, gradeColor } = calculateTotalScore(userCompanyData);
  const strongest = findStrongestCategory();
  const weakest = findWeakestCategory();
  
  // Format date for "Last Updated"
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
    },
  };
  
  if (!userCompanyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/70">Loading {user?.companyName}'s data...</div>
      </div>
    );
  }
  
  return (
    <div className="py-6 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold mb-2">Welcome to your dashboard, {user?.name?.split(' ')[0]}</h2>
        <p className="text-white/70">Here's how {user?.companyName} is performing on the Workbrand metrics.</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Overall Score"
          value={`${score}/100`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          }
          color={gradeColor}
          onClick={() => setActiveTab('company')}
        />
        
        <StatCard
          title="Grade"
          value={grade}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          }
          color={gradeColor}
          onClick={() => setActiveTab('company')}
        />
        
        <StatCard
          title="Employee Rating"
          value={`${userCompanyData.glassdoorScore?.toFixed(1) || 'N/A'}/5`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          }
          color="#eab308" // Yellow
          trend={{
            value: 4.2,
            label: "since last quarter",
            isPositive: true
          }}
          onClick={() => setActiveTab('company')}
        />
        
        <StatCard
          title="Employees"
          value={userCompanyData.numEmployees?.toLocaleString() || 'N/A'}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
          color="#3b82f6" // Blue
          onClick={() => setActiveTab('company')}
        />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 modern-card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg font-semibold">Category Performance</h3>
              <span className="text-white/50 text-xs">Last Updated: {lastUpdated}</span>
            </div>
            <div className="h-80">
              {chartData && <Bar options={chartOptions} data={chartData} />}
            </div>
          </div>
        </div>
        
        {/* Insights and Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Strengths */}
          <div className="modern-card p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Strengths
            </h3>
            <div>
              <p className="text-white/80 mb-3">
                {user?.companyName}'s highest scoring category is <span className="text-white font-semibold">{categoryLabels[strongest.category]}</span> with a score of {strongest.score}/20.
              </p>
              <button 
                className="text-[#FE619E] text-sm hover:text-[#5474fe] transition-colors flex items-center"
                onClick={() => setActiveTab('company')}
              >
                View details
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Areas for Improvement */}
          <div className="modern-card p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Areas for Improvement
            </h3>
            <div>
              <p className="text-white/80 mb-3">
                {user?.companyName}'s lowest scoring category is <span className="text-white font-semibold">{categoryLabels[weakest.category]}</span> with a score of {weakest.score}/20.
              </p>
              <button 
                className="text-[#FE619E] text-sm hover:text-[#5474fe] transition-colors flex items-center"
                onClick={() => setActiveTab('recommendations')}
              >
                View recommendations
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Competitor Insights */}
          <div className="modern-card p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Competitor Insights
            </h3>
            <div>
              <p className="text-white/80 mb-3">
                Compare {user?.companyName}'s Workbrand score with industry competitors to get a better understanding of your position in the market.
              </p>
              <button 
                className="text-[#FE619E] text-sm hover:text-[#5474fe] transition-colors flex items-center"
                onClick={() => setActiveTab('compare')}
              >
                Compare with competitors
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 