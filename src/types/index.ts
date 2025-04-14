export interface CompanyAnalysis {
  overview: string;
  interpersonalFit: string;
  thrivingAtWork: string;
  experienceAndCompetency: string;
  recognitionAndCompensation: string;
  purposeAndInvolvement: string;
}

export interface SubcategoryScores {
  // Interpersonal Fit subcategories
  diversityAndInclusion: number; // 0-5 points
  leadershipEffectiveness: number; // 0-5 points
  employeeAdvocacy: number; // 0-5 points
  workplaceCulture: number; // 0-5 points

  // Thriving at Work subcategories
  employerValueProposition: number; // 0-5 points
  careerDevelopment: number; // 0-5 points
  innovationAdvancement: number; // 0-5 points
  workLifeBalance: number; // 0-5 points

  // Experience and Competency subcategories
  employeeExperience: number; // 0-5 points
  competencyUtilization: number; // 0-5 points
  professionalGrowth: number; // 0-5 points
  resourceAccess: number; // 0-5 points

  // Recognition and Compensation subcategories
  compensationCompetitiveness: number; // 0-5 points
  talentRetention: number; // 0-5 points
  performanceRecognition: number; // 0-5 points
  compensationTransparency: number; // 0-5 points

  // Purpose and Involvement subcategories
  socialResponsibility: number; // 0-5 points
  sustainabilityInitiatives: number; // 0-5 points
  employeeEngagement: number; // 0-5 points
  meaningfulWork: number; // 0-5 points
}

export interface ExtendedAnalysisData {
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
    topEngagementTopics: string[];
    platforms: string[];
    brandedHashtags: string[];
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

export interface CompanyData {
  interpersonalFit: number;
  thrivingAtWork: number;
  experienceAndCompetency: number;
  recognitionAndCompensation: number;
  purposeAndInvolvement: number;
  glassdoorScore: number;
  numEmployees: number;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  top3Words: string[];
  evpStatement: string;
  analysis: CompanyAnalysis;
  subcategories: SubcategoryScores;
  extendedAnalysis?: ExtendedAnalysisData;
}

export interface FormData {
  companyName: string;
  email: string;
  selectedCompetitor: 'google' | 'walmart' | 'hubspot' | 'nasdaq' | 'loreal' | 'mastercard' | null;
}

export interface StoredCompanyData extends CompanyData {
  email?: string;
}

export type Category =
  | 'interpersonalFit'
  | 'thrivingAtWork'
  | 'experienceAndCompetency'
  | 'recognitionAndCompensation'
  | 'purposeAndInvolvement';

export const categoryLabels: Record<Category, string> = {
  interpersonalFit: 'Interpersonal Fit',
  thrivingAtWork: 'Thriving at Work',
  experienceAndCompetency: 'Experience & Competency',
  recognitionAndCompensation: 'Recognition & Compensation',
  purposeAndInvolvement: 'Purpose & Involvement',
};

// Mapping of categories to their subcategories
export const subcategoryLabels: Record<string, string> = {
  // Interpersonal Fit subcategories
  diversityAndInclusion: 'Diversity, Equity, Inclusion, and Belonging',
  leadershipEffectiveness: 'Leadership Effectiveness and Alignment',
  employeeAdvocacy: 'Employee Advocacy and Brand Ambassadorship',
  workplaceCulture: 'Workplace Culture and Relationships',

  // Thriving at Work subcategories
  employerValueProposition: 'Employer Value Proposition Strength',
  careerDevelopment: 'Career Development and Learning Opportunities',
  innovationAdvancement: 'Innovation and Technological Advancement',
  workLifeBalance: 'Work-life Balance and Flexibility',

  // Experience and Competency subcategories
  employeeExperience: 'Employee Experience Consistency',
  competencyUtilization: 'Feeling of Competency and Skill Utilization',
  professionalGrowth: 'Professional Growth and Advancement Opportunities',
  resourceAccess: 'Access to Necessary Resources and Tools',

  // Recognition and Compensation subcategories
  compensationCompetitiveness: 'Compensation and Benefits Competitiveness',
  talentRetention: 'Talent Attraction and Retention Rates',
  performanceRecognition: 'Performance Recognition and Appreciation',
  compensationTransparency: 'Transparency in Compensation Structure',

  // Purpose and Involvement subcategories
  socialResponsibility: 'Social Responsibility and Community Impact',
  sustainabilityInitiatives: 'Corporate Sustainability Initiatives',
  employeeEngagement: 'Employee Engagement in Company Goals',
  meaningfulWork: 'Opportunities for Meaningful Work',
};

// Mapping of categories to their subcategory keys
export const categoryToSubcategories: Record<Category, string[]> = {
  interpersonalFit: [
    'diversityAndInclusion',
    'leadershipEffectiveness',
    'employeeAdvocacy',
    'workplaceCulture',
  ],
  thrivingAtWork: [
    'employerValueProposition',
    'careerDevelopment',
    'innovationAdvancement',
    'workLifeBalance',
  ],
  experienceAndCompetency: [
    'employeeExperience',
    'competencyUtilization',
    'professionalGrowth',
    'resourceAccess',
  ],
  recognitionAndCompensation: [
    'compensationCompetitiveness',
    'talentRetention',
    'performanceRecognition',
    'compensationTransparency',
  ],
  purposeAndInvolvement: [
    'socialResponsibility',
    'sustainabilityInitiatives',
    'employeeEngagement',
    'meaningfulWork',
  ],
};

export interface ComparisonResult {
  userCompany: CompanyData;
  competitor: CompanyData;
  competitorName: string;
}
