// src/components/common/Button.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';

// বাটনের ভেরিয়েন্ট (টাইপ)
export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning'
  | 'dark'
  | 'white';

// বাটনের সাইজ
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// বাটনের স্টেট
export type ButtonState = 'default' | 'loading' | 'disabled';

// Modern Interface (children is automatically extended from React.ButtonHTMLAttributes)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  isLoading?: boolean;
}

// 1. Cleaned up LoadingSpinner component isolated from the main component render loop
const LoadingSpinner = () => (
  <svg 
    className="animate-spin h-4 w-4 shrink-0" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4"
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// 2. Modern Function Component typing without React.FC
export const Button = ({
  variant = 'primary',
  size = 'md',
  state = 'default',
  icon: Icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  className = '',
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps) => {

  // সাইজ অনুযায়ী ক্লাস
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  // ভেরিয়েন্ট অনুযায়ী ক্লাস
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm hover:shadow',
    secondary: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 active:bg-emerald-300',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100',
    ghost: 'text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm hover:shadow',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-gray-950 shadow-sm hover:shadow',
    white: 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 active:bg-emerald-100 shadow-sm',
  };

  // স্টেট অনুযায়ী ক্লাস
  const stateClasses: Record<ButtonState, string> = {
    default: '',
    loading: 'cursor-wait opacity-70 pointer-events-none',
    disabled: 'cursor-not-allowed opacity-50 pointer-events-none',
  };

  // বর্তমান স্টেট ডিটেক্ট
  const isActualLoading = isLoading || state === 'loading';
  const isActualDisabled = disabled || state === 'disabled' || isActualLoading;
  const currentState: ButtonState = isActualLoading ? 'loading' : isActualDisabled ? 'disabled' : 'default';

  // বেইস ক্লাস
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${stateClasses[currentState]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' '); // Cleans up unnecessary spacing breaks

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={isActualDisabled}
      {...props}
    >
      {/* লোডিং স্টেট */}
      {isActualLoading && <LoadingSpinner />}

      {/* আইকন (বামে) */}
      {Icon && iconPosition === 'left' && !isActualLoading && (
        <Icon className="h-4 w-4 shrink-0" />
      )}

      {/* টেক্সট */}
      {children && <span>{children}</span>}

      {/* আইকন (ডানে) */}
      {Icon && iconPosition === 'right' && !isActualLoading && (
        <Icon className="h-4 w-4 shrink-0" />
      )}
    </button>
  );
};

export default Button;
