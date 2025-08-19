export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  currency: string;
  city: string;
  neighborhood: string;
  streetName: string;
  houseName?: string;
  images: string[];
  amenities: Amenity[];
  nearbyLandmarks: Landmark[];
  landlordId: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  available: boolean;
  createdAt: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface Landmark {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'market' | 'transport';
  distance: number; // in meters
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'student' | 'landlord';
  avatar: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
  hasDashboard?: boolean;
  landlordApplicationStatus?: 'pending' | 'approved' | 'rejected';
}

export interface SellItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: 'land' | 'house' | 'furniture' | 'electronics' | 'vehicles' | 'business';
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  contactPhone?: string;
  images: string[];
  sellerId: string;
  available: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  propertyId: string;
  studentId: string;
  landlordId: string;
  lastMessage?: Message;
  createdAt: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SearchFilters {
  type: 'rent' | 'sale' | 'all';
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  neighborhood?: string;
  bedrooms?: number;
  amenities?: string[];
}