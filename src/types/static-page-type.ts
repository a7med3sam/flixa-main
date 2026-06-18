// src/types/static-pages.ts
export type StaticPageType = 'privacy-policy' | 'return-policy';

export interface StaticPage {
  id: string;
  type: StaticPageType; // This acts as discriminator
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  // Common fields for both policies
}

// If you need specific types later, you can extend:
export interface PrivacyPolicy extends StaticPage {
  type: 'privacy-policy';
  // Privacy-specific fields can be added here
}

export interface ReturnPolicy extends StaticPage {
  type: 'return-policy';
  // Return-specific fields can be added here
}
export interface ContactUs {
  id: string;
  logoUrl: string;
  name: string;
  nameAr:string;
  nameEn:string;
  content: string;
}