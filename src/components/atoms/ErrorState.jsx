import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from './Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  className = '',
  showIcon = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      {showIcon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
        </motion.div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;