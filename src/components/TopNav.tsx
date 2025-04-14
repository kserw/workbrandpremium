import { useEffect, useState } from 'react';

interface TopNavProps {
  title: string;
  subtitle?: string;
  showMobileMenu: boolean;
  toggleMobileMenu: () => void;
}

export default function TopNav({ title, subtitle, showMobileMenu, toggleMobileMenu }: TopNavProps) {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 glass-dark backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center">
        {/* Mobile menu toggle */}
        <button 
          className="lg:hidden mr-4 text-white/80 hover:text-white"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
        </div>
      </div>
      
      {/* Clock/Date on the right side */}
      <div className="flex items-center">
        <div className="text-right hidden sm:block">
          <p className="text-white/70 text-sm">{formattedDate}</p>
          <p className="text-white font-medium">{formattedTime}</p>
        </div>
        <div className="ml-4 p-2 bg-white/10 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/70" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
      </div>
    </div>
  );
} 