import OpenAI from 'openai';
import { CompanyData } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to limit the total score to a maximum of 85 points
// while maintaining the proportional relationship between categories
function limitTotalScore(data: CompanyData): CompanyData {
  // Calculate the current total score (maximum would be 100)
  const categories = [
    'interpersonalFit',
    'thrivingAtWork',
    'experienceAndCompetency',
    'recognitionAndCompensation',
    'purposeAndInvolvement'
  ];
  
  let totalScore = 0;
  
  for (const category of categories) {
    if (typeof data[category as keyof CompanyData] === 'number') {
      totalScore += data[category as keyof CompanyData] as number;
    }
  }
  
  // If the total score exceeds 85, scale down all categories proportionally
  if (totalScore > 85) {
    const scalingFactor = 85 / totalScore;
    
    console.log(`Limiting total score from ${totalScore} to 85 (scaling factor: ${scalingFactor.toFixed(2)})`);
    
    for (const category of categories) {
      const currentScore = data[category as keyof CompanyData] as number;
      // Round to nearest integer to ensure whole numbers
      const newScore = Math.round(currentScore * scalingFactor);
      (data as any)[category] = newScore;
    }
    
    // Adjust subcategories to match the new main category scores
    if (data.subcategories) {
      // Scale down subcategory scores proportionally
      for (const key in data.subcategories) {
        if (data.subcategories.hasOwnProperty(key)) {
          const currentSubScore = data.subcategories[key as keyof typeof data.subcategories];
          // Cap subcategory scores at 4 (out of 5) to ensure they're not too high
          const newSubScore = Math.min(4, Math.round(currentSubScore * scalingFactor));
          data.subcategories[key as keyof typeof data.subcategories] = newSubScore;
        }
      }
    }
  }
  
  return data;
}

export const analyzeCompany = async (companyName: string): Promise<CompanyData | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert in employer branding and company analysis. Analyze the given company and provide insights about their employer brand."
        },
        {
          role: "user",
          content: `Analyze the employer brand of ${companyName}. Focus on their strengths, areas for improvement, and how they compare to industry standards.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Check if we have a content response
    if (!response.choices[0].message.content) {
      console.error('OpenAI returned empty content');
      return null;
    }

    try {
      // Try to parse the JSON response
      const result = JSON.parse(response.choices[0].message.content);
      
      // Store the company name in the result for reference
      result.companyName = companyName;
      
      // Ensure critical fields have at least default values
      if (!result.evpStatement) {
        console.log(`Adding default evpStatement for ${companyName}`);
        result.evpStatement = `${companyName} is committed to creating a positive and supportive work environment that enables employees to grow professionally while making meaningful contributions.`;
      }
      
      if (!result.top3Words || !Array.isArray(result.top3Words) || result.top3Words.length === 0) {
        console.log(`Adding default top3Words for ${companyName}`);
        result.top3Words = ["Professional", "Innovative", "Dedicated"];
      }
      
      if (!result.subcategories) {
        console.log(`Creating default subcategories for ${companyName}`);
        result.subcategories = {};
        
        // Add default values for all subcategory scores (3 out of 5 for everything)
        for (const subcategory of [
          "diversityAndInclusion", "leadershipEffectiveness", "employeeAdvocacy", "workplaceCulture",
          "employerValueProposition", "careerDevelopment", "innovationAdvancement", "workLifeBalance",
          "employeeExperience", "competencyUtilization", "professionalGrowth", "resourceAccess",
          "compensationCompetitiveness", "talentRetention", "performanceRecognition", "compensationTransparency",
          "socialResponsibility", "sustainabilityInitiatives", "employeeEngagement", "meaningfulWork"
        ]) {
          result.subcategories[subcategory] = 3;
        }
      }
      
      if (!result.analysis) {
        console.log(`Creating default analysis for ${companyName}`);
        result.analysis = {
          overview: `${companyName} demonstrates a balanced approach to employee experience, with particular strengths in innovation and professional development.`,
          interpersonalFit: `${companyName} fosters an inclusive workplace environment with effective leadership structures.`,
          thrivingAtWork: `${companyName} provides opportunities for career advancement and encourages a healthy work-life balance.`,
          experienceAndCompetency: `${companyName} equips employees with the necessary tools and resources to excel in their roles.`,
          recognitionAndCompensation: `${companyName} offers competitive compensation packages and recognizes employee contributions.`,
          purposeAndInvolvement: `${companyName} engages employees in meaningful work that aligns with the company's broader mission.`
        };
      }
      
      // Apply the total score limitation
      const limitedResult = limitTotalScore(result);
      
      console.log(`Successfully analyzed ${companyName}`);
      return limitedResult;
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing company:', error);
    throw error;
  }
};

export const compareCompanies = async (company1: string, company2: string): Promise<{userCompany: CompanyData, competitor: CompanyData} | null> => {
  try {
    // Analyze both companies
    const userCompanyData = await analyzeCompany(company1);
    if (!userCompanyData) {
      console.error(`Failed to analyze user company: ${company1}`);
      return null;
    }
    
    const competitorData = await analyzeCompany(company2);
    if (!competitorData) {
      console.error(`Failed to analyze competitor: ${company2}`);
      return null;
    }
    
    return {
      userCompany: userCompanyData,
      competitor: competitorData
    };
  } catch (error) {
    console.error('Error comparing companies:', error);
    return null;
  }
}; 