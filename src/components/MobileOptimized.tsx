
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileCard = ({ children, className }: MobileOptimizedProps) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm border",
      "p-4 sm:p-6", // Smaller padding on mobile
      "space-y-3 sm:space-y-4", // Tighter spacing on mobile
      className
    )}>
      {children}
    </div>
  );
};

export const MobileGrid = ({ children, className }: MobileOptimizedProps) => {
  return (
    <div className={cn(
      "grid gap-4",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", // Responsive grid
      className
    )}>
      {children}
    </div>
  );
};

export const MobileStack = ({ children, className }: MobileOptimizedProps) => {
  return (
    <div className={cn(
      "flex flex-col space-y-4",
      "sm:flex-row sm:space-y-0 sm:space-x-4", // Stack on mobile, row on desktop
      className
    )}>
      {children}
    </div>
  );
};

export const MobileText = ({ children, className }: MobileOptimizedProps) => {
  return (
    <div className={cn(
      "text-sm sm:text-base", // Smaller text on mobile
      className
    )}>
      {children}
    </div>
  );
};

export const MobileButton = ({ children, className, ...props }: MobileOptimizedProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button 
      className={cn(
        "w-full sm:w-auto", // Full width on mobile
        "px-3 py-2 sm:px-4 sm:py-2", // Smaller padding on mobile
        "text-sm sm:text-base", // Smaller text on mobile
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
