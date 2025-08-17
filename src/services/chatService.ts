import { supabase } from '../config/supabase';
import { Message, Chat } from '../types';

export const chatService = {
  // Get all chats for a user
  async getChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select(`
        *,
        property:properties(*),
        student:users!chats_student_id_fkey(id, full_name, avatar_url),
        landlord:users!chats_landlord_id_fkey(id, full_name, avatar_url)
      `)
      .or(`student_id.eq.${userId},landlord_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get or create chat
  async getOrCreateChat(propertyId: string, studentId: string, landlordId: string): Promise<Chat> {
    // First try to get existing chat
    const { data: existingChat, error: fetchError } = await supabase
      .from('chats')
      .select('*')
      .eq('property_id', propertyId)
      .eq('student_id', studentId)
      .eq('landlord_id', landlordId)
      .single();

    if (existingChat) {
      return existingChat;
    }

    // Create new chat if it doesn't exist
    const { data: newChat, error: createError } = await supabase
      .from('chats')
      .insert([
        {
          property_id: propertyId,
          student_id: studentId,
          landlord_id: landlordId,
        },
      ])
      .select()
      .single();

    if (createError) throw createError;
    return newChat;
  },

  // Get messages for a chat
  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Send message
  async sendMessage(
    chatId: string,
    senderId: string,
    receiverId: string,
    content: string
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update chat's last message
    await supabase
      .from('chats')
      .update({
        last_message: content,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', chatId);

    return data;
  },

  // Mark messages as read
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('chat_id', chatId)
      .eq('receiver_id', userId)
      .eq('read', false);

    if (error) throw error;
  },
};