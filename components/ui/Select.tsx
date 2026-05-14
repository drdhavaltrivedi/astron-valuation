import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-xl border appearance-none transition-all duration-200 outline-none
              dark:bg-gray-900 dark:text-white
              ${error 
                ? 'border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/30' 
                : 'border-gray-200 dark:border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20'
              }
              ${className}
            `}
            {...props}
          >
            <option value="" disabled>Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs font-medium text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
