import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useWindowSize } from "react-use";
import ApperIcon from "@/components/ApperIcon";
import PropertyCard from "@/components/molecules/PropertyCard";
import PropertyFilters from "@/components/molecules/PropertyFilters";
import MapComponent from "@/components/organisms/MapComponent";
import EmptyState from "@/components/atoms/EmptyState";
import ErrorState from "@/components/atoms/ErrorState";
import SkeletonLoader from "@/components/atoms/SkeletonLoader";
import { propertyService } from "@/services/index";

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const { width } = useWindowSize();

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
      if (result.length > 0 && !selectedProperty) {
        setSelectedProperty(result[0]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [filters, selectedProperty]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setSelectedProperty(null);
  }, []);

  const handlePropertySelect = useCallback((property) => {
    setSelectedProperty(property);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden bg-background">
        <div className="h-full flex">
          <div className="w-80 border-r border-gray-200 bg-white p-4">
            <SkeletonLoader count={3} type="list" />
          </div>
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
              <p className="text-gray-500">Loading map...</p>
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
    <div className="flex-1 overflow-hidden bg-background">
      <div className="h-full flex relative">
        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setShowFilters(false)}
              />
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden overflow-y-auto"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  </div>
                  <PropertyFilters onFiltersChange={handleFiltersChange} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

{/* Desktop Sidebar */}
        <AnimatePresence mode="wait">
          {showSidebar && (
            <motion.div
              layout
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="hidden md:flex flex-col border-r border-gray-200 bg-white overflow-hidden"
              style={{ willChange: 'width' }}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-display font-semibold text-gray-900">
                    Map View
                  </h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ApperIcon name="PanelLeftClose" className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} on map
                </p>
                <PropertyFilters onFiltersChange={handleFiltersChange} />
              </div>

              {/* Properties List */}
              <div className="flex-1 overflow-y-auto p-4">
                {properties.length === 0 ? (
                  <EmptyState
                    title="No properties found"
                    description="Try adjusting your filters to see properties on the map."
                    icon="MapPin"
                    className="py-8"
                  />
                ) : (
                  <div className="space-y-4">
                    {properties.map((property) => (
                      <motion.div
                        key={property.Id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handlePropertySelect(property)}
                        className={`cursor-pointer rounded-12 overflow-hidden transition-all ${
                          selectedProperty?.Id === property.Id
                            ? 'ring-2 ring-primary shadow-lg'
                            : 'hover:shadow-md'
                        }`}
                      >
                        <PropertyCard property={property} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-30 flex space-x-2">
            {/* Sidebar Toggle */}
            {!showSidebar && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSidebar(true)}
                className="bg-white shadow-lg p-3 rounded-lg hover:bg-gray-50 transition-colors hidden md:block"
              >
                <ApperIcon name="PanelLeftOpen" className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}

            {/* Mobile Filters Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className="bg-white shadow-lg p-3 rounded-lg hover:bg-gray-50 transition-colors md:hidden"
            >
              <ApperIcon name="Filter" className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>
{/* Selected Property Info */}
          <AnimatePresence mode="wait">
            {selectedProperty && (
              <motion.div
                layout="position"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2, layout: { duration: 0.3 } }}
                className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:max-w-sm z-30"
              >
                <div className="bg-white rounded-12 shadow-lg overflow-hidden">
                  <PropertyCard property={selectedProperty} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map Component */}
          <MapComponent
            properties={properties}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;