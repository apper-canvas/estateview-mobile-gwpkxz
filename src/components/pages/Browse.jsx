import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import PropertyFilters from '@/components/molecules/PropertyFilters';
import PropertyGrid from '@/components/organisms/PropertyGrid';
import PropertyList from '@/components/organisms/PropertyList';
import { propertyService } from '@/services';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'beds-high', label: 'Most Bedrooms' },
    { value: 'sqft-high', label: 'Largest First' }
  ];

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      const hasFilters = Object.keys(filters).length > 0;
      
      if (hasFilters) {
        result = await propertyService.search(filters);
      } else {
        result = await propertyService.getAll();
      }
      
      setProperties(result);
      setFilteredProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
}, [filters]);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  // Apply sorting with useMemo to prevent unnecessary re-renders
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.listingDate) - new Date(a.listingDate);
        case 'oldest':
          return new Date(a.listingDate) - new Date(b.listingDate);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'beds-high':
          return b.bedrooms - a.bedrooms;
        case 'sqft-high':
          return b.squareFeet - a.squareFeet;
        default:
          return 0;
      }
    });
  }, [filteredProperties, sortBy]);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-3">
              <SkeletonLoader count={1} type="list" />
            </div>
            <div className="lg:col-span-9 mt-6 lg:mt-0">
              <SkeletonLoader count={6} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl">
          <ErrorState message={error} onRetry={loadProperties} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-6">
              <PropertyFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 mt-6 lg:mt-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-2">
                  Browse Properties
</h1>
                <p className="text-gray-600">
                  {sortedProperties.length} propert{sortedProperties.length !== 1 ? 'ies' : 'y'} founded
                </p>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ApperIcon name="List" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

{/* Properties Display */}
            <AnimatePresence mode="wait">
              {sortedProperties.length === 0 ? (
                <EmptyState
                  title="No properties found"
                  description="Try adjusting your filters to see more properties."
                  icon="Home"
                />
              ) : (
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
>
                  {viewMode === 'grid' ? (
                    <PropertyGrid properties={sortedProperties} />
                  ) : (
                    <PropertyList properties={sortedProperties} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;