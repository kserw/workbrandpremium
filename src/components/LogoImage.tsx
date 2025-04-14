import React from 'react';
import Image from 'next/image';

// Component that loads the actual workbrandlogo.png file
export default function LogoImage() {
  return (
    <div className="relative w-full h-full">
      <Image
        src="/images/workbrandlogo.png"
        alt="Workbrand Logo"
        fill
        priority
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
} 