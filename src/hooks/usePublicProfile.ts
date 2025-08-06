import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ProfileData } from '../types/profile';

export const usePublicProfile = (username?: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      fetchProfileByUsername();
    } else {
      setLoading(false);
      setError('No username provided');
    }
  }, [username]);

  const fetchProfileByUsername = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to find profile by username
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          social_links(*),
          services(*),
          business_hours(*),
          gallery_images(*)
        `)
        .eq('username', username)
        .limit(1)
        .single();

      if (error) {
        // If no exact match, try searching by ID
        const { data: profileById, error: idError } = await supabase
          .from('profiles')
          .select(`
            *,
            social_links(*),
            services(*),
            business_hours(*),
            gallery_images(*)
          `)
          .eq('id', username)
          .single();

        if (idError) {
          // Last fallback: search by name
          const { data: profileByName, error: nameError } = await supabase
            .from('profiles')
            .select(`
              *,
              social_links(*),
              services(*),
              business_hours(*),
              gallery_images(*)
            `)
            .ilike('name', `%${username}%`)
            .limit(1)
            .single();

          if (nameError) {
            throw new Error('Profile not found');
          }

          if (profileByName) {
            setProfile(transformProfile(profileByName));
          }
        } else if (profileById) {
          setProfile(transformProfile(profileById));
        }
      } else if (data) {
        setProfile(transformProfile(data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile not found');
    } finally {
      setLoading(false);
    }
  };

  const transformProfile = (data: any): ProfileData => {
    return {
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
  };

  return { profile, loading, error, refetch: fetchProfileByUsername };
};