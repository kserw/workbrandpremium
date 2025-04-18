import { NextRequest, NextResponse } from 'next/server';
import { CompanyData } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = await Promise.resolve(params.id);
    let companyData: CompanyData | null = null;

    if (companyId === 'company-1') {
      companyData = await import('@/utils/competitorData').then(
        module => module.mockCompanyData.workbrand
      );
    } else {
      // For other companies, use the predefined data
      const { googleData, walmartData, hubspotData, nasdaqData, lorealData, mastercardData } = await import('@/utils/competitorData');
      
      switch (companyId) {
        case 'google':
          companyData = googleData;
          break;
        case 'walmart':
          companyData = walmartData;
          break;
        case 'hubspot':
          companyData = hubspotData;
          break;
        case 'nasdaq':
          companyData = nasdaqData;
          break;
        case 'loreal':
        case "l'oreal":
        case 'l oreal':
          companyData = lorealData;
          break;
        case 'mastercard':
          companyData = mastercardData;
          break;
        default:
          return NextResponse.json(
            { error: 'Company not found' },
            { status: 404 }
          );
      }
    }

    if (!companyData) {
      return NextResponse.json(
        { error: 'Company data not found' },
        { status: 404 }
      );
    }

    console.log(`${companyId} data loaded:`, Object.keys(companyData));
    console.log(`Successfully retrieved company data for: ${companyId}`);

    return NextResponse.json(companyData);
  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}
