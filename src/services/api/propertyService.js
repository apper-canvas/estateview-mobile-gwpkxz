import propertyData from '../mockData/property.json';
import { delay } from '../index';

class PropertyService {
  constructor() {
    this.properties = [...propertyData];
  }

  async getAll() {
    await delay(300);
    return [...this.properties];
  }

  async getById(id) {
    await delay(200);
    const property = this.properties.find(item => item.Id === parseInt(id, 10));
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  }

  async search(filters = {}) {
    await delay(400);
    let filtered = [...this.properties];

    if (filters.searchLocation) {
      const searchTerm = filters.searchLocation.toLowerCase();
      filtered = filtered.filter(property => 
        property.address.toLowerCase().includes(searchTerm) ||
        property.mlsNumber.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.priceMin !== undefined) {
      filtered = filtered.filter(property => property.price >= filters.priceMin);
    }

    if (filters.priceMax !== undefined) {
      filtered = filtered.filter(property => property.price <= filters.priceMax);
    }

    if (filters.bedroomsMin !== undefined) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedroomsMin);
    }

    if (filters.bathroomsMin !== undefined) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathroomsMin);
    }

    if (filters.squareFeetMin !== undefined) {
      filtered = filtered.filter(property => property.squareFeet >= filters.squareFeetMin);
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => 
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    return filtered;
  }

  async getSimilar(propertyId, limit = 4) {
    await delay(250);
    const property = this.properties.find(item => item.Id === parseInt(propertyId, 10));
    if (!property) return [];

    // Find similar properties based on type, price range, and bedroom count
    const priceRange = property.price * 0.2; // 20% price range
    const similar = this.properties
      .filter(item => 
        item.Id !== property.Id &&
        item.propertyType === property.propertyType &&
        Math.abs(item.price - property.price) <= priceRange &&
        Math.abs(item.bedrooms - property.bedrooms) <= 1
      )
      .slice(0, limit);

    return similar.map(item => ({ ...item }));
  }

  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  formatSquareFeet(sqft) {
    return new Intl.NumberFormat('en-US').format(sqft);
  }
}

export default new PropertyService();