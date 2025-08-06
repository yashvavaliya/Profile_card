import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Instagram, 
  Linkedin, 
  MessageCircle, 
  Mail, 
  Twitter, 
  Facebook, 
  Youtube 
} from 'lucide-react';
import { SocialLink } from '../../types/profile';

interface SocialMediaProps {
  socialLinks: SocialLink[];
}

const socialIcons = {
  instagram: Instagram,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  email: Mail,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
};

const socialColors = {
  instagram: 'hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/20 dark:hover:text-pink-400',
  linkedin: 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
  whatsapp: 'hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400',
  email: 'hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400',
  twitter: 'hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/20 dark:hover:text-sky-400',
  facebook: 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
  youtube: 'hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400',
};

export const SocialMedia: React.FC<SocialMediaProps> = ({ socialLinks }) => {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-md lg:max-w-none">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-foreground text-center lg:text-left">Connect</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 justify-items-center lg:justify-items-stretch">
          {socialLinks.map((link) => {
            const IconComponent = socialIcons[link.platform];
            const colorClass = socialColors[link.platform];
            
            return (
              <Button
                key={link.platform}
                variant="outline"
                size="sm"
                asChild
                className={`transition-all duration-300 ${colorClass} transform hover:scale-105 active:scale-95`}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="capitalize truncate">{link.platform}</span>
                </a>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};