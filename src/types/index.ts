export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  user_type: 'student' | 'landlord';
  avatar_url?: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  city: string;
  neighborhood: string;
  street_name: string;
  house_name?: string;
  amenities: string[];
  nearby_landmarks: string[];
  images: string[];
  landlord_id: string;
  landlord?: User;
  bedrooms: number;
  bathrooms: number;
  area_sqm?: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  property_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface Chat {
  id: string;
  property_id: string;
  student_id: string;
  landlord_id: string;
  last_message?: string;
  last_message_at?: string;
  property?: Property;
  other_user?: User;
}

export interface FilterOptions {
  type: 'rent' | 'sale' | 'all';
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  amenities?: string[];
  bedrooms?: number;
}