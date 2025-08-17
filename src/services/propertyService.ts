import { Property, FilterOptions } from '../types';
import { SEED_PROPERTIES } from '../data/seedData';

export const propertyService = {
  // Get all properties with optional filters
  async getProperties(filters?: FilterOptions): Promise<Property[]> {
    // Use mock data for development
    let properties = SEED_PROPERTIES.map((prop, index) => ({
      ...prop,
      id: `property-${index + 1}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      landlord: {
        id: prop.landlord_id,
        full_name: `Landlord ${index + 1}`,
        email: `landlord${index + 1}@example.com`,
        phone: `+23712345678${index}`,
        avatar_url: null,
      },
    }));

    // Apply filters
    if (filters) {
      if (filters.type && filters.type !== 'all') {
        properties = properties.filter(p => p.type === filters.type);
      }
      if (filters.minPrice) {
        properties = properties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        properties = properties.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.city) {
        properties = properties.filter(p => 
          p.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.bedrooms) {
        properties = properties.filter(p => p.bedrooms >= filters.bedrooms!);
      }
    }

    return properties;
  },

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    const properties = await this.getProperties();
    return properties.find(p => p.id === id) || null;
  },

  // Create new property
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    // Mock property creation
    const newProperty = {
      ...property,
      id: `property-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return newProperty;
  },

  // Update property
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    // Mock property update
    const property = await this.getPropertyById(id);
    if (!property) throw new Error('Property not found');
    
    return {
      ...property,
      ...updates,
      updated_at: new Date().toISOString(),
    };
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    // Mock property deletion
    console.log(`Property ${id} deleted (mock)`);
  },

  // Get properties by landlord
  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    const properties = await this.getProperties();
    return properties.filter(p => p.landlord_id === landlordId);
  },

  // Search properties
  async searchProperties(searchTerm: string): Promise<Property[]> {
    const properties = await this.getProperties();
    const term = searchTerm.toLowerCase();
    
    return properties.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.neighborhood.toLowerCase().includes(term)
    );
  },
};