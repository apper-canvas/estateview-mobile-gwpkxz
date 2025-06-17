export { default as propertyService } from './api/propertyService';
export { default as favoriteService } from './api/favoriteService';
export { useFavorites } from './api/favoriteService';

// Utility function for delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));