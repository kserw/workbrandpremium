import { NextRequest, NextResponse } from 'next/server';
import { getAllCompanies, saveCompany } from '@/utils/companyDatabase';
import { CompanyData } from '@/types';

export async function GET() {
  try {
    const companies = getAllCompanies();
    // Return just the company names from the stored data
    return NextResponse.json(Object.keys(companies));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const companyData: CompanyData = {
      interpersonalFit: 0,
      thrivingAtWork: 0,
      experienceAndCompetency: 0,
      recognitionAndCompensation: 0,
      purposeAndInvolvement: 0,
      glassdoorScore: 0,
      numEmployees: 0,
      top3Words: ['New', 'Company', 'Profile'],
      evpStatement: 'New company profile - EVP statement pending',
      analysis: {
        overview: '',
        interpersonalFit: '',
        thrivingAtWork: '',
        experienceAndCompetency: '',
        recognitionAndCompensation: '',
        purposeAndInvolvement: ''
      },
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
        meaningfulWork: 0
      }
    };

    // Save the company to our database
    saveCompany(name, companyData);

    return NextResponse.json({
      success: true,
      message: `Company ${name} added successfully`
    });
  } catch (error) {
    console.error('Error adding company:', error);
    return NextResponse.json({ error: 'Failed to add company' }, { status: 500 });
  }
}
