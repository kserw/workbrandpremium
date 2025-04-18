import { NextRequest, NextResponse } from 'next/server';
import { getAllCompanies, saveCompany } from '@/utils/companyDatabase';
import { CompanyData } from '@/types';

export async function GET() {
  try {
    const companies = getAllCompanies();
    if (!companies || Object.keys(companies).length === 0) {
      console.error('No companies found in database');
      return NextResponse.json({ error: 'No companies available' }, { status: 404 });
    }
    
    // Return just the company names from the stored data
    const companyNames = Object.keys(companies).map(name => 
      // Capitalize first letter of each word
      name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    
    return NextResponse.json(companyNames);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, logoUrl } = body;

    if (!name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    // Create a basic company data structure
    const companyData: CompanyData = {
      name,
      logoUrl: logoUrl || '',
      created: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      // Initialize with empty data structure for analysis
      interpersonalFit: 0,
      thrivingAtWork: 0,
      experienceAndCompetency: 0,
      recognitionAndCompensation: 0,
      purposeAndInvolvement: 0,
      glassdoorScore: 0,
      numEmployees: 0,
      primaryColor: '#000000',
      top3Words: [],
      evpStatement: '',
      subcategories: {
        diversityAndInclusion: 0,
        leadershipEffectiveness: 0,
        employeeAdvocacy: 0,
        workplaceCulture: 0,
        employerValueProposition: 0,
        careerDevelopment: 0,
        innovationAdvancement: 0,
        workLifeBalance: 0,
        employeeExperience: 0,
        competencyUtilization: 0,
        professionalGrowth: 0,
        resourceAccess: 0,
        compensationCompetitiveness: 0,
        talentRetention: 0,
        performanceRecognition: 0,
        compensationTransparency: 0,
        socialResponsibility: 0,
        sustainabilityInitiatives: 0,
        employeeEngagement: 0,
        meaningfulWork: 0,
      },
      analysis: {
        overview: '',
        interpersonalFit: '',
        thrivingAtWork: '',
        experienceAndCompetency: '',
        recognitionAndCompensation: '',
        purposeAndInvolvement: '',
      },
    };

    // Save the company
    saveCompany(name, companyData);

    return NextResponse.json({ message: 'Company added successfully' });
  } catch (error) {
    console.error('Error adding company:', error);
    return NextResponse.json({ error: 'Failed to add company' }, { status: 500 });
  }
}
