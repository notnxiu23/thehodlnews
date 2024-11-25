import { Bitcoin } from 'lucide-react';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingAnimation({ size = 'md', text }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative animate-float">
        <Bitcoin 
          className={`${sizeClasses[size]} text-orange-500 animate-spin-slow`}
          style={{ '--tw-rotate': '360deg' } as React.CSSProperties}
        />
        <div className="absolute inset-0 animate-pulse-ring">
          <div className="w-full h-full rounded-full border-4 border-orange-500/20" />
        </div>
      </div>
      {text && (
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}