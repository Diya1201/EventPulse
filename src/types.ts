export type Screen = 'organizer-dashboard' | 'attendee-generator';
export type TransitionType = 'none' | 'push';

export interface EventConfig {
  eventName: string;
  hostEntity: string;
  hashtags: string[];
  linkedinUrl: string;
  twitterHandle: string;
  websiteUrl: string;
  portalUrl: string;
}

export interface CuratedPrompt {
  id: string;
  title: string;
  isDefault: boolean;
  preview: string;
  takeawayText: string;
  tone: string;
}

export interface LivePost {
  id: string;
  authorName: string;
  authorRole: string;
  timeAgo: string;
  likes: number;
  content: string;
  avatarUrl: string;
}

export interface PhotoAsset {
  id: string;
  name: string;
  url: string;
  active: boolean;
}
