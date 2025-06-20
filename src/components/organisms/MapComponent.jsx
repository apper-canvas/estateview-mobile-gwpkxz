import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { propertyService } from '@/services';

const MapComponent = ({ properties = [], selectedProperty, onPropertySelect, className = '' }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 }); // Los Angeles default
  const [zoom, setZoom] = useState(10);

  // Mock map markers based on property coordinates
  const markers = properties.map(property => ({
    id: property.Id,
    lat: property.latitude,
    lng: property.longitude,
    price: propertyService.formatPrice(property.price),
    property: property
  }));

  const handleMarkerClick = (marker) => {
    onPropertySelect?.(marker.property);
    setMapCenter({ lat: marker.lat, lng: marker.lng });
    setZoom(15);
  };

  const resetView = () => {
    if (properties.length > 0) {
      // Calculate center based on all properties
      const avgLat = properties.reduce((sum, p) => sum + p.latitude, 0) / properties.length;
      const avgLng = properties.reduce((sum, p) => sum + p.longitude, 0) / properties.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setZoom(10);
    }
  };

  return (
    <div className={`relative bg-gray-100 rounded-12 overflow-hidden ${className}`}>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setZoom(Math.min(zoom + 1, 18))}
          className="bg-white shadow-md p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Plus" className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setZoom(Math.max(zoom - 1, 1))}
          className="bg-white shadow-md p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Minus" className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetView}
          className="bg-white shadow-md p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ApperIcon name="Home" className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Mock Map Background */}
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 relative">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 grid-rows-8 h-full">
            {[...Array(96)].map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>

        {/* Street Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#94a3b8" strokeWidth="3" />
          <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#94a3b8" strokeWidth="3" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#94a3b8" strokeWidth="2" />
        </svg>

        {/* Property Markers */}
        {markers.map((marker, index) => {
          const x = ((marker.lng + 118.5) / 2) * 100; // Normalize longitude to percentage
          const y = ((marker.lat - 33.5) / 1) * 100; // Normalize latitude to percentage
          const isSelected = selectedProperty?.Id === marker.id;

return (
            <motion.div
              key={marker.id}
              layout="position"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, layout: { duration: 0.3 } }}
              style={{
                position: 'absolute',
                left: `${Math.min(Math.max(x, 5), 95)}%`,
                top: `${Math.min(Math.max(y, 5), 95)}%`,
                transform: 'translate(-50%, -100%)'
              }}
              className="z-20"
>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                onClick={() => handleMarkerClick(marker)}
                className={`relative flex flex-col items-center ${
                  isSelected ? 'z-30' : 'z-20'
                }`}
              >
                {/* Price Label */}
                <div className={`px-2 py-1 rounded-md text-xs font-semibold mb-1 shadow-md transition-colors ${
                  isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}>
                  {marker.price}
                </div>

                {/* House Icon */}
                <div className={`p-1.5 rounded-full shadow-lg transition-colors ${
                  isSelected 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary text-white hover:bg-secondary/90'
                }`}>
                  <ApperIcon name="Home" className="w-4 h-4" />
                </div>

                {/* Pointer */}
                <div className={`w-2 h-2 rotate-45 -mt-1 shadow-sm ${
                  isSelected ? 'bg-primary' : 'bg-secondary'
                }`}></div>
              </motion.button>
            </motion.div>
          );
        })}

        {/* Map Attribution */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          Interactive Property Map
        </div>

        {/* Zoom Level Indicator */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          Zoom: {zoom}x
        </div>
      </div>

      {/* No Properties Message */}
      {properties.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <ApperIcon name="MapPin" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No properties to display on map</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;