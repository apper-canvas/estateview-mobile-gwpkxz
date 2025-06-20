import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from 'react-use';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const PropertyFilters = ({ onFiltersChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    bedroomsMin: '',
    bathroomsMin: '',
    squareFeetMin: '',
    propertyTypes: [],
    searchLocation: ''
  });

  const propertyTypes = [
    'Single Family Home',
    'Condo',
    'Townhouse',
    'Multi-Family',
    'Land'
];

  const { width } = useWindowSize();

  const applyFilters = useCallback(() => {
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => {
if (Array.isArray(value)) return value.length > 0;
        return value !== '' && value !== null && value !== undefined;
      })
    );
    
    // Convert string numbers to integers
    ['priceMin', 'priceMax', 'bedroomsMin', 'bathroomsMin', 'squareFeetMin'].forEach(key => {
      if (cleanFilters[key]) {
        cleanFilters[key] = parseInt(cleanFilters[key], 10);
      }
    });

    onFiltersChange(cleanFilters);
  }, [filters, onFiltersChange]);

  useEffect(() => {
    // Debounced filter application
    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePropertyTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      bedroomsMin: '',
      bathroomsMin: '',
      squareFeetMin: '',
      propertyTypes: [],
      searchLocation: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== '';
  });

  return (
    <div className={className}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          icon="Filter"
          className="w-full justify-center"
        >
          Filters {hasActiveFilters && `(${Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== '').length})`}
        </Button>
      </div>

{/* Filter Panel */}
      <AnimatePresence mode="wait">
        {(isOpen || width >= 1024) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-white rounded-12 shadow-md p-6 space-y-6"
            style={{ willChange: 'height' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-secondary hover:text-secondary/80"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                placeholder="City, neighborhood, or address"
                value={filters.searchLocation}
                onChange={(e) => handleFilterChange('searchLocation', e.target.value)}
                icon="MapPin"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Min price"
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  icon="DollarSign"
                />
                <Input
                  placeholder="Max price"
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  icon="DollarSign"
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Bedrooms
                </label>
                <select
                  value={filters.bedroomsMin}
                  onChange={(e) => handleFilterChange('bedroomsMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Bathrooms
                </label>
                <select
                  value={filters.bathroomsMin}
                  onChange={(e) => handleFilterChange('bathroomsMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Square Footage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Square Feet
              </label>
              <Input
                placeholder="Min sq ft"
                type="number"
                value={filters.squareFeetMin}
                onChange={(e) => handleFilterChange('squareFeetMin', e.target.value)}
                icon="Square"
              />
            </div>

            {/* Property Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Property Type
              </label>
              <div className="space-y-2">
                {propertyTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.propertyTypes.includes(type)}
                      onChange={() => handlePropertyTypeToggle(type)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Mobile Close Button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsOpen(false)}
                variant="primary"
                fullWidth
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyFilters;