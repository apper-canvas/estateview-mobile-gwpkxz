import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PhotoGallery = ({ images = [], alt = 'Property image', className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => prev === images.length - 1 ? 0 : prev + 1);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => prev === 0 ? images.length - 1 : prev - 1);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-12 flex items-center justify-center h-64 ${className}`}>
        <ApperIcon name="Image" className="w-16 h-16 text-gray-400" />
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={`relative rounded-12 overflow-hidden ${className}`}>
        {/* Main Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={images[currentIndex]}
            alt={`${alt} ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openFullscreen}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ApperIcon name="ChevronLeft" className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ApperIcon name="ChevronRight" className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={openFullscreen}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          >
            <ApperIcon name="Maximize" className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${alt} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50"
              onClick={closeFullscreen}
            />
            
            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-full max-h-full"
              >
                {/* Close Button */}
                <button
                  onClick={closeFullscreen}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
                >
                  <ApperIcon name="X" className="w-6 h-6" />
                </button>

                {/* Fullscreen Image */}
                <img
                  src={images[currentIndex]}
                  alt={`${alt} ${currentIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Navigation in Fullscreen */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <ApperIcon name="ChevronLeft" className="w-8 h-8" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <ApperIcon name="ChevronRight" className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Image Counter in Fullscreen */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                  {currentIndex + 1} of {images.length}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default PhotoGallery;