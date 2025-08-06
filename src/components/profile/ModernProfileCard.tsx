import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MapPin, 
  Clock, 
  Briefcase, 
  User, 
  Share2, 
  Copy, 
  QrCode,
  Download,
  ExternalLink,
  Mail,
  Phone,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  MessageCircle
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { ProfileData } from '../../types/profile';
import { ModernImageGallery } from './ModernImageGallery';
import { toast } from 'sonner';

interface ModernProfileCardProps {
  profile: ProfileData;
  profileUrl: string;
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
  instagram: 'hover:bg-pink-500 hover:text-white',
  linkedin: 'hover:bg-blue-600 hover:text-white',
  whatsapp: 'hover:bg-green-500 hover:text-white',
  email: 'hover:bg-orange-500 hover:text-white',
  twitter: 'hover:bg-sky-500 hover:text-white',
  facebook: 'hover:bg-blue-600 hover:text-white',
  youtube: 'hover:bg-red-600 hover:text-white',
};

export const ModernProfileCard: React.FC<ModernProfileCardProps> = ({ profile, profileUrl }) => {
  const [isQROpen, setIsQROpen] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success('Profile URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile`,
          text: `Check out ${profile.name}'s profile`,
          url: profileUrl,
        });
      } catch (error) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 256;
    canvas.height = 256;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${profile.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysHours = profile.businessHours.find(
    (day) => day.day.toLowerCase() === currentDay.toLowerCase()
  );

  const hasContent = {
    bio: profile.bio && profile.bio.trim().length > 0,
    location: profile.location.address || profile.location.city || profile.location.country,
    services: profile.services && profile.services.length > 0,
    businessHours: profile.businessHours && profile.businessHours.length > 0,
    gallery: profile.gallery && profile.gallery.length > 0,
    socialLinks: profile.socialLinks && profile.socialLinks.length > 0,
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Hero Section with Cover and Profile */}
      <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 md:h-64 lg:h-80 relative overflow-hidden">
            {profile.coverImage ? (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          {/* Profile Content */}
          <div className="relative px-6 md:px-8 pb-8">
            {/* Profile Image */}
            <div className="flex justify-center -mt-16 md:-mt-20 mb-6">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-background overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-background rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Name and Details */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground animate-in slide-in-from-bottom-4 duration-500">
                  {profile.name}
                </h1>
                {profile.tagline && (
                  <p className="text-lg md:text-xl text-muted-foreground animate-in slide-in-from-bottom-6 duration-700">
                    {profile.tagline}
                  </p>
                )}
              </div>
              
              {/* Location */}
              {hasContent.location && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground animate-in slide-in-from-bottom-8 duration-900">
                  <MapPin className="w-5 h-5" />
                  <span>
                    {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
              
              {/* Status Badge */}
              <div className="flex justify-center animate-in slide-in-from-bottom-10 duration-1100">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-4 py-2 text-sm">
                  {todaysHours?.isOpen ? 'Available Today' : 'Available for Projects'}
                </Badge>
              </div>

              {/* Share Profile Button */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4 animate-in slide-in-from-bottom-12 duration-1300">
                <Button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </Button>
                
                <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-center">Share QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-6 bg-white rounded-lg shadow-sm">
                        <QRCode
                          id="qr-code-svg"
                          value={profileUrl}
                          size={200}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                          viewBox="0 0 256 256"
                        />
                      </div>
                      <div className="flex gap-2 w-full">
                        <Button onClick={handleCopyUrl} variant="outline" className="flex-1">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button onClick={downloadQRCode} className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      {hasContent.socialLinks && (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom duration-500 delay-200">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Connect With Me</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {profile.socialLinks.map((link, index) => {
                  const IconComponent = socialIcons[link.platform];
                  const colorClass = socialColors[link.platform];
                  
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="lg"
                      asChild
                      className={`transition-all duration-300 transform hover:scale-110 ${colorClass} border-2`}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3"
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="capitalize font-medium">{link.platform}</span>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* About Section */}
      {hasContent.bio && (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom duration-500 delay-300">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">About Me</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl mx-auto">
                {profile.bio}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Section */}
      {hasContent.services && (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom duration-500 delay-400">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Briefcase className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {profile.services.map((service, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl hover:from-muted/50 hover:to-muted/70 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-foreground text-lg">{service.name}</h3>
                        {service.price && (
                          <Badge variant="secondary" className="text-sm font-medium">
                            {service.price}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Hours Section */}
      {hasContent.businessHours && (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom duration-500 delay-500">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Business Hours</h2>
                  {todaysHours && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${todaysHours.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm text-muted-foreground">
                        {todaysHours.isOpen ? 'Open' : 'Closed'} today
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="max-w-md mx-auto space-y-3">
                {profile.businessHours.map((day, index) => (
                  <div 
                    key={index}
                    className={`flex justify-between items-center p-4 rounded-lg transition-all duration-200 ${
                      day.day.toLowerCase() === currentDay.toLowerCase()
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <span className="font-medium text-foreground">{day.day}</span>
                    <span className={`${day.isOpen ? 'text-muted-foreground' : 'text-red-500'} font-medium`}>
                      {day.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Section */}
      {hasContent.gallery && (
        <div className="animate-in slide-in-from-bottom duration-500 delay-600">
          <ModernImageGallery images={profile.gallery} />
        </div>
      )}
    </div>
  );
};