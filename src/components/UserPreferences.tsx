import React, { useState } from 'react';

interface UserPreferencesProps {
  onSave: (preferences: { fiscalYearStart: number }) => void;
  initialPreferences?: {
    fiscalYearStart: number;
  };
}

const months = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export default function UserPreferences({ onSave, initialPreferences }: UserPreferencesProps) {
  const [fiscalYearStart, setFiscalYearStart] = useState(initialPreferences?.fiscalYearStart || 1);

  const handleSave = () => {
    onSave({ fiscalYearStart });
  };

  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-6">User Preferences</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Fiscal Year Start Month
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => setFiscalYearStart(index + 1)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  fiscalYearStart === index + 1
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
          <p className="mt-2 text-white/60 text-sm">
            This setting affects how quarters are calculated in the Content Calendar.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
} 