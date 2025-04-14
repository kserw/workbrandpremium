import { NextResponse } from 'next/server';
import { getAllCompanies, saveCompany } from '@/utils/companyDatabase';

export async function GET() {
  try {
    const companies = getAllCompanies();
    const companyNames = Object.keys(companies).map(key => {
      // Convert from normalized key to original format (capitalize first letter of each word)
      return key
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });

    return NextResponse.json({ companies: companyNames });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, logoUrl } = await request.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Create a basic company data structure
    const timestamp = new Date().toISOString();
    const companyData = {
      name,
      logoUrl: logoUrl || '',
      created: timestamp,
      lastAccessed: timestamp,
      lastUpdated: timestamp,
      // Initialize with empty data structure that will be filled when analysis is performed
      data: {
        overall: { score: 0, grade: 'N/A' },
        categories: {},
      }
    };

    // Save the company to our database
    saveCompany(name, companyData);

    return NextResponse.json({
      success: true,
      message: 'Company added successfully',
      company: { name, logoUrl }
    });
  } catch (error) {
    console.error('Error adding company:', error);
    return NextResponse.json(
      { error: 'Failed to add company' },
      { status: 500 }
    );
  }
}
