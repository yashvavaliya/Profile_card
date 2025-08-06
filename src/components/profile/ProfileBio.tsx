import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileData } from '../../types/profile';

interface ProfileBioProps {
  profile: ProfileData;
}

export const ProfileBio: React.FC<ProfileBioProps> = ({ profile }) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-md lg:max-w-none">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-3 text-foreground text-center lg:text-left">About</h2>
        <p className="text-muted-foreground leading-relaxed text-center lg:text-left">
          {profile.bio}
        </p>
      </CardContent>
    </Card>
  );
};