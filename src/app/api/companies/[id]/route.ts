import { NextRequest, NextResponse } from 'next/server';
import { getCompany } from '@/utils/companyDatabase';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const companyId = context.params.id;

    // Handle both ID and name-based lookups
    let companyData;

    // Try to get by exact ID first
    // For demo purposes, we'll map company-1, company-2, etc. to mock data
    if (companyId === 'company-1') {
      companyData = await import('@/utils/competitorData').then(
        module => module.mockCompanyData.workbrand
      );
    } else if (companyId === 'company-2') {
      companyData = await import('@/utils/competitorData').then(
        module => module.mockCompanyData.acme
      );
    } else if (companyId === 'company-3') {
      companyData = await import('@/utils/competitorData').then(
        module => module.mockCompanyData.techcorp
      );
    } else if (companyId === 'mastercard') {
      // For Mastercard, directly import the mastercardData which includes the extendedAnalysis field
      companyData = await import('@/utils/competitorData').then(
        module => {
          console.log('Mastercard data loaded:', Object.keys(module.mastercardData));
          return module.mastercardData;
        }
      );
    } else {
      // Fall back to getting by name
      companyData = getCompany(decodeURIComponent(companyId));
    }

    if (!companyData) {
      console.error(`Company not found: ${companyId}`);
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // Log successful retrieval
    console.log(`Successfully retrieved company data for: ${companyId}`);
    return NextResponse.json(companyData);
  } catch (error) {
    console.error(`Error fetching company ${context.params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch company data' }, { status: 500 });
  }
}
