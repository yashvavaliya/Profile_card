import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { ProfileData } from '../../types/profile';

interface ProfileHeaderProps {
  profile: ProfileData;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  return (
    <div className="relative overflow-hidden rounded-t-xl">
      {/* Cover Image */}
      <div className="h-48 md:h-64 relative">
        <img
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      
      {/* Profile Content */}
      <div className="relative px-6 md:px-8 pb-6">
        {/* Profile Image */}
        <div className="flex justify-center -mt-16 md:-mt-20 mb-4">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-background overflow-hidden shadow-xl">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-background rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Name and Tagline */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground animate-in slide-in-from-bottom-4 duration-500">
            {profile.name}
          </h1>
          <p className="text-muted-foreground text-lg animate-in slide-in-from-bottom-6 duration-700">
            {profile.tagline}
          </p>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-in slide-in-from-bottom-8 duration-900">
            <MapPin className="w-4 h-4" />
            <span>{profile.location.city}, {profile.location.country}</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex justify-center mt-4 animate-in slide-in-from-bottom-10 duration-1100">
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-3 py-1">
            Available for Projects
          </Badge>
        </div>
      </div>
    </div>
  );
};