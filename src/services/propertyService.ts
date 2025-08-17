import { supabase } from '../config/supabase';
import { Property, FilterOptions } from '../types';

export const propertyService = {
  // Get all properties with optional filters
  async getProperties(filters?: FilterOptions): Promise<Property[]> {
    let query = supabase
      .from('properties')
      .select(`
        *,
        landlord:users(id, full_name, email, phone, avatar_url)
      `)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get property by ID
  async getPropertyById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        landlord:users(id, full_name, email, phone, avatar_url)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create new property
  async createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .insert([property])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update property
  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete property
  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get properties by landlord
  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('landlord_id', landlordId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Search properties
  async searchProperties(searchTerm: string): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        landlord:users(id, full_name, email, phone, avatar_url)
      `)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,neighborhood.ilike.%${searchTerm}%`)
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};