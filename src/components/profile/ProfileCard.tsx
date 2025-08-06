import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileHeader } from './ProfileHeader';
import { ProfileBio } from './ProfileBio';
import { SocialMedia } from './SocialMedia';
import { BusinessDetails } from './BusinessDetails';
import { ImageGallery } from './ImageGallery';
import { ExternalLink } from 'lucide-react';
import { ProfileData } from '../../types/profile';

interface ProfileCardProps {
  profile: ProfileData;
  showPublicLink?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, showPublicLink = false }) => {
  const publicUrl = `${window.location.origin}/u/${(profile as any).username || profile.id}`;

  const handleViewPublic = () => {
    window.open(publicUrl, '_blank');
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Main Profile Card */}
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-500 mb-8">
        <ProfileHeader profile={profile} />
        {showPublicLink && (
          <div className="px-6 pb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewPublic}
              className="w-full flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Profile
            </Button>
          </div>
        )}
      </Card>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Bio and Social */}
        <div className="lg:col-span-1 space-y-6 flex flex-col items-center lg:items-stretch">
          <ProfileBio profile={profile} />
          <SocialMedia socialLinks={profile.socialLinks} />
        </div>
        
        {/* Right Column - Business Details and Gallery */}
        <div className="lg:col-span-2 space-y-6 flex flex-col items-center lg:items-stretch">
          <BusinessDetails profile={profile} />
          <ImageGallery images={profile.gallery} title="Gallery" showOnlyThree={true} />
        </div>
      </div>
    </div>
  );
};