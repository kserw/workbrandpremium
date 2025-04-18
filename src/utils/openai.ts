import OpenAI from 'openai';
import { CompanyData } from '@/types';

// Initialize OpenAI client with better error handling
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in environment variables');
  throw new Error('OpenAI API key is required');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
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
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured');
    throw new Error('OpenAI API key is required');
  }

  try {
    console.log(`Starting analysis for ${companyName} using GPT-4o`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",  // Using GPT-4o model
      messages: [
        {
          role: "system",
          content: "You are an expert in employer branding and company analysis. Your responses must be in valid JSON format with all required fields for the CompanyData type."
        },
        {
          role: "user",
          content: `Analyze the employer brand of ${companyName}. Return the analysis in JSON format with the following structure:
{
  "brandPositionAndPerception": number (0-20),
  "compensationAndBenefits": number (0-20),
  "growthAndDevelopment": number (0-20),
  "peopleAndCulture": number (0-20),
  "innovationAndProducts": number (0-20),
  "glassdoorScore": number (0-5),
  "numEmployees": number,
  "linkedinFollowers": number,
  "headquarters": string,
  "stockTicker": string (optional),
  "stockPrice": number (optional),
  "primaryColor": string (optional),
  "top3Words": string[],
  "evpStatement": string,
  "subcategories": {
    "diversityAndInclusion": number (0-5),
    "leadershipEffectiveness": number (0-5),
    "employeeAdvocacy": number (0-5),
    "workplaceCulture": number (0-5),
    "employerValueProposition": number (0-5),
    "careerDevelopment": number (0-5),
    "innovationAdvancement": number (0-5),
    "workLifeBalance": number (0-5),
    "employeeExperience": number (0-5),
    "competencyUtilization": number (0-5),
    "professionalGrowth": number (0-5),
    "resourceAccess": number (0-5),
    "compensationCompetitiveness": number (0-5),
    "talentRetention": number (0-5),
    "performanceRecognition": number (0-5),
    "compensationTransparency": number (0-5),
    "socialResponsibility": number (0-5),
    "sustainabilityInitiatives": number (0-5),
    "employeeEngagement": number (0-5),
    "meaningfulWork": number (0-5)
  },
  "analysis": {
    "overview": string,
    "brandPositionAndPerception": string,
    "compensationAndBenefits": string,
    "growthAndDevelopment": string,
    "peopleAndCulture": string,
    "innovationAndProducts": string
  }
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      console.error('OpenAI returned empty content');
      return null;
    }

    try {
      const result = JSON.parse(response.choices[0].message.content);
      
      // Store the company name in the result for reference
      result.companyName = companyName;
      
      // Ensure all required fields exist with proper types
      const requiredFields = [
        'brandPositionAndPerception', 'compensationAndBenefits', 'growthAndDevelopment',
        'peopleAndCulture', 'innovationAndProducts', 'glassdoorScore',
        'numEmployees', 'linkedinFollowers', 'headquarters', 'top3Words', 
        'evpStatement', 'subcategories', 'analysis'
      ];
      
      for (const field of requiredFields) {
        if (!(field in result)) {
          console.error(`Missing required field: ${field}`);
          return null;
        }
      }
      
      // Ensure scores are numbers between 0-20 for main categories
      const mainCategories = [
        'brandPositionAndPerception', 'compensationAndBenefits', 'growthAndDevelopment',
        'peopleAndCulture', 'innovationAndProducts'
      ];
      
      for (const category of mainCategories) {
        result[category] = Math.min(20, Math.max(0, Number(result[category]) || 0));
      }
      
      // Ensure subcategory scores are numbers between 0-5
      if (result.subcategories) {
        for (const key in result.subcategories) {
          result.subcategories[key] = Math.min(5, Math.max(0, Number(result.subcategories[key]) || 0));
        }
      }
      
      // Map the new category names to the old ones for compatibility
      result.interpersonalFit = result.brandPositionAndPerception;
      result.thrivingAtWork = result.growthAndDevelopment;
      result.experienceAndCompetency = result.peopleAndCulture;
      result.recognitionAndCompensation = result.compensationAndBenefits;
      result.purposeAndInvolvement = result.innovationAndProducts;
      
      // Apply the total score limitation
      const limitedResult = limitTotalScore(result);
      
      console.log(`Successfully analyzed ${companyName} with scores:`, {
        brandPositionAndPerception: limitedResult.brandPositionAndPerception,
        compensationAndBenefits: limitedResult.compensationAndBenefits,
        growthAndDevelopment: limitedResult.growthAndDevelopment,
        peopleAndCulture: limitedResult.peopleAndCulture,
        innovationAndProducts: limitedResult.innovationAndProducts
      });
      
      return limitedResult;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('OpenAI response content:', response.choices[0].message.content);
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