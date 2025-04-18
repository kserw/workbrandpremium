import React from 'react';
import { CompanyData } from '@/types';
import Image from 'next/image';
import SocialPresence from '@/components/SocialPresence';

interface ExtendedAnalysisData {
  reportDate: string;
  overallSentimentScore: number;
  scores: {
    glassdoor: {
      rating: number;
      recommendationRate: number;
      ceoApproval: number;
    };
    socialMediaSentiment: number;
    mediaSentiment: number;
  };
  competitorScores: Array<{
    company: string;
    score: number;
  }>;
  praise: string[];
  criticism: string[];
  socialMedia: {
    linkedinFollowers: number;
    instagramFollowers: number;
    brandedHashtags: string[];
    topEngagementTopics: string[];
    platforms: string[];
  };
  mediaCoverage: Array<{
    source: string;
    title: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    date: string;
  }>;
  recommendations: Array<{
    category: string;
    action: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

interface DetailedMastercardAnalysisProps {
  companyData: CompanyData & {
    extendedAnalysis?: ExtendedAnalysisData;
  };
}

const DetailedMastercardAnalysis: React.FC<DetailedMastercardAnalysisProps> = ({ companyData }) => {
  const extendedData = companyData.extendedAnalysis;
  
  // Return early if no extended data is available
  if (!extendedData) {
    return (
      <div className="glass p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">Detailed Analysis Not Available</h3>
        <p className="text-white/80">No detailed analysis data is available for this company.</p>
      </div>
    );
  }
  
  const {
    reportDate,
    overallSentimentScore,
    scores,
    competitorScores,
    praise,
    criticism,
    socialMedia,
    mediaCoverage,
    recommendations
  } = extendedData;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with overall score */}
      <div className="glass p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center" style={{ color: 'white' }}>
              <span className="mr-2" style={{ color: 'white' }}>Mastercard Employer Brand Analysis</span>
              <span className="text-white bg-white/10 px-2 py-1 rounded-md">
                April 2025
              </span>
            </h3>
            <p className="text-white mt-1" style={{ color: 'white' }}>Comprehensive employer brand assessment</p>
          </div>
          <div className="bg-gradient-to-r from-[#EB001B] to-[#F79E1B] h-16 w-16 rounded-full flex items-center justify-center">
            <div className="bg-black/20 h-14 w-14 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-xl">{overallSentimentScore}</span>
            </div>
          </div>
        </div>
        
        {/* Glassdoor scores */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-3">Glassdoor Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-dark p-4 rounded-lg">
              <p className="text-white/60 text-sm">Overall Rating</p>
              <p className="text-white text-2xl font-bold">{scores.glassdoor.rating}/5</p>
            </div>
            <div className="glass-dark p-4 rounded-lg">
              <p className="text-white/60 text-sm">Recommend to Friend</p>
              <p className="text-white text-2xl font-bold">{scores.glassdoor.recommendationRate}%</p>
            </div>
            <div className="glass-dark p-4 rounded-lg">
              <p className="text-white/60 text-sm">CEO Approval</p>
              <p className="text-white text-2xl font-bold">{scores.glassdoor.ceoApproval}%</p>
            </div>
          </div>
        </div>
        
        {/* Sentiment scores */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-3">Sentiment Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-dark p-4 rounded-lg">
              <p className="text-white/60 text-sm">Social Media Sentiment</p>
              <div className="mt-2">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#EB001B] to-[#F79E1B]" 
                    style={{ width: `${scores.socialMediaSentiment}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-white/60 text-xs">0</span>
                  <span className="text-white font-medium">{scores.socialMediaSentiment}%</span>
                  <span className="text-white/60 text-xs">100</span>
                </div>
              </div>
            </div>
            <div className="glass-dark p-4 rounded-lg">
              <p className="text-white/60 text-sm">Media Coverage Sentiment</p>
              <div className="mt-2">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#EB001B] to-[#F79E1B]" 
                    style={{ width: `${scores.mediaSentiment}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-white/60 text-xs">0</span>
                  <span className="text-white font-medium">{scores.mediaSentiment}%</span>
                  <span className="text-white/60 text-xs">100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Competitor comparison */}
      <div className="glass p-6 rounded-lg">
        <h4 className="text-lg font-medium text-white mb-4">Competitor Comparison</h4>
        <div className="relative h-12 bg-white/10 rounded-lg overflow-hidden">
          {competitorScores.map((competitor, index) => {
            // Calculate position based on score (0-100 scale)
            const position = competitor.score;
            return (
              <div 
                key={competitor.company}
                className="absolute top-0 h-full flex flex-col items-center justify-center"
                style={{ 
                  left: `${position}%`, 
                  transform: 'translateX(-50%)',
                  zIndex: competitorScores.length - index 
                }}
              >
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ 
                    backgroundColor: index === 0 ? '#EB001B' : 
                                     index === 1 ? '#FF5F00' : 
                                     index === 2 ? '#F79E1B' : '#6A6A6A'
                  }}
                >
                  {competitor.score}
                </div>
                <span className="text-white text-xs mt-1 whitespace-nowrap">
                  {competitor.company}
                </span>
              </div>
            );
          })}
          
          {/* Add Mastercard's position */}
          <div 
            className="absolute top-0 h-full flex flex-col items-center justify-center"
            style={{ 
              left: `${overallSentimentScore}%`, 
              transform: 'translateX(-50%)',
              zIndex: competitorScores.length + 1
            }}
          >
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r from-[#EB001B] to-[#F79E1B]">
              {overallSentimentScore}
            </div>
            <span className="text-white text-xs font-medium mt-1 whitespace-nowrap">
              Mastercard
            </span>
          </div>
          
          {/* Scale markers */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-white/40 text-[10px]">
            <span>50</span>
            <span>60</span>
            <span>70</span>
            <span>80</span>
            <span>90</span>
            <span>100</span>
          </div>
        </div>
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-lg">
          <h4 className="text-lg font-medium text-white mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Strengths
          </h4>
          <ul className="space-y-2 mt-4">
            {praise.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-400 mr-2">•</span>
                <span className="text-white/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="glass p-6 rounded-lg">
          <h4 className="text-lg font-medium text-white mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Areas for Improvement
          </h4>
          <ul className="space-y-2 mt-4">
            {criticism.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-400 mr-2">•</span>
                <span className="text-white/80">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Social Presence */}
      <SocialPresence company={companyData} />
      
      {/* Media Coverage */}
      <div className="glass p-6 rounded-lg">
        <h4 className="text-lg font-medium text-white mb-4">Media Coverage Highlights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="flex items-center text-white font-medium mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Positive Coverage
            </h5>
            <ul className="space-y-2">
              {mediaCoverage
                .filter(item => item.sentiment === 'positive')
                .map((item, index) => (
                  <li key={index} className="bg-green-500/10 p-3 rounded-lg">
                    <span className="text-white/80">{item.title}</span>
                  </li>
                ))}
            </ul>
          </div>
          
          <div>
            <h5 className="flex items-center text-white font-medium mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Negative Coverage
            </h5>
            <ul className="space-y-2">
              {mediaCoverage
                .filter(item => item.sentiment === 'negative')
                .map((item, index) => (
                  <li key={index} className="bg-red-500/10 p-3 rounded-lg">
                    <span className="text-white/80">{item.title}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <div className="glass p-6 rounded-lg">
        <h4 className="text-lg font-medium text-white mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          Recommendations for Improvement
        </h4>
        <div className="mt-4">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] rounded-full flex items-center justify-center text-white font-bold mr-3">
                {index + 1}
              </div>
              <div className="bg-white/5 p-4 rounded-lg flex-grow">
                <div className="flex flex-col">
                  <span className="text-white/60 text-sm mb-1">{recommendation.category}</span>
                  <p className="text-white">{recommendation.action}</p>
                  <span className={`text-sm mt-2 ${
                    recommendation.priority === 'high' ? 'text-red-400' :
                    recommendation.priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    Priority: {recommendation.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedMastercardAnalysis; 