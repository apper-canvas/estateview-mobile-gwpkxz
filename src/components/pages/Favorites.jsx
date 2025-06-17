import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import PropertyCard from '@/components/molecules/PropertyCard';
import { propertyService, favoriteService, useFavorites } from '@/services';

const Favorites = () => {
  const { favorites } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [noteStates, setNoteStates] = useState({});

  const sortOptions = [
    { value: 'newest', label: 'Recently Saved' },
    { value: 'oldest', label: 'Oldest Saved' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  useEffect(() => {
    const loadFavoriteProperties = async () => {
      if (favorites.length === 0) {
        setFavoriteProperties([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const allProperties = await propertyService.getAll();
        const favoritePropertyData = allProperties.filter(property =>
          favorites.some(fav => fav.propertyId === property.Id.toString())
        );

        // Add favorite metadata to properties
        const enrichedProperties = favoritePropertyData.map(property => {
          const favoriteData = favorites.find(fav => fav.propertyId === property.Id.toString());
          return {
            ...property,
            favoriteData: favoriteData
          };
        });

        setFavoriteProperties(enrichedProperties);
      } catch (err) {
        setError(err.message || 'Failed to load favorite properties');
        toast.error('Failed to load favorite properties');
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProperties();
  }, [favorites]);

  // Apply sorting
  const sortedProperties = [...favoriteProperties].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.favoriteData.savedDate) - new Date(a.favoriteData.savedDate);
      case 'oldest':
        return new Date(a.favoriteData.savedDate) - new Date(b.favoriteData.savedDate);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleUpdateNote = async (favoriteId, notes) => {
    try {
      await favoriteService.update(favoriteId, { notes });
      toast.success('Note updated');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const handleNoteChange = (favoriteId, value) => {
    setNoteStates(prev => ({
      ...prev,
      [favoriteId]: value
    }));
  };

  const handleNoteBlur = (favoriteId, originalNotes) => {
    const newNotes = noteStates[favoriteId];
    if (newNotes !== undefined && newNotes !== originalNotes) {
      handleUpdateNote(favoriteId, newNotes);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <SkeletonLoader count={4} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="container mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-2">
              My Favorites
            </h1>
            <p className="text-gray-600">
              {favoriteProperties.length} saved propert{favoriteProperties.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>

          {favoriteProperties.length > 0 && (
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
          )}
        </div>

        {/* Empty State */}
        {favoriteProperties.length === 0 ? (
          <EmptyState
            title="No favorite properties yet"
            description="Start browsing properties and save your favorites to see them here."
            actionLabel="Browse Properties"
            onAction={() => window.location.href = '/'}
            icon="Heart"
          />
        ) : (
          /* Properties Display */
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProperties.map((property, index) => (
                    <motion.div
                      key={property.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="space-y-4">
                        <PropertyCard property={property} />
                        
                        {/* Notes Section */}
                        <div className="bg-white rounded-12 p-4 shadow-sm">
                          <div className="flex items-center space-x-2 mb-2">
                            <ApperIcon name="StickyNote" className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Notes</span>
                            <span className="text-xs text-gray-500">
                              Saved {new Date(property.favoriteData.savedDate).toLocaleDateString()}
                            </span>
                          </div>
                          <textarea
                            value={noteStates[property.favoriteData.Id] ?? property.favoriteData.notes}
                            onChange={(e) => handleNoteChange(property.favoriteData.Id, e.target.value)}
                            onBlur={() => handleNoteBlur(property.favoriteData.Id, property.favoriteData.notes)}
                            placeholder="Add your notes about this property..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            rows="2"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedProperties.map((property, index) => (
                    <motion.div
                      key={property.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-12 shadow-md overflow-hidden"
                    >
                      <div className="md:flex">
                        <div className="md:flex-shrink-0 md:w-64">
                          <img
                            className="h-48 w-full object-cover md:h-full md:w-64"
                            src={property.images[0]}
                            alt={property.address}
                          />
                        </div>
                        <div className="p-6 flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-4">
                            <div className="min-w-0 flex-1">
                              <h3 className="text-xl font-display font-semibold text-gray-900 break-words">
                                {property.address}
                              </h3>
                              <div className="text-2xl font-bold text-secondary mt-1">
                                {propertyService.formatPrice(property.price)}
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 ml-4 flex-shrink-0">
                              Saved {new Date(property.favoriteData.savedDate).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Bed" className="w-4 h-4" />
                              <span>{property.bedrooms} beds</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Bath" className="w-4 h-4" />
                              <span>{property.bathrooms} baths</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Square" className="w-4 h-4" />
                              <span>{propertyService.formatSquareFeet(property.squareFeet)} sq ft</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                              value={noteStates[property.favoriteData.Id] ?? property.favoriteData.notes}
                              onChange={(e) => handleNoteChange(property.favoriteData.Id, e.target.value)}
                              onBlur={() => handleNoteBlur(property.favoriteData.Id, property.favoriteData.notes)}
                              placeholder="Add your notes about this property..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                              rows="2"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Favorites;