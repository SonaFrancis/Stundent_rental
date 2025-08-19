import { Property, FilterOptions } from '../types';

// Mock property data
const SEED_PROPERTIES = [
  {
    title: 'Modern Studio Apartment near University of Yaoundé',
    description: 'A beautiful modern studio apartment perfect for students. Located just 10 minutes walk from the University of Yaoundé. Fully furnished with all necessary amenities.',
    type: 'rent' as const,
    price: 85000,
    city: 'Yaoundé',
    neighborhood: 'Ngoa-Ekelle',
    street_name: 'Avenue Kennedy',
    house_name: 'Résidence Universitaire',
    amenities: ['Electricity', 'Water', 'WiFi', 'Security', 'Parking'],
    nearby_landmarks: ['University of Yaoundé I', 'Central Hospital', 'Nlongkak Market'],
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
    ],
    landlord_id: 'landlord-1',
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 35,
    is_available: true,
  },
  {
    title: 'Spacious 2-Bedroom Apartment in Douala',
    description: 'Perfect for students sharing accommodation. Located in a safe neighborhood with easy access to universities and amenities.',
    type: 'rent' as const,
    price: 120000,
    city: 'Douala',
    neighborhood: 'Akwa',
    street_name: 'Rue Joss',
    amenities: ['Electricity', 'Water', 'Generator', 'Security'],
    nearby_landmarks: ['University of Douala', 'Douala Port', 'Central Market'],
    images: [
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg',
      'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg',
    ],
    landlord_id: 'landlord-2',
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 65,
    is_available: true,
  },
  {
    title: 'Luxury 3-Bedroom House for Sale in Yaoundé',
    description: 'Beautiful house perfect for investment or family living. Located in a prestigious neighborhood with excellent amenities.',
    type: 'sale' as const,
    price: 45000000,
    city: 'Yaoundé',
    neighborhood: 'Bastos',
    street_name: 'Avenue Charles de Gaulle',
    house_name: 'Villa Moderne',
    amenities: ['Electricity', 'Water', 'WiFi', 'Security', 'Parking', 'Generator', 'Air Conditioning'],
    nearby_landmarks: ['French Embassy', 'Hilton Hotel', 'Unity Palace'],
    images: [
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg',
    ],
    landlord_id: 'landlord-1',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 150,
    is_available: true,
  },
];

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