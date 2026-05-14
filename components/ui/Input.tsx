import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-xl border transition-all duration-200 outline-none
            dark:bg-gray-900 dark:text-white
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30' 
              : 'border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20'
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-gray-500 ml-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
