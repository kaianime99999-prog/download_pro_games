'use client';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  priority = false 
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // تحسين رابط الصورة إذا كان من مصادر معروفة
  const optimizeImageUrl = (url: string) => {
    // إذا كان الرابط من placeholder أو مصادر أخرى، نضيف معاملات التحسين
    if (url.includes('placeholder.com')) {
      return `${url}?auto=compress,format&w=800&q=75`;
    }
    return url;
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">⚠️ خطأ في تحميل الصورة</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <img
        src={optimizeImageUrl(src)}
        alt={alt}
        loading={priority ? 'eager' : loading}
        decoding="async"
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{ contentVisibility: 'auto' }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}