import React, { ReactElement } from 'react';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactElement<IconProps>;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: string;
  onClick?: () => void;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  color = '#2F3295',
  onClick 
}: StatCardProps) {
  return (
    <div 
      className={`modern-card cursor-pointer transition-all hover:translate-y-[-5px]`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
            <p className="text-white text-2xl font-bold">{value}</p>
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}30` }}>
            {React.cloneElement(icon, { className: "h-6 w-6", style: { color } })}
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center">
            <span 
              className={`text-xs font-medium rounded-full px-2 py-1 flex items-center ${
                trend.isPositive 
                  ? 'bg-green-500/20 text-green-500' 
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {trend.isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {trend.value}%
            </span>
            <span className="text-white/50 text-xs ml-2">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
} 