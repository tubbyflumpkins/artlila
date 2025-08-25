'use client';

import React from 'react';
import Image from 'next/image';
import { CustomSlideProps } from '@/lib/presentations/types';

interface FourImageGridProps extends CustomSlideProps {
  images: string[];
}

const FourImageGrid: React.FC<FourImageGridProps> = ({ images }) => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="grid grid-cols-2 gap-4 max-w-6xl w-full">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={image}
              alt={`Jackson Pollock painting ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FourImageGrid;