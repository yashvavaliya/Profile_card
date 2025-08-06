export interface Profile {
  id: string;
  name: string;
  username?: string;
  tagline: string;
  bio: string;
  profile_image: string;
  cover_image: string;
  location_address: string;
  location_city: string;
  location_country: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  username: string;
}

export interface Service {
  id: string;
  profile_id: string;
  name: string;
  description: string;
  price: string;
}

export interface BusinessHour {
  id: string;
  profile_id: string;
  day: string;
  hours: string;
  is_open: boolean;
}

export interface GalleryImage {
  id: string;
  profile_id: string;
  image_url: string;
  order_index: number;
}

export interface ProfileWithRelations extends Profile {
  social_links: SocialLink[];
  services: Service[];
  business_hours: BusinessHour[];
  gallery_images: GalleryImage[];
}