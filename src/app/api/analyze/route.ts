import { NextRequest, NextResponse } from 'next/server';
import {
  googleData,
  walmartData,
  hubspotData,
  nasdaqData,
  lorealData,
  mastercardData,
  mockCompanyData,
} from '@/utils/competitorData';
import { getCompany, saveCompany } from '@/utils/companyDatabase';
import { CompanyData } from '@/types';
import { analyzeCompany } from '@/utils/openai';

// Helper function to add a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to verify data has required fields
const verifyCompanyData = (data: CompanyData | null, name: string): CompanyData | null => {
  if (!data) {
    console.error(`ERROR: ${name} data is null`);
    return null;
  }
  
  const requiredFields = [
    'brandPositionAndPerception', 'compensationAndBenefits', 
    'growthAndDevelopment', 'peopleAndCulture', 'innovationAndProducts',
    'evpStatement', 'glassdoorScore', 'top3Words', 'subcategories', 'analysis'
  ];
  
  const missingFields = requiredFields.filter(field => {
    if (field === 'subcategories' || field === 'analysis') {
      return !data[field as keyof CompanyData];
    }
    return typeof data[field as keyof CompanyData] === 'undefined';
  });
  
  if (missingFields.length > 0) {
    console.warn(`WARNING: ${name} data is missing fields:`, missingFields);
    console.log(`${name} data available fields:`, Object.keys(data));
    
    if (missingFields.includes('subcategories') || missingFields.includes('analysis')) {
      console.error(`ERROR: ${name} data is missing critical fields`);
      return null;
    }
  }
  
  return data;
};

// Log environment check
console.log('API Key available:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

export async function POST(request: NextRequest) {
  try {
    const { companyName, selectedCompetitor, email } = await request.json();

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    if (!selectedCompetitor) {
      return NextResponse.json({ error: 'Competitor selection is required' }, { status: 400 });
    }

    // Log that we're processing a request
    console.log(
      `Processing request for company: ${companyName}, competitor: ${selectedCompetitor}`
    );

    // Get the selected competitor data
    let competitor: CompanyData | null = null;
    let competitorName: string = selectedCompetitor;

    // Normalize competitor name
    const normalizedCompetitor = selectedCompetitor.toLowerCase().trim();

    // Get competitor data
    switch (normalizedCompetitor) {
      case 'google':
        competitor = { ...googleData };
        competitorName = 'Google';
        break;
      case 'walmart':
        competitor = { ...walmartData };
        competitorName = 'Walmart';
        break;
      case 'hubspot':
        competitor = { ...hubspotData };
        competitorName = 'HubSpot';
        break;
      case 'nasdaq':
        competitor = { ...nasdaqData };
        competitorName = 'Nasdaq';
        break;
      case 'loreal':
      case "l'oreal":
      case 'l oreal':
        competitor = { ...lorealData };
        competitorName = "L'Oreal";
        break;
      case 'mastercard':
        competitor = { ...mastercardData };
        competitorName = 'Mastercard';
        break;
      default:
        // Check database or analyze new competitor
        competitor = getCompany(selectedCompetitor);
        if (!competitor) {
          console.log(`Analyzing new competitor: ${selectedCompetitor}`);
          competitor = await analyzeCompany(selectedCompetitor);
          if (competitor) {
            saveCompany(selectedCompetitor, competitor);
          }
        }
    }

    // Verify competitor data
    competitor = verifyCompanyData(competitor, competitorName);
    if (!competitor) {
      return NextResponse.json(
        { error: `We couldn't analyze "${competitorName}". Please try a different competitor.` },
        { status: 500 }
      );
    }

    // Get user company data
    let userCompanyData: CompanyData | null = null;
    let fromDatabase = false;

    // Normalize company name
    const normalizedCompanyName = companyName.toLowerCase().trim();

    // Check for predefined companies
    switch (normalizedCompanyName) {
      case 'google':
        userCompanyData = { ...googleData };
        break;
      case 'walmart':
        userCompanyData = { ...walmartData };
        break;
      case 'hubspot':
        userCompanyData = { ...hubspotData };
        break;
      case 'nasdaq':
        userCompanyData = { ...nasdaqData };
        break;
      case 'loreal':
      case "l'oreal":
      case 'l oreal':
        userCompanyData = { ...lorealData };
        break;
      case 'mastercard':
        userCompanyData = { ...mastercardData };
        break;
      case 'workbrand':
      case 'workbrand global':
        userCompanyData = { ...mockCompanyData.workbrand };
        break;
      case 'acme':
      case 'acme corp':
        userCompanyData = { ...mockCompanyData.acme };
        break;
      case 'techcorp':
      case 'techcorp inc.':
      case 'techcorp inc':
        userCompanyData = { ...mockCompanyData.techcorp };
        break;
      default:
        // Check database or analyze new company
        userCompanyData = getCompany(companyName);
        if (userCompanyData) {
          fromDatabase = true;
        } else {
          console.log(`Analyzing company: ${companyName}`);
          userCompanyData = await analyzeCompany(companyName);
          if (userCompanyData) {
            saveCompany(companyName, userCompanyData, email);
          }
        }
    }

    // Verify user company data
    userCompanyData = verifyCompanyData(userCompanyData, companyName);
    if (!userCompanyData) {
      return NextResponse.json(
        { error: `We couldn't analyze "${companyName}". Please try again.` },
        { status: 500 }
      );
    }

    // Add a delay for better UX
    await delay(fromDatabase ? 2000 : 4000);

    console.log(`Successfully processed request for: ${companyName}`);
    return NextResponse.json({
      userCompany: userCompanyData,
      competitor,
      competitorName
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'An error occurred while analyzing the company. Please try again later.' },
      { status: 500 }
    );
  }
}
