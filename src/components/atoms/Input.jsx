import { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon, 
  iconPosition = 'left',
  className = '',
  ...props 
}, ref) => {
  const hasError = Boolean(error);
  const hasIcon = Boolean(icon);

  const inputClasses = `
    block w-full px-3 py-2 border rounded-lg text-base
    placeholder-gray-400 transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
    ${hasError 
      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500' 
      : 'border-gray-300 text-gray-900'
    }
    ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
    ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {hasIcon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} 
            />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        {hasIcon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon 
              name={icon} 
              className={`w-5 h-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} 
            />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;