import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { supabase, uploadImage, deleteImage, getImagePath } from '../../lib/supabase';
import { ProfileWithRelations } from '../../types/database';
import { toast } from 'sonner';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9-_]+$/, 'Username can only contain letters, numbers, hyphens, and underscores'),
  tagline: z.string().optional(),
  bio: z.string().optional(),
  location_address: z.string().optional(),
  location_city: z.string().optional(),
  location_country: z.string().optional(),
  social_links: z.array(z.object({
    platform: z.string().optional(),
    url: z.string().url('Invalid URL').optional().or(z.literal('')),
    username: z.string().optional(),
  })).optional(),
  services: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.string().optional(),
  })).optional(),
  business_hours: z.array(z.object({
    day: z.string(),
    hours: z.string(),
    is_open: z.boolean(),
  })).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const socialPlatforms = [
  'instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'whatsapp', 'email'
];

const weekDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const ProfileForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');
  const [coverImagePreview, setCoverImagePreview] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      social_links: [],
      services: [],
      business_hours: weekDays.map(day => ({ day, hours: '9:00 AM - 5:00 PM', is_open: true })),
    },
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: 'social_links',
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control,
    name: 'services',
  });

  const { fields: businessHourFields } = useFieldArray({
    control,
    name: 'business_hours',
  });

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          social_links(*),
          services(*),
          business_hours(*),
          gallery_images(*)
        `)
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Set form values
      setValue('name', profile.name);
      setValue('username', profile.username || '');
      setValue('tagline', profile.tagline || '');
      setValue('bio', profile.bio || '');
      setValue('location_address', profile.location_address || '');
      setValue('location_city', profile.location_city || '');
      setValue('location_country', profile.location_country || '');
      setValue('social_links', profile.social_links || []);
      setValue('services', profile.services || []);
      
      // Set business hours
      const businessHours = weekDays.map(day => {
        const existing = profile.business_hours?.find(bh => bh.day === day);
        return existing || { day, hours: '9:00 AM - 5:00 PM', is_open: true };
      });
      setValue('business_hours', businessHours);

      // Set image previews
      setProfileImagePreview(profile.profile_image);
      setCoverImagePreview(profile.cover_image);
      
      // Set gallery images
      const galleryUrls = profile.gallery_images?.map(img => img.image_url) || [];
      setExistingGalleryImages(galleryUrls);

    } catch (error) {
      toast.error('Error fetching profile');
      navigate('/admin');
    }
  };

  const handleImageChange = (file: File | null, type: 'profile' | 'cover') => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === 'profile') {
        setProfileImage(file);
        setProfileImagePreview(result);
      } else {
        setCoverImage(file);
        setCoverImagePreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    setGalleryImages(prev => [...prev, ...newFiles]);

    // Create previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setGalleryPreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingGalleryImages.length;
      setGalleryImages(prev => prev.filter((_, i) => i !== newIndex));
      setGalleryPreviews(prev => prev.filter((_, i) => i !== newIndex));
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);

      let profileImageUrl = profileImagePreview;
      let coverImageUrl = coverImagePreview;

      // Upload profile image
      if (profileImage) {
        const profilePath = `profiles/${uuidv4()}-${profileImage.name}`;
        profileImageUrl = await uploadImage(profileImage, 'profile-images', profilePath);
      }

      // Upload cover image
      if (coverImage) {
        const coverPath = `covers/${uuidv4()}-${coverImage.name}`;
        coverImageUrl = await uploadImage(coverImage, 'profile-images', coverPath);
      }

      // Upload gallery images
      const galleryUrls = [...existingGalleryImages];
      for (const file of galleryImages) {
        const galleryPath = `gallery/${uuidv4()}-${file.name}`;
        const url = await uploadImage(file, 'profile-images', galleryPath);
        galleryUrls.push(url);
      }

      // Save or update profile
      const profileData = {
        name: data.name,
        username: data.username,
        tagline: data.tagline || '',
        bio: data.bio || '',
        profile_image: profileImageUrl,
        cover_image: coverImageUrl,
        location_address: data.location_address || '',
        location_city: data.location_city || '',
        location_country: data.location_country || '',
        updated_at: new Date().toISOString(),
      };

      let profileId = id;

      if (id) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', id);
        if (error) throw error;
      } else {
        // Create new profile
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single();
        if (error) throw error;
        profileId = newProfile.id;
      }

      // Delete existing related data
      if (id) {
        await supabase.from('social_links').delete().eq('profile_id', id);
        await supabase.from('services').delete().eq('profile_id', id);
        await supabase.from('business_hours').delete().eq('profile_id', id);
        await supabase.from('gallery_images').delete().eq('profile_id', id);
      }

      // Insert social links
      if (data.social_links && data.social_links.length > 0) {
        const validSocialLinks = data.social_links.filter(link => link.platform && link.url);
        if (validSocialLinks.length > 0) {
          const socialLinksData = validSocialLinks.map(link => ({
          profile_id: profileId,
          platform: link.platform,
          url: link.url,
          username: link.username || '',
        }));
          const { error } = await supabase.from('social_links').insert(socialLinksData);
          if (error) throw error;
        }
      }

      // Insert services
      if (data.services && data.services.length > 0) {
        const validServices = data.services.filter(service => service.name && service.description);
        if (validServices.length > 0) {
          const servicesData = validServices.map(service => ({
          profile_id: profileId,
          name: service.name,
          description: service.description,
          price: service.price || '',
        }));
          const { error } = await supabase.from('services').insert(servicesData);
          if (error) throw error;
        }
      }

      // Insert business hours
      if (data.business_hours && data.business_hours.length > 0) {
        const businessHoursData = data.business_hours.map(bh => ({
          profile_id: profileId,
          day: bh.day,
          hours: bh.hours,
          is_open: bh.is_open,
        }));
        const { error: bhError } = await supabase.from('business_hours').insert(businessHoursData);
        if (bhError) throw bhError;
      }

      // Insert gallery images
      if (galleryUrls.length > 0) {
        const galleryData = galleryUrls.map((url, index) => ({
          profile_id: profileId,
          image_url: url,
          order_index: index,
        }));
        const { error } = await supabase.from('gallery_images').insert(galleryData);
        if (error) throw error;
      }

      toast.success(id ? 'Profile updated successfully' : 'Profile created successfully');
      navigate('/admin');
    } catch (error) {
      toast.error('Error saving profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {id ? 'Edit Profile' : 'Create New Profile'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register('username')}
                  className={errors.username ? 'border-red-500' : ''}
                  placeholder="e.g., john-doe"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="e.g., Creative Designer & Digital Strategist"
                  {...register('tagline')}
                  className={errors.tagline ? 'border-red-500' : ''}
                />
                {errors.tagline && (
                  <p className="text-sm text-red-500">{errors.tagline.message}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell people about yourself, your experience, and what you do..."
                {...register('bio')}
                rows={4}
                className={errors.bio ? 'border-red-500' : ''}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Profile Image</Label>
                <div className="mt-2">
                  {profileImagePreview && (
                    <div className="mb-2">
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null, 'profile')}
                  />
                </div>
              </div>
              <div>
                <Label>Cover Image</Label>
                <div className="mt-2">
                  {coverImagePreview && (
                    <div className="mb-2">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-24 rounded object-cover"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null, 'cover')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location_address">Address</Label>
              <Input
                id="location_address"
                placeholder="e.g., 123 Main Street, Suite 456"
                {...register('location_address')}
                className={errors.location_address ? 'border-red-500' : ''}
              />
              {errors.location_address && (
                <p className="text-sm text-red-500">{errors.location_address.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location_city">City</Label>
                <Input
                  id="location_city"
                  placeholder="e.g., San Francisco"
                  {...register('location_city')}
                  className={errors.location_city ? 'border-red-500' : ''}
                />
                {errors.location_city && (
                  <p className="text-sm text-red-500">{errors.location_city.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location_country">Country</Label>
                <Input
                  id="location_country"
                  placeholder="e.g., USA"
                  {...register('location_country')}
                  className={errors.location_country ? 'border-red-500' : ''}
                />
                {errors.location_country && (
                  <p className="text-sm text-red-500">{errors.location_country.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Social Links
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSocial({ platform: 'instagram', url: '', username: '' })}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Link
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded">
                <div>
                  <Label>Platform</Label>
                  <Select
                    value={watch(`social_links.${index}.platform`)}
                    onValueChange={(value) => setValue(`social_links.${index}.platform`, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map(platform => (
                        <SelectItem key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>URL</Label>
                  <Input 
                    placeholder="https://instagram.com/username"
                    {...register(`social_links.${index}.url`)} 
                  />
                </div>
                <div>
                  <Label>Username</Label>
                  <Input 
                    placeholder="@username"
                    {...register(`social_links.${index}.username`)} 
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSocial(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Services
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendService({ name: '', description: '', price: '' })}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Service
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Service {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Service Name</Label>
                    <Input 
                      placeholder="e.g., UI/UX Design"
                      {...register(`services.${index}.name`)} 
                    />
                  </div>
                  <div>
                    <Label>Price (Optional)</Label>
                    <Input 
                      placeholder="e.g., From $500"
                      {...register(`services.${index}.price`)} 
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe what this service includes..."
                    {...register(`services.${index}.description`)} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessHourFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label>{field.day}</Label>
                </div>
                <div>
                  <Input 
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    {...register(`business_hours.${index}.hours`)} 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`open-${index}`}
                    checked={watch(`business_hours.${index}.is_open`)}
                    onCheckedChange={(checked) => 
                      setValue(`business_hours.${index}.is_open`, checked as boolean)
                    }
                  />
                  <Label htmlFor={`open-${index}`}>Open</Label>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gallery */}
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Upload Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleGalleryChange(e.target.files)}
              />
            </div>
            {(existingGalleryImages.length > 0 || galleryPreviews.length > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingGalleryImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative">
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 p-1 h-6 w-6"
                      onClick={() => removeGalleryImage(index, true)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                {galleryPreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative">
                    <img
                      src={preview}
                      alt={`New gallery ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 p-1 h-6 w-6"
                      onClick={() => removeGalleryImage(existingGalleryImages.length + index, false)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Profile' : 'Create Profile')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};