import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  Linking,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  HelpCircle,
  ChevronRight,
  Send,
  Book,
  Shield,
  Settings
} from 'lucide-react-native';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'guides'>('faq');
  const [contactMessage, setContactMessage] = useState('');

  const faqData = [
    {
      id: '1',
      question: 'How do I search for properties?',
      answer: 'Use the search bar on the home page to enter location keywords, or use the filter button to set specific criteria like price range, bedrooms, and amenities.'
    },
    {
      id: '2',
      question: 'How can I contact a property owner?',
      answer: 'Tap on any property card to view details, then use the "Contact Owner" button to start a conversation directly with the landlord.'
    },
    {
      id: '3',
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption to protect your data. We never share your personal information with third parties without your consent.'
    },
    {
      id: '4',
      question: 'How do I add a property as a landlord?',
      answer: 'If you\'re registered as a landlord, tap the + button on the home page to add a new property listing with photos, description, and pricing.'
    },
    {
      id: '5',
      question: 'Can I save properties for later?',
      answer: 'Yes, tap the heart icon on any property to save it to your favorites. Access saved properties from your profile page.'
    },
    {
      id: '6',
      question: 'How do I report a problem with a property?',
      answer: 'Use the contact form below or reach out to us directly. We take all reports seriously and will investigate promptly.'
    }
  ];

  const guideData = [
    {
      id: '1',
      title: 'Getting Started Guide',
      description: 'Learn the basics of using the app to find your perfect home',
      icon: Book
    },
    {
      id: '2',
      title: 'Safety Guidelines',
      description: 'Important safety tips when viewing properties and meeting landlords',
      icon: Shield
    },
    {
      id: '3',
      title: 'Account Settings',
      description: 'Manage your profile, notifications, and privacy settings',
      icon: Settings
    }
  ];

  const handleCall = () => {
    Linking.openURL('tel:+237671234567');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@buearental.com?subject=Support Request');
  };

  const handleSendMessage = () => {
    if (contactMessage.trim()) {
      // In a real app, this would send the message to your support system
      setContactMessage('');
      alert('Message sent! We\'ll get back to you within 24 hours.');
    }
  };

  const renderFAQ = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {faqData.map((item) => (
        <View key={item.id} style={styles.faqItem}>
          <View style={styles.faqQuestion}>
            <HelpCircle size={16} color="#3B82F6" />
            <Text style={styles.faqQuestionText}>{item.question}</Text>
          </View>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      ))}
    </View>
  );

  const renderContact = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Get in Touch</Text>
      
      <View style={styles.contactOptions}>
        <TouchableOpacity style={styles.contactOption} onPress={handleCall}>
          <Phone size={20} color="#10B981" />
          <View style={styles.contactOptionText}>
            <Text style={styles.contactOptionTitle}>Call Us</Text>
            <Text style={styles.contactOptionSubtitle}>+237 671 234 567</Text>
          </View>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactOption} onPress={handleEmail}>
          <Mail size={20} color="#3B82F6" />
          <View style={styles.contactOptionText}>
            <Text style={styles.contactOptionTitle}>Email Support</Text>
            <Text style={styles.contactOptionSubtitle}>support@buearental.com</Text>
          </View>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Send us a Message</Text>
      <View style={styles.messageContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Describe your issue or question..."
          value={contactMessage}
          onChangeText={setContactMessage}
          multiline
          numberOfLines={4}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            contactMessage.trim() ? styles.sendButtonActive : styles.sendButtonInactive
          ]}
          onPress={handleSendMessage}
          disabled={!contactMessage.trim()}
        >
          <Send size={16} color={contactMessage.trim() ? "#FFFFFF" : "#9CA3AF"} />
          <Text style={[
            styles.sendButtonText,
            contactMessage.trim() ? styles.sendButtonTextActive : styles.sendButtonTextInactive
          ]}>
            Send Message
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGuides = () => (
    <View style={styles.content}>
      <Text style={styles.sectionTitle}>Helpful Guides</Text>
      {guideData.map((item) => (
        <TouchableOpacity key={item.id} style={styles.guideItem}>
          <item.icon size={20} color="#3B82F6" />
          <View style={styles.guideText}>
            <Text style={styles.guideTitle}>{item.title}</Text>
            <Text style={styles.guideDescription}>{item.description}</Text>
          </View>
          <ChevronRight size={16} color="#9CA3AF" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'faq' && styles.activeTab]}
          onPress={() => setActiveTab('faq')}
        >
          <HelpCircle size={16} color={activeTab === 'faq' ? "#3B82F6" : "#6B7280"} />
          <Text style={[styles.tabText, activeTab === 'faq' && styles.activeTabText]}>
            FAQ
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => setActiveTab('contact')}
        >
          <MessageCircle size={16} color={activeTab === 'contact' ? "#3B82F6" : "#6B7280"} />
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
            Contact
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'guides' && styles.activeTab]}
          onPress={() => setActiveTab('guides')}
        >
          <FileText size={16} color={activeTab === 'guides' ? "#3B82F6" : "#6B7280"} />
          <Text style={[styles.tabText, activeTab === 'guides' && styles.activeTabText]}>
            Guides
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'contact' && renderContact()}
        {activeTab === 'guides' && renderGuides()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  faqItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  faqQuestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  contactOptions: {
    marginBottom: 32,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  contactOptionText: {
    flex: 1,
    marginLeft: 12,
  },
  contactOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactOptionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  messageContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 100,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3B82F6',
  },
  sendButtonInactive: {
    backgroundColor: '#E5E7EB',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sendButtonTextActive: {
    color: '#FFFFFF',
  },
  sendButtonTextInactive: {
    color: '#9CA3AF',
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  guideText: {
    flex: 1,
    marginLeft: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});