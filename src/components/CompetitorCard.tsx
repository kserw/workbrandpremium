import { useState } from 'react';
import Image from 'next/image';

interface CompetitorCardProps {
  name: string;
  logo: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

export default function CompetitorCard({
  name,
  logo,
  value,
  selected,
  onSelect,
}: CompetitorCardProps) {
  const [imageError, setImageError] = useState(false);

  // Generate a color based on the name for fallback
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const fallbackColor = stringToColor(name);

  return (
    <div
      className={`glass relative flex flex-col items-center p-6 cursor-pointer transition-all duration-300 rounded-xl shadow-sm backdrop-blur-sm ${
        selected
          ? 'bg-white/12 border-2 border-[#FE619E] ring-4 ring-[#FE619E]/20'
          : 'border border-white/10 hover:bg-white/12 hover:border-white/30 hover:shadow-lg hover:scale-105 hover:translate-y-[-4px]'
      }`}
      onClick={() => onSelect(value)}
    >
      <div className="w-20 h-20 relative mb-4 transition-all duration-300">
        {imageError ? (
          // Fallback to a colored div with initial
          <div 
            className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: fallbackColor }}
          >
            {name.charAt(0)}
          </div>
        ) : (
          // Attempt to load the image
          <Image
            src={logo}
            alt={`${name} logo`}
            fill
            style={{ objectFit: 'contain' }}
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <h3 className={`text-lg font-medium transition-colors duration-300 ${selected ? 'text-[#FE619E]' : 'text-white'}`}>{name}</h3>
      
      {selected && (
        <>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-[#FE619E] to-[#FE619E]/80 rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-white"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FE619E]/80 to-[#FE619E] rounded-b-xl"></div>
        </>
      )}
    </div>
  );
} 