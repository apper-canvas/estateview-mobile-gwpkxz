import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { propertyService, favoriteService, useFavorites } from '@/services';

const PropertyCard = ({ property, className = '' }) => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorited = favorites.some(fav => fav.propertyId === property.Id.toString());

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    setIsToggling(true);

    try {
      if (isFavorited) {
        await favoriteService.deleteByPropertyId(property.Id.toString());
        toast.success('Removed from favorites');
      } else {
        await favoriteService.create({
          propertyId: property.Id.toString(),
          notes: ''
        });
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setIsToggling(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, shadow: '0 8px 25px rgba(0,0,0,0.15)' }}
      onClick={handleCardClick}
      className={`bg-white rounded-12 shadow-md overflow-hidden cursor-pointer transition-all duration-200 ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={property.images[currentImageIndex]}
          alt={property.address}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <ApperIcon name="ChevronRight" className="w-4 h-4" />
            </button>
            
            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
            {propertyService.formatPrice(property.price)}
          </div>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFavoriteToggle}
          disabled={isToggling}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-colors"
        >
          <ApperIcon 
            name="Heart" 
            className={`w-5 h-5 transition-colors ${
              isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
            }`} 
          />
        </motion.button>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Address */}
        <h3 className="font-display font-medium text-gray-900 text-lg leading-tight break-words">
          {property.address}
        </h3>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
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

        {/* Property Type */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-accent font-medium">{property.propertyType}</span>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <ApperIcon name="Calendar" className="w-3 h-3" />
            <span>Listed {new Date(property.listingDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;