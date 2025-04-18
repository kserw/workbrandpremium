import React, { useState } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachMonthOfInterval, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

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
  fiscalYearStart?: number; // 1-12, default to 1 (January)
  view: 'calendar' | 'add-content';
  setView: (v: 'calendar' | 'add-content') => void;
  selectedQuarter: Date | null;
  setSelectedQuarter: (d: Date | null) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  contentItems: ContentItem[];
  setContentItems: (items: ContentItem[]) => void;
  newContent: any;
  setNewContent: (c: any) => void;
}

const socialPlatforms = [
  { id: 'LinkedIn', name: 'LinkedIn', color: '#0077B5' },
  { id: 'Instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'Twitter', name: 'Twitter', color: '#1DA1F2' },
  { id: 'Facebook', name: 'Facebook', color: '#1877F2' },
];

export default function ContentCalendar({ fiscalYearStart = 1, view, setView, selectedQuarter, setSelectedQuarter, selectedDate, setSelectedDate, contentItems, setContentItems, newContent, setNewContent }: ContentCalendarProps) {
  // Get unassigned posts (posts without a date)
  const unassignedPosts = contentItems.filter(item => !item.date);

  // Helper function to get the start of the fiscal year
  const getFiscalYearStart = (date: Date): Date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // If current month is before fiscal year start, use previous year
    if (month < fiscalYearStart) {
      return new Date(year - 1, fiscalYearStart - 1, 1);
    }
    return new Date(year, fiscalYearStart - 1, 1);
  };

  // Helper function to get quarter number and year based on fiscal year
  const getFiscalQuarter = (date: Date): { quarter: number; year: number } => {
    const fiscalYearStartDate = getFiscalYearStart(date);
    const monthDiff = (date.getFullYear() - fiscalYearStartDate.getFullYear()) * 12 + 
                     date.getMonth() - fiscalYearStartDate.getMonth();
    const quarter = Math.floor(monthDiff / 3) + 1;
    const year = fiscalYearStartDate.getFullYear() + Math.floor((quarter - 1) / 4);
    return { quarter: ((quarter - 1) % 4) + 1, year };
  };

  // Generate quarters starting from current quarter
  const quarters = Array.from({ length: 6 }, (_, i) => {
    const now = new Date();
    const startDate = getFiscalYearStart(now);
    const currentQuarterStart = new Date(startDate);
    const monthsToAdd = Math.floor((now.getMonth() - startDate.getMonth() + 12) % 12 / 3) * 3;
    currentQuarterStart.setMonth(startDate.getMonth() + monthsToAdd);
    
    const date = addMonths(currentQuarterStart, i * 3);
    const { quarter, year } = getFiscalQuarter(date);
    
    return {
      date,
      label: `Q${quarter} ${year}`,
    };
  });

  // Get months for selected quarter
  const quarterMonths = selectedQuarter
    ? eachMonthOfInterval({
        start: selectedQuarter,
        end: addMonths(selectedQuarter, 2),
      })
    : [];

  // Add a function to create unassigned content
  const handleAddUnassignedContent = () => {
    setSelectedDate(null);
    setView('add-content');
    setNewContent({
      platform: 'LinkedIn',
      content: '',
      title: '',
      caption: '',
      imageUrl: '',
    });
  };

  const handleSaveContent = () => {
    if (newContent.content.trim() && newContent.title.trim()) {
      const newItem: ContentItem = {
        id: Math.random().toString(36).substr(2, 9),
        date: selectedDate || null,
        platform: newContent.platform,
        content: newContent.content.trim(),
        title: newContent.title.trim(),
        caption: newContent.caption.trim(),
        imageUrl: newContent.imageUrl,
      };
      setContentItems([...contentItems, newItem]);
      setView('calendar');
      setSelectedDate(null);
      setNewContent({
        platform: 'LinkedIn',
        content: '',
        title: '',
        caption: '',
        imageUrl: '',
      });
    }
  };

  const getContentForDate = (date: Date) => {
    return contentItems.filter((item) => isSameDay(item.date, date));
  };

  const handleAddContent = (date: Date) => {
    setSelectedDate(date);
    setView('add-content');
    setNewContent({
      platform: 'LinkedIn',
      content: '',
      title: '',
      caption: '',
      imageUrl: '',
    });
  };

  if (view === 'add-content') {
    return (
      <div className="space-y-6 animate-fade-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">
            Add Content for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Unassigned Post'}
          </h3>
          <button
            onClick={() => setView('calendar')}
            className="text-white hover:text-white/90 transition-all duration-200 ease-in-out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="glass p-6 rounded-xl space-y-6 transition-all duration-300 ease-in-out">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setNewContent({ ...newContent, platform: platform.id as ContentItem['platform'] })}
                  className={`p-3 rounded-lg text-white text-sm transition-all ${
                    newContent.platform === platform.id
                      ? 'bg-[#5B60D6]'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Post Title
            </label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
              className="w-full bg-white/5 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#5B60D6]"
              placeholder="Enter post title..."
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Caption
            </label>
            <input
              type="text"
              value={newContent.caption}
              onChange={(e) => setNewContent({ ...newContent, caption: e.target.value })}
              className="w-full bg-white/5 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#5B60D6]"
              placeholder="Enter caption..."
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Content
            </label>
            <textarea
              value={newContent.content}
              onChange={(e) => setNewContent({ ...newContent, content: e.target.value })}
              className="w-full h-32 bg-white/5 rounded-lg p-3 text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#5B60D6]"
              placeholder="Enter your content here..."
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Image
            </label>
            <button
              onClick={() => document.getElementById('content-image-upload')?.click()}
              className="w-full p-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {newContent.imageUrl ? 'Change Image' : 'Upload Image'}
            </button>
            <input
              id="content-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewContent({ ...newContent, imageUrl: URL.createObjectURL(file) });
                }
              }}
            />
            {newContent.imageUrl && (
              <p className="text-white/70 text-sm mt-2">Image selected</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setView('calendar')}
              className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContent}
              className="px-4 py-2 rounded-lg bg-[#5B60D6] text-white hover:bg-[#4347B5] transition-all"
              disabled={!newContent.content.trim() || !newContent.title.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'calendar') {
    return (
      <div className="space-y-6">
        {/* Quarter Selection - only show if no quarter is selected */}
        <div className={`transform transition-all duration-500 ease-in-out ${!selectedQuarter ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'}`}>
          <div className="glass p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Content Calendar</h3>
            <div className="grid grid-cols-3 gap-4">
              {quarters.map(({ date, label }) => (
                <button
                  key={label}
                  onClick={() => setSelectedQuarter(date)}
                  className="p-4 rounded-lg transition-all duration-300 ease-in-out bg-white/5 text-white hover:bg-white/10"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Month View */}
        <div className={`transform transition-all duration-500 ease-in-out ${selectedQuarter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {selectedQuarter && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Content Calendar</h3>
                <button
                  onClick={() => setSelectedQuarter(null)}
                  className="text-white hover:text-white/90 transition-all duration-200 ease-in-out flex items-center space-x-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="text-white">Change Quarter</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quarterMonths.map((month, index) => {
                  const monthStart = startOfMonth(month);
                  const monthEnd = endOfMonth(month);
                  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
                  const startingDayIndex = monthStart.getDay();
                  
                  return (
                    <div 
                      key={format(month, 'MM-yyyy')} 
                      className="glass p-6 rounded-lg"
                    >
                      <h4 className="text-lg font-medium text-white mb-4">
                        {format(month, 'MMMM yyyy')}
                      </h4>
                      <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                          <div key={day} className="text-white/60 text-center text-sm py-2">
                            {day}
                          </div>
                        ))}
                        
                        {/* Empty cells before first day */}
                        {Array.from({ length: startingDayIndex }).map((_, index) => (
                          <div key={`empty-${index}`} className="aspect-square" />
                        ))}
                        
                        {/* Calendar days */}
                        {days.map((day) => {
                          const dayContent = getContentForDate(day);
                          return (
                            <button
                              key={format(day, 'yyyy-MM-dd')}
                              onClick={() => {
                                setSelectedDate(day);
                                setView('add-content');
                              }}
                              className={`aspect-square p-1 rounded-lg text-sm relative group transition-all duration-200
                                ${isSameMonth(day, month) ? 'hover:bg-white/10' : 'opacity-50'}
                              `}
                            >
                              <div className="absolute top-1 right-1 text-white/80">
                                {format(day, 'd')}
                              </div>
                              {dayContent.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="absolute bottom-1 left-1 right-1 h-1 rounded-full"
                                  style={{
                                    backgroundColor: socialPlatforms.find(p => p.id === item.platform)?.color,
                                    bottom: `${(index + 1) * 4}px`
                                  }}
                                />
                              ))}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Unassigned Posts Section */}
        <div className={`glass p-6 rounded-lg transition-all duration-500 ease-in-out transform ${view === 'calendar' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Unassigned Posts</h3>
            <button
              onClick={handleAddUnassignedContent}
              className="px-4 py-2 rounded-lg bg-[#5B60D6] hover:bg-[#4347B5] transition-all duration-200 ease-in-out flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-white font-medium">Add Post</span>
            </button>
          </div>

          {unassignedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ease-in-out">
              {unassignedPosts.map((post) => (
                <div key={post.id} className="bg-white/5 rounded-lg p-4 space-y-3 transition-all duration-200 ease-in-out hover:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">{post.platform}</span>
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: socialPlatforms.find(p => p.id === post.platform)?.color }}
                    />
                  </div>
                  <h4 className="text-white font-medium">{post.title}</h4>
                  <p className="text-white/70 text-sm line-clamp-2">{post.content}</p>
                  {post.imageUrl && (
                    <div className="text-white/50 text-sm">Contains image</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50 transition-opacity duration-200 ease-in-out">
              No unassigned posts yet
            </div>
          )}
        </div>
      </div>
    );
  }
} 