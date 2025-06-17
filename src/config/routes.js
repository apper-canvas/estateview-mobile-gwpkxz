import Browse from '@/components/pages/Browse';
import MapView from '@/components/pages/MapView';
import PropertyDetail from '@/components/pages/PropertyDetail';
import Favorites from '@/components/pages/Favorites';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/',
    icon: 'Home',
    component: Browse
  },
  map: {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites
  },
  propertyDetail: {
    id: 'propertyDetail',
    path: '/property/:id',
    component: PropertyDetail
  }
};

export const routeArray = Object.values(routes);
export default routes;