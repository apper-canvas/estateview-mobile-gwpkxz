import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { propertyService, favoriteService, useFavorites } from '@/services';

const PropertyList = ({ properties = [], className = '' }) => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [toggleStates, setToggleStates] = useState({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const handleFavoriteToggle = async (property, e) => {
    e.stopPropagation();
    const propertyId = property.Id.toString();
    
    setToggleStates(prev => ({ ...prev, [propertyId]: true }));

    try {
      const isFavorited = favorites.some(fav => fav.propertyId === propertyId);
      
      if (isFavorited) {
        await favoriteService.deleteByPropertyId(propertyId);
        toast.success('Removed from favorites');
      } else {
        await favoriteService.create({
          propertyId: propertyId,
          notes: ''
        });
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setToggleStates(prev => ({ ...prev, [propertyId]: false }));
    }
  };

  const handlePropertyClick = (property) => {
    navigate(`/property/${property.Id}`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-4 ${className}`}
    >
      {properties.map((property) => {
        const isFavorited = favorites.some(fav => fav.propertyId === property.Id.toString());
        const isToggling = toggleStates[property.Id.toString()];

        return (
          <motion.div
            key={property.Id}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            onClick={() => handlePropertyClick(property)}
            className="bg-white rounded-12 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="flex">
              {/* Property Image */}
              <div className="flex-shrink-0 w-32 md:w-48 h-32 md:h-36 relative overflow-hidden">
                <img
                  src={property.images[0]}
                  alt={property.address}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <div className="bg-secondary text-white px-2 py-1 rounded text-xs font-semibold">
                    {propertyService.formatPrice(property.price)}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex-1 p-4 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display font-medium text-gray-900 text-lg leading-tight break-words pr-2">
                    {property.address}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleFavoriteToggle(property, e)}
                    disabled={isToggling}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon 
                      name="Heart" 
                      className={`w-5 h-5 transition-colors ${
                        isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
                      }`} 
                    />
                  </motion.button>
                </div>

                {/* Property Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Bed" className="w-4 h-4" />
                    <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Bath" className="w-4 h-4" />
                    <span>{property.bathrooms} bath{property.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Square" className="w-4 h-4" />
                    <span>{propertyService.formatSquareFeet(property.squareFeet)} sq ft</span>
                  </div>
                </div>

                {/* Property Type and Date */}
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <span className="text-accent font-medium">{property.propertyType}</span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ApperIcon name="Calendar" className="w-3 h-3" />
                    <span>Listed {new Date(property.listingDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* MLS Number */}
                <div className="mt-2 text-xs text-gray-500">
                  MLS: {property.mlsNumber}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PropertyList;