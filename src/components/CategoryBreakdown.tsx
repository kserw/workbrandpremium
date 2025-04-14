import React from 'react';
import { CompanyData, Category, categoryToSubcategories, subcategoryLabels, categoryLabels } from '@/types';

interface CategoryBreakdownProps {
  category: Category;
  userCompany: CompanyData;
  competitor: CompanyData;
  userCompanyName: string;
  competitorName: string;
}

export default function CategoryBreakdown({
  category,
  userCompany,
  competitor,
  userCompanyName,
  competitorName,
}: CategoryBreakdownProps) {
  // Get the subcategories for this category
  const subcategories = categoryToSubcategories[category];

  // Get the colors for each company
  const userCompanyColor = userCompany.primaryColor || '#2F3295';
  const competitorColor = competitor.primaryColor || '#FE619E';

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-white">{categoryLabels[category]} Analysis</h3>
        <p className="mb-6 text-white/80">{userCompany.analysis[category]}</p>

        <div className="grid grid-cols-1 gap-6">
          {subcategories.map(subcategory => (
            <div key={subcategory} className="glass-dark border border-white/10 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-white">{subcategoryLabels[subcategory]}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white/90">
                      {userCompanyName}
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {
                        userCompany.subcategories[
                          subcategory as keyof typeof userCompany.subcategories
                        ]
                      }
                      /5
                    </span>
                  </div>
                  <div className="w-full bg-workbrand-blue/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(userCompany.subcategories[subcategory as keyof typeof userCompany.subcategories] / 5) * 100}%`,
                        backgroundColor: userCompanyColor,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white/90">
                      {competitorName}
                    </span>
                    <span className="text-sm font-medium text-white/90">
                      {
                        competitor.subcategories[
                          subcategory as keyof typeof competitor.subcategories
                        ]
                      }
                      /5
                    </span>
                  </div>
                  <div className="w-full bg-workbrand-blue/20 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(competitor.subcategories[subcategory as keyof typeof competitor.subcategories] / 5) * 100}%`,
                        backgroundColor: competitorColor,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis section removed */}
    </div>
  );
} 