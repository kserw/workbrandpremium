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
  companyData: CompanyData | null;
}

const SocialPresence = ({ companyData }: SocialPresenceProps) => {
  // Sample data
  const sampleData = {
    linkedinFollowers: 12500,
    likes: 4500,
    comments: 1200,
    shares: 800,
    totalPosts: 156
  };

  const { linkedinFollowers, likes, comments, shares, totalPosts } = companyData?.extendedAnalysis?.socialMetrics || sampleData;
  const totalEngagement = likes + comments + shares;
  const engagementRate = ((totalEngagement / totalPosts) * 100).toFixed(1);

  const chartData = {
    labels: ['LinkedIn Followers (K)', 'Employee Advocacy', 'Interpersonal Fit', 'Engagement Rate'],
    datasets: [
      {
        label: 'Social Media Metrics',
        data: [
          (linkedinFollowers / 1000).toFixed(1),
          companyData?.subcategories?.employeeAdvocacy ? companyData.subcategories.employeeAdvocacy * 20 : 75,
          companyData?.interpersonalFit ? (companyData.interpersonalFit / 20) * 100 : 85,
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
    <div className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Social Media Presence</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">LinkedIn</h3>
            <svg className="h-6 w-6 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Followers</span>
              <span className="text-white">50K+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Engagement</span>
              <span className="text-green-400">High</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Posts/Week</span>
              <span className="text-white">3-5</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Twitter</h3>
            <svg className="h-6 w-6 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
            </svg>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Followers</span>
              <span className="text-white">25K+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Engagement</span>
              <span className="text-yellow-400">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Tweets/Week</span>
              <span className="text-white">5-7</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Instagram</h3>
            <svg className="h-6 w-6 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
            </svg>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Followers</span>
              <span className="text-white">15K+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Engagement</span>
              <span className="text-yellow-400">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Posts/Week</span>
              <span className="text-white">2-3</span>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Facebook</h3>
            <svg className="h-6 w-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Followers</span>
              <span className="text-white">30K+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Engagement</span>
              <span className="text-yellow-400">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Posts/Week</span>
              <span className="text-white">3-4</span>
            </div>
          </div>
        </div>
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
};

export default SocialPresence; 