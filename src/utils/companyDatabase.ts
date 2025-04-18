import fs from 'fs';
import path from 'path';
import { CompanyData, StoredCompanyData } from '@/types';
import { googleData, walmartData, hubspotData, nasdaqData, lorealData, mastercardData } from './competitorData';

// Path to our "database" file
const DB_PATH = path.join(process.cwd(), 'company-data.json');

// Initialize mock data for competitors
const getMockCompanies = (): Record<string, StoredCompanyData> => {
  return {
    'google': { ...googleData },
    'walmart': { ...walmartData },
    'hubspot': { ...hubspotData },
    'nasdaq': { ...nasdaqData },
    'l\'oreal': { ...lorealData },
    'mastercard': { ...mastercardData },
  };
};

// Initialize the database file if it doesn't exist
const initDatabase = (): void => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Initialize with mock data
      const initialData = getMockCompanies();
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
    } else {
      // Check if the file is empty or invalid JSON
      const content = fs.readFileSync(DB_PATH, 'utf8');
      try {
        const data = JSON.parse(content);
        if (Object.keys(data).length === 0) {
          // If empty, initialize with mock data
          const initialData = getMockCompanies();
          fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
        }
      } catch (e) {
        // If invalid JSON, reinitialize with mock data
        const initialData = getMockCompanies();
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Get all companies from the database
export const getAllCompanies = (): Record<string, StoredCompanyData> => {
  try {
    initDatabase();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading company database:', error);
    return {};
  }
};

// Get a specific company from the database
export const getCompany = (companyName: string): CompanyData | null => {
  try {
    const companies = getAllCompanies();
    const normalizedName = companyName.trim().toLowerCase();
    return companies[normalizedName] || null;
  } catch (error) {
    console.error(`Error getting company ${companyName}:`, error);
    return null;
  }
};

// Save a company to the database
export const saveCompany = (companyName: string, data: CompanyData, email?: string): void => {
  try {
    const companies = getAllCompanies();
    const normalizedName = companyName.trim().toLowerCase();

    // Store the company data with the email
    companies[normalizedName] = {
      ...data,
      email: email || companies[normalizedName]?.email,
    };

    fs.writeFileSync(DB_PATH, JSON.stringify(companies, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error saving company ${companyName}:`, error);
  }
};
