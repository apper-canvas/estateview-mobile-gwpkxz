import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-md hover:shadow-lg',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-gray-300',
    ghost: 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50 shadow-md hover:shadow-lg'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const widthStyles = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${disabledStyles}
    ${widthStyles}
    ${className}
  `.trim();

  const content = (
    <>
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </>
  );

  if (disabled || loading) {
    return (
      <button className={buttonClasses} disabled {...props}>
        {content}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={buttonClasses}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;