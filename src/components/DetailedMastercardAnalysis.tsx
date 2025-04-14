import React from 'react';
import { CompanyData } from '@/types';
import Image from 'next/image';

interface DetailedMastercardAnalysisProps {
  companyData: CompanyData;
}

const DetailedMastercardAnalysis: React.FC<DetailedMastercardAnalysisProps> = ({ companyData }) => {
  // Type assertion to access the extended data
  const extendedData = (companyData as any).extendedAnalysis;
  
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
            <h3 className="text-xl font-semibold text-white flex items-center">
              <span className="mr-2">Mastercard Employer Brand Analysis</span>
              <span className="text-white bg-white/10 px-2 py-1 rounded-md">
                April 2025
              </span>
            </h3>
            <p className="text-white mt-1">Comprehensive employer brand assessment</p>
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
      
      {/* Social Media Presence */}
      <div className="glass p-6 rounded-lg">
        <h4 className="text-lg font-medium text-white mb-4">Social Media Presence</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="text-white">LinkedIn Followers</span>
              </div>
              <span className="text-white font-bold">{socialMedia.linkedinFollowers.toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-white">Instagram Followers</span>
              </div>
              <span className="text-white font-bold">{socialMedia.instagramFollowers.toLocaleString()}</span>
            </div>
            
            <div className="mt-4">
              <h5 className="text-white font-medium mb-2">Branded Hashtags</h5>
              <div className="flex flex-wrap gap-2">
                {socialMedia.brandedHashtags.map((hashtag, index) => (
                  <span 
                    key={index}
                    className="bg-[#FF5F00]/20 text-[#F79E1B] px-3 py-1 rounded-full text-sm"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="text-white font-medium mb-2">Top Engagement Topics</h5>
            <ul className="space-y-2">
              {socialMedia.topEngagementTopics.map((topic, index) => (
                <li key={index} className="bg-white/5 p-3 rounded-lg flex items-center">
                  <div className="h-2 w-2 rounded-full bg-[#EB001B] mr-3"></div>
                  <span className="text-white/80">{topic}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-4">
              <h5 className="text-white font-medium mb-2">Active Platforms</h5>
              <div className="flex flex-wrap gap-2">
                {socialMedia.platforms.map((platform, index) => (
                  <span 
                    key={index}
                    className="bg-white/10 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
              {mediaCoverage.positive.map((item, index) => (
                <li key={index} className="bg-green-500/10 p-3 rounded-lg">
                  <span className="text-white/80">{item}</span>
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
              {mediaCoverage.negative.map((item, index) => (
                <li key={index} className="bg-red-500/10 p-3 rounded-lg">
                  <span className="text-white/80">{item}</span>
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
                <p className="text-white">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedMastercardAnalysis; 