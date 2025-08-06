import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProfileWithRelations } from '../types/database';
import { ProfileData } from '../types/profile';

export const useProfile = (profileId?: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select(`
          *,
          social_links(*),
          services(*),
          business_hours(*),
          gallery_images(*)
        `);

      if (profileId) {
        query = query.eq('id', profileId);
      } else {
        query = query.limit(1);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      if (data) {
        // Transform database data to ProfileData format
        const transformedProfile: ProfileData = {
          id: data.id,
          name: data.name,
          tagline: data.tagline,
          bio: data.bio,
          profileImage: data.profile_image,
          coverImage: data.cover_image,
          location: {
            address: data.location_address,
            city: data.location_city,
            country: data.location_country,
          },
          socialLinks: data.social_links?.map((link: any) => ({
            platform: link.platform as any,
            url: link.url,
            username: link.username,
          })) || [],
          services: data.services?.map((service: any) => ({
            name: service.name,
            description: service.description,
            price: service.price,
          })) || [],
          businessHours: data.business_hours?.map((bh: any) => ({
            day: bh.day,
            hours: bh.hours,
            isOpen: bh.is_open,
          })) || [],
          gallery: data.gallery_images?.map((img: any) => img.image_url) || [],
        };

        setProfile(transformedProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refetch: fetchProfile };
};