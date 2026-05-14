import { ButtonHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', icon: Icon, isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-none',
      secondary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 dark:shadow-none',
      outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200 dark:shadow-none',
      ghost: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : Icon ? (
          <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
