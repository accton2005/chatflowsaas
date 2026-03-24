export type UserRole = 'admin' | 'user';
export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'business';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  plan: SubscriptionPlan;
  subscriptionId?: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatbotConfig {
  id: string;
  ownerId: string;
  name: string;
  personality?: string;
  language?: string;
  behaviorRules?: string;
  model: string;
  fallbackModel?: string;
  isActive: boolean;
  createdAt: string;
}

export interface KnowledgeSource {
  id: string;
  chatbotId: string;
  ownerId: string;
  type: 'pdf' | 'url' | 'text' | 'docx';
  content: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatbotId: string;
  userId: string;
  role: 'user' | 'assistant';
  text: string;
  tokens?: number;
  createdAt: string;
}

export interface UsageAnalytics {
  ownerId: string;
  chatbotId?: string;
  totalMessages: number;
  totalTokens: number;
  date: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
