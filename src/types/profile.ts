export interface SocialLink {
  platform: 'instagram' | 'linkedin' | 'whatsapp' | 'email' | 'twitter' | 'facebook' | 'youtube';
  url: string;
  username?: string;
}

export interface BusinessHours {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface Service {
  name: string;
  description: string;
  price?: string;
}

export interface ProfileData {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  socialLinks: SocialLink[];
  services: Service[];
  businessHours: BusinessHours[];
  gallery: string[];
}