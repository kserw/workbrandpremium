import { CompanyData } from '@/types';
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
import StatCard from './StatCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SocialPresenceProps {
  company: CompanyData;
}

export default function SocialPresence({ company }: SocialPresenceProps) {
  // Sample data
  const sampleData = {
    linkedinFollowers: 12500,
    likes: 4500,
    comments: 1200,
    shares: 800,
    totalPosts: 156
  };

  const { linkedinFollowers, likes, comments, shares, totalPosts } = company?.extendedAnalysis?.socialMetrics || sampleData;
  const totalEngagement = likes + comments + shares;
  const engagementRate = ((totalEngagement / totalPosts) * 100).toFixed(1);

  const chartData = {
    labels: ['LinkedIn Followers (K)', 'Employee Advocacy', 'Interpersonal Fit', 'Engagement Rate'],
    datasets: [
      {
        label: 'Social Media Metrics',
        data: [
          (linkedinFollowers / 1000).toFixed(1),
          company?.subcategories?.employeeAdvocacy ? company.subcategories.employeeAdvocacy * 20 : 75,
          company?.interpersonalFit ? (company.interpersonalFit / 20) * 100 : 85,
          parseFloat(engagementRate)
        ],
        backgroundColor: 'rgba(47, 50, 149, 0.7)',
        borderColor: '#2F3295',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="LinkedIn Followers"
          value={`${(linkedinFollowers / 1000).toFixed(1)}K`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          }
          color="#0A66C2"
        />
        <StatCard
          title="Total Engagement"
          value={totalEngagement.toLocaleString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          }
          color="#FE619E"
        />
        <StatCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          }
          color="#5474fe"
        />
        <StatCard
          title="Total Posts"
          value={totalPosts.toLocaleString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          }
          color="#84cc16"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="modern-card">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg font-semibold">Engagement Breakdown</h3>
            </div>
            <div className="h-80">
              <Bar options={chartOptions} data={chartData} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="modern-card p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Top Performing Content
            </h3>
            <div>
              <p className="text-white/80 mb-3">
                Your most engaging posts focus on company culture and employee stories, with an average engagement rate of {engagementRate}%.
              </p>
              <button 
                className="text-[#FE619E] text-sm hover:text-[#5474fe] transition-colors flex items-center"
                onClick={() => window.open('https://www.linkedin.com/company/your-company', '_blank')}
              >
                View LinkedIn Profile
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <div className="modern-card p-6">
            <h3 className="text-white text-lg font-semibold mb-4">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Recommendations
            </h3>
            <div>
              <p className="text-white/80 mb-3">
                To improve your social media presence:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Increase posting frequency to at least 3 times per week</li>
                <li>Focus on employee-generated content to boost authenticity</li>
                <li>Use more video content, which typically has higher engagement</li>
                <li>Engage more with comments and messages to build community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 