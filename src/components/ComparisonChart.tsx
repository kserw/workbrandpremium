import React from 'react';
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
import { CompanyData, categoryLabels, Category } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ComparisonChartProps {
  userCompany: CompanyData;
  competitor: CompanyData;
  userCompanyName: string;
  competitorName: string;
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

export default function ComparisonChart({
  userCompany,
  competitor,
  userCompanyName,
  competitorName,
}: ComparisonChartProps) {
  const categories = Object.keys(categoryLabels) as Category[];

  // Calculate total scores and grades
  const userScore = calculateTotalScore(userCompany);
  const competitorScore = calculateTotalScore(competitor);

  // Use the company's primary color or default to the original colors
  const userCompanyColor = userCompany.primaryColor || '#2F3295';
  const competitorColor = competitor.primaryColor || '#FE619E';

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        ticks: {
          stepSize: 5,
          color: 'rgba(255, 255, 255, 0.7)', // White text for axis ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
        },
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)', // White text for axis ticks
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light grid lines
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.9)', // White text for legend labels
        },
      },
      title: {
        display: true,
        text: 'Workbrand Score Comparison',
        font: {
          size: 16,
        },
        color: 'rgba(255, 255, 255, 0.9)', // White text for title
      },
      tooltip: {
        titleColor: '#FFFFFF', // White text for tooltip title
        bodyColor: '#FFFFFF', // White text for tooltip body
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for tooltip
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  const data = {
    labels: categories.map(category => categoryLabels[category]),
    datasets: [
      {
        label: userCompanyName,
        data: categories.map(category => userCompany[category]),
        backgroundColor: userCompanyColor,
        borderColor: userCompanyColor,
        borderWidth: 1,
      },
      {
        label: competitorName,
        data: categories.map(category => competitor[category]),
        backgroundColor: competitorColor,
        borderColor: competitorColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="modern-card p-6 rounded-lg shadow-md">
      {/* Workbrand Score Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-dark p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white" style={{ color: userCompanyColor }}>
              {userCompanyName}
            </h3>
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">{userScore.score}</span>
              <span className="text-sm text-white/70 ml-1">/ 100</span>
              <span
                className="ml-2 px-2 py-1 rounded-md font-bold text-white shadow-sm"
                style={{
                  backgroundColor: `${userScore.gradeColor}`,
                }}
              >
                Grade: {userScore.grade}
              </span>
            </div>
          </div>
          <p className="text-sm text-white/80">Workbrand Score</p>
          <p className="text-xs text-white/60 mt-1">Based on 5 categories (max 20 points each)</p>
          <div className="mt-2">
            <p className="text-sm text-white/80">
              Employees: {userCompany.numEmployees.toLocaleString()}
            </p>
            <p className="text-sm text-white/80">
              Average Employee Rating: {userCompany.glassdoorScore.toFixed(1)}/5
            </p>
          </div>

          {/* Top 3 Words Section */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm font-medium text-white/80 mb-2">
              Top 3 Words Associated with Your Employer Brand:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {userCompany.top3Words &&
                userCompany.top3Words.map((word, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-md text-white text-sm font-medium"
                    style={{ backgroundColor: userCompanyColor }}
                  >
                    {word}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="glass-dark p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white" style={{ color: competitorColor }}>
              {competitorName}
            </h3>
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">{competitorScore.score}</span>
              <span className="text-sm text-white/70 ml-1">/ 100</span>
              <span
                className="ml-2 px-2 py-1 rounded-md font-bold text-white shadow-sm"
                style={{
                  backgroundColor: `${competitorScore.gradeColor}`,
                }}
              >
                Grade: {competitorScore.grade}
              </span>
            </div>
          </div>
          <p className="text-sm text-white/80">Workbrand Score</p>
          <p className="text-xs text-white/60 mt-1">Based on 5 categories (max 20 points each)</p>
          <div className="mt-2">
            <p className="text-sm text-white/80">
              Employees: {competitor.numEmployees.toLocaleString()}
            </p>
            <p className="text-sm text-white/80">
              Average Employee Rating: {competitor.glassdoorScore.toFixed(1)}/5
            </p>
          </div>

          {/* Top 3 Words Section */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-sm font-medium text-white/80 mb-2">
              Top 3 Words Associated with {competitorName}'s Employer Brand:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {competitor.top3Words &&
                competitor.top3Words.map((word, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-md text-white text-sm font-medium"
                    style={{ backgroundColor: competitorColor }}
                  >
                    {word}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-lg mb-8">
        <Bar options={options} data={data} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Comparison Table</h3>
        <div className="overflow-x-auto glass-dark rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 px-4 text-left text-white">Category</th>
                <th className="py-2 px-4 text-left text-white" style={{ color: userCompanyColor }}>
                  {userCompanyName}
                </th>
                <th className="py-2 px-4 text-left text-white" style={{ color: competitorColor }}>
                  {competitorName}
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category} className="hover:bg-white/5 border-b border-white/10">
                  <td className="py-2 px-4 text-white">{categoryLabels[category]}</td>
                  <td className="py-2 px-4 text-white">
                    <div className="flex items-center">
                      <div className="w-16 bg-workbrand-blue/20 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(userCompany[category] / 20) * 100}%`,
                            backgroundColor: userCompanyColor,
                          }}
                        ></div>
                      </div>
                      {userCompany[category]}
                    </div>
                  </td>
                  <td className="py-2 px-4 text-white">
                    <div className="flex items-center">
                      <div className="w-16 bg-workbrand-blue/20 rounded-full h-2 mr-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(competitor[category] / 20) * 100}%`,
                            backgroundColor: competitorColor,
                          }}
                        ></div>
                      </div>
                      {competitor[category]}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="hover:bg-white/5 bg-white/5 border-b border-white/10">
                <td className="py-2 px-4 font-medium text-white">Total Workbrand Score</td>
                <td className="py-2 px-4 font-medium text-white">
                  {userScore.score}/100 (
                  <span style={{ color: userScore.gradeColor }}>Grade: {userScore.grade}</span>)
                </td>
                <td className="py-2 px-4 font-medium text-white">
                  {competitorScore.score}/100 (
                  <span style={{ color: competitorScore.gradeColor }}>
                    Grade: {competitorScore.grade}
                  </span>
                  )
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-4 text-white">Average Employee Rating</td>
                <td className="py-2 px-4 text-white">
                  {userCompany.glassdoorScore.toFixed(1)}/5
                </td>
                <td className="py-2 px-4 text-white">
                  {competitor.glassdoorScore.toFixed(1)}/5
                </td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-4 text-white">Number of Employees</td>
                <td className="py-2 px-4 text-white">
                  {userCompany.numEmployees.toLocaleString()}
                </td>
                <td className="py-2 px-4 text-white">
                  {competitor.numEmployees.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 