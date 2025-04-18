import React, { useState } from 'react';
import { format, addMonths, startOfQuarter, endOfQuarter, eachMonthOfInterval } from 'date-fns';

interface ContentItem {
  id: string;
  date: Date;
  platform: 'LinkedIn' | 'Instagram' | 'Twitter' | 'Facebook';
  content: string;
  title: string;
  caption: string;
  imageUrl?: string;
}

interface ContentCalendarProps {
  fiscalYearStart: number;
  view: 'calendar' | 'add-content';
  setView: (view: 'calendar' | 'add-content') => void;
  selectedQuarter: number | null;
  setSelectedQuarter: (quarter: number | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  contentItems: any[];
  setContentItems: (items: any[]) => void;
  newContent: {
    platform: string;
    content: string;
    title: string;
    caption: string;
    imageUrl: string;
  };
  setNewContent: (content: {
    platform: string;
    content: string;
    title: string;
    caption: string;
    imageUrl: string;
  }) => void;
}

const socialPlatforms = [
  { id: 'LinkedIn', name: 'LinkedIn', color: '#0077B5' },
  { id: 'Instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'Twitter', name: 'Twitter', color: '#1DA1F2' },
  { id: 'Facebook', name: 'Facebook', color: '#1877F2' },
];

export default function ContentCalendar({
  fiscalYearStart,
  view,
  setView,
  selectedQuarter,
  setSelectedQuarter,
  selectedDate,
  setSelectedDate,
  contentItems,
  setContentItems,
  newContent,
  setNewContent,
}: ContentCalendarProps) {
  const [currentDate] = useState(new Date());

  // Calculate fiscal year quarters based on fiscal year start month
  const getFiscalQuarters = () => {
    const quarters = [];
    let startDate = new Date(currentDate.getFullYear(), fiscalYearStart - 1, 1);
    
    // If current date is before fiscal year start, adjust start date to previous year
    if (currentDate < startDate) {
      startDate = new Date(currentDate.getFullYear() - 1, fiscalYearStart - 1, 1);
    }
    
    // Generate 6 quarters
    for (let i = 0; i < 6; i++) {
      const quarterStart = addMonths(startDate, i * 3);
      quarters.push({
        start: startOfQuarter(quarterStart),
        end: endOfQuarter(quarterStart),
        label: `Q${Math.floor(i % 4) + 1} ${format(quarterStart, 'yyyy')}`,
      });
    }
    
    return quarters;
  };

  const quarters = getFiscalQuarters();

  const getMonthsInQuarter = (quarterIndex: number) => {
    const quarter = quarters[quarterIndex];
    if (!quarter) return [];
    
    return eachMonthOfInterval({
      start: quarter.start,
      end: quarter.end,
    });
  };

  if (view === 'add-content') {
    return (
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Content</h2>
          <button
            onClick={() => setView('calendar')}
            className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            Back to Calendar
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">Platform</label>
            <select
              value={newContent.platform}
              onChange={(e) => setNewContent({ ...newContent, platform: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
            >
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Title</label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Caption</label>
            <input
              type="text"
              value={newContent.caption}
              onChange={(e) => setNewContent({ ...newContent, caption: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              placeholder="Enter post caption"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Content</label>
            <textarea
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white h-32"
              placeholder="Enter post content"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Image URL</label>
            <input
              type="text"
              value={newContent.imageUrl}
              onChange={(e) => setNewContent({ ...newContent, imageUrl: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
              placeholder="Enter image URL"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setView('calendar')}
              className="px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedDate) {
                  setContentItems([
                    ...contentItems,
                    {
                      ...newContent,
                      date: selectedDate,
                    },
                  ]);
                  setView('calendar');
                }
              }}
              className="px-6 py-2 rounded-lg bg-[#5B60D6] text-white hover:bg-[#4347B5] transition-all"
            >
              Save Content
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-white mb-6">Content Calendar</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quarters.map((quarter, index) => (
          <div
            key={quarter.label}
            className={`glass p-6 rounded-xl border cursor-pointer transition-all ${
              selectedQuarter === index
                ? 'border-[#5B60D6]'
                : 'border-white/10 hover:border-white/30'
            }`}
            onClick={() => setSelectedQuarter(selectedQuarter === index ? null : index)}
          >
            <h3 className="text-lg font-semibold text-white mb-2">{quarter.label}</h3>
            <p className="text-white/70">
              {format(quarter.start, 'MMM d, yyyy')} - {format(quarter.end, 'MMM d, yyyy')}
            </p>
          </div>
        ))}
      </div>

      {selectedQuarter !== null && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            {quarters[selectedQuarter].label} Content
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getMonthsInQuarter(selectedQuarter).map((month) => (
              <div key={format(month, 'yyyy-MM')} className="glass p-4 rounded-xl border border-white/10">
                <h4 className="text-white font-medium mb-3">{format(month, 'MMMM yyyy')}</h4>
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center text-white/50 text-sm py-1">
                      {day}
                    </div>
                  ))}
                  {/* Calendar grid would go here */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 