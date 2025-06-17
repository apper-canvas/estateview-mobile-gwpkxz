import { useState, useEffect } from 'react';
import favoriteData from '../mockData/favorite.json';
import { delay } from '../index';

class FavoriteService {
  constructor() {
    this.favorites = [...favoriteData];
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(callback => callback([...this.favorites]));
  }

  async getAll() {
    await delay(200);
    return [...this.favorites];
  }

  async getById(id) {
    await delay(150);
    const favorite = this.favorites.find(item => item.Id === parseInt(id, 10));
    if (!favorite) {
      throw new Error('Favorite not found');
    }
    return { ...favorite };
  }

  async create(favorite) {
    await delay(250);
    const newId = Math.max(...this.favorites.map(f => f.Id), 0) + 1;
    const newFavorite = {
      Id: newId,
      propertyId: favorite.propertyId,
      savedDate: new Date().toISOString(),
      notes: favorite.notes || ''
    };
    this.favorites.push(newFavorite);
    this.notify();
    return { ...newFavorite };
  }

  async update(id, data) {
    await delay(200);
    const index = this.favorites.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    const updatedFavorite = { ...this.favorites[index], ...data };
    delete updatedFavorite.Id; // Prevent Id modification
    this.favorites[index] = { ...this.favorites[index], ...updatedFavorite };
    this.notify();
    return { ...this.favorites[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.favorites.findIndex(item => item.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    this.favorites.splice(index, 1);
    this.notify();
    return true;
  }

  async deleteByPropertyId(propertyId) {
    await delay(200);
    const index = this.favorites.findIndex(item => item.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Favorite not found');
    }
    this.favorites.splice(index, 1);
    this.notify();
    return true;
  }

  async isFavorite(propertyId) {
    await delay(100);
    return this.favorites.some(favorite => favorite.propertyId === propertyId);
  }

  isFavoriteSync(propertyId) {
    return this.favorites.some(favorite => favorite.propertyId === propertyId);
  }
}

const favoriteService = new FavoriteService();

// Custom hook for reactive favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const data = await favoriteService.getAll();
        setFavorites(data);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    };

    loadFavorites();

    const unsubscribe = favoriteService.subscribe(setFavorites);
    return unsubscribe;
  }, []);

  return { favorites, favoriteService };
};

export default favoriteService;