import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import PhotoGallery from '@/components/molecules/PhotoGallery';
import PropertyCard from '@/components/molecules/PropertyCard';
import { propertyService, favoriteService, useFavorites } from '@/services';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isToggling, setIsToggling] = useState(false);

  const isFavorited = property && favorites.some(fav => fav.propertyId === property.Id.toString());

  useEffect(() => {
    const loadPropertyData = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const [propertyData, similarData] = await Promise.all([
          propertyService.getById(id),
          propertyService.getSimilar(id)
        ]);
        
        setProperty(propertyData);
        setSimilarProperties(similarData);
      } catch (err) {
        setError(err.message || 'Failed to load property details');
        toast.error('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    loadPropertyData();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!property) return;
    
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

  const handleContactAgent = () => {
    toast.success('Contact form would open here');
  };

  const handleScheduleTour = () => {
    toast.success('Tour scheduling would open here');
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <SkeletonLoader count={1} type="detail" />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-6xl">
          <ErrorState 
            message={error || 'Property not found'} 
            onRetry={() => window.location.reload()} 
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto bg-background"
    >
      <div className="container mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -2 }}
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ApperIcon name="ArrowLeft" className="w-5 h-5" />
          <span>Back to Properties</span>
        </motion.button>

        {/* Property Images */}
        <div className="mb-8">
          <PhotoGallery 
            images={property.images} 
            alt={property.address}
            className="h-64 md:h-96"
          />
        </div>

        {/* Property Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-2">
                  {property.address}
                </h1>
                <div className="text-3xl font-bold text-secondary mb-4">
                  {propertyService.formatPrice(property.price)}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFavoriteToggle}
                disabled={isToggling}
                className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-5 h-5 transition-colors ${
                    isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`} 
                />
                <span className="text-sm font-medium">
                  {isFavorited ? 'Saved' : 'Save'}
                </span>
              </motion.button>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-12 p-4 shadow-sm text-center">
                <ApperIcon name="Bed" className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? 's' : ''}</div>
              </div>
              <div className="bg-white rounded-12 p-4 shadow-sm text-center">
                <ApperIcon name="Bath" className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathroom{property.bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div className="bg-white rounded-12 p-4 shadow-sm text-center">
                <ApperIcon name="Square" className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {propertyService.formatSquareFeet(property.squareFeet)}
                </div>
                <div className="text-sm text-gray-600">Sq Ft</div>
              </div>
              <div className="bg-white rounded-12 p-4 shadow-sm text-center">
                <ApperIcon name="Home" className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900 break-words">
                  {property.propertyType.split(' ')[0]}
                </div>
                <div className="text-sm text-gray-600">
                  {property.propertyType.split(' ').slice(1).join(' ')}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-12 p-6 shadow-sm mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-12 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ApperIcon name="Check" className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-12 p-6 shadow-sm sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Interested in this property?</h3>
              
              <div className="space-y-3 mb-6">
                <Button
                  onClick={handleContactAgent}
                  variant="primary"
                  fullWidth
                  icon="MessageCircle"
                >
                  Contact Agent
                </Button>
                <Button
                  onClick={handleScheduleTour}
                  variant="secondary"
                  fullWidth
                  icon="Calendar"
                >
                  Schedule Tour
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>MLS Number:</span>
                  <span className="font-medium">{property.mlsNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Listed:</span>
                  <span className="font-medium">
                    {new Date(property.listingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              Similar Properties
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((similarProperty, index) => (
                <motion.div
                  key={similarProperty.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard property={similarProperty} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyDetail;