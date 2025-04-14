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
    let competitor: CompanyData;
    let competitorName: string;

    switch (selectedCompetitor.toLowerCase()) {
      case 'google':
        competitor = googleData;
        competitorName = 'Google';
        break;
      case 'walmart':
        competitor = walmartData;
        competitorName = 'Walmart';
        break;
      case 'hubspot':
        competitor = hubspotData;
        competitorName = 'HubSpot';
        break;
      case 'nasdaq':
        competitor = nasdaqData;
        competitorName = 'Nasdaq';
        break;
      case 'loreal':
      case "l'oreal":
      case 'l oreal':
        competitor = lorealData;
        competitorName = "L'Oreal";
        break;
      case 'mastercard':
        competitor = mastercardData;
        competitorName = 'Mastercard';
        break;
      default:
        // Check if competitor exists in database
        const competitorData = getCompany(selectedCompetitor);
        
        if (competitorData) {
          competitor = competitorData;
          competitorName = selectedCompetitor;
        } else {
          // Use OpenAI to analyze a new competitor
          console.log(`Analyzing new competitor with OpenAI: ${selectedCompetitor}`);
          const analyzedCompetitor = await analyzeCompany(selectedCompetitor);
          
          if (!analyzedCompetitor) {
            return NextResponse.json(
              { error: `We couldn't analyze "${selectedCompetitor}" at this time. Please try again later or choose a different competitor.` },
              { status: 500 }
            );
          }
          
          // Save the competitor data for future use
          saveCompany(selectedCompetitor, analyzedCompetitor);
          competitor = analyzedCompetitor;
          competitorName = selectedCompetitor;
        }
    }

    // Check if the user's company name matches one of our predefined companies
    let userCompanyData: CompanyData | null = null;
    let fromDatabase = false;

    const normalizedCompanyName = companyName.trim().toLowerCase();
    if (normalizedCompanyName === 'google') {
      userCompanyData = { ...googleData };
    } else if (normalizedCompanyName === 'walmart') {
      userCompanyData = { ...walmartData };
    } else if (normalizedCompanyName === 'hubspot') {
      userCompanyData = { ...hubspotData };
    } else if (normalizedCompanyName === 'nasdaq') {
      userCompanyData = { ...nasdaqData };
    } else if (
      normalizedCompanyName === 'loreal' ||
      normalizedCompanyName === "l'oreal" ||
      normalizedCompanyName === 'l oreal'
    ) {
      userCompanyData = { ...lorealData };
    } else if (normalizedCompanyName === 'mastercard') {
      userCompanyData = { ...mastercardData };
    } else if (
      normalizedCompanyName === 'workbrand' ||
      normalizedCompanyName === 'workbrand global'
    ) {
      userCompanyData = { ...mockCompanyData.workbrand };
    } else if (normalizedCompanyName === 'acme' || normalizedCompanyName === 'acme corporation') {
      userCompanyData = { ...mockCompanyData.acme };
    } else if (
      normalizedCompanyName === 'techcorp' ||
      normalizedCompanyName === 'techcorp inc.' ||
      normalizedCompanyName === 'techcorp inc'
    ) {
      userCompanyData = { ...mockCompanyData.techcorp };
    } else {
      // Check if we already have this company in our database
      userCompanyData = getCompany(companyName);

      if (userCompanyData) {
        // If found in database, mark it as from database
        fromDatabase = true;
        console.log(`Found company data in database for: ${companyName}`);
      } else {
        // If not in database, analyze using OpenAI
        console.log(`Analyzing company with OpenAI: ${companyName}`);
        userCompanyData = await analyzeCompany(companyName);
        
        if (!userCompanyData) {
          console.error(`Failed to analyze company: ${companyName}`);
          return NextResponse.json(
            {
              error: `We couldn't find information about "${companyName}". Please enter a valid company name.`,
            },
            { status: 400 }
          );
        }
        
        // Save the new company data to our database for future use
        saveCompany(companyName, userCompanyData, email);
        console.log(`Saved analyzed data for company: ${companyName}`);
      }
    }

    if (!userCompanyData) {
      console.error(`Failed to create data for company: ${companyName}`);
      return NextResponse.json(
        {
          error: `We couldn't find information about "${companyName}". Please enter a valid company name.`,
        },
        { status: 400 }
      );
    }

    // Add a delay of 2 seconds if the data was from the database
    // to show the loading screen for a better user experience
    if (fromDatabase) {
      await delay(2000);
    } else {
      // Add a longer delay for "new" companies to simulate analysis
      await delay(4000);
    }

    console.log(`Successfully processed request for: ${companyName}`);
    return NextResponse.json({
      userCompany: userCompanyData,
      competitor,
      competitorName,
    });
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'An error occurred while analyzing the company. Please try again later.' },
      { status: 500 }
    );
  }
}
