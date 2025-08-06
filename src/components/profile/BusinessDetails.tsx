import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Briefcase, DollarSign } from 'lucide-react';
import { ProfileData } from '../../types/profile';

interface BusinessDetailsProps {
  profile: ProfileData;
}

export const BusinessDetails: React.FC<BusinessDetailsProps> = ({ profile }) => {
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const todaysHours = profile.businessHours.find(
    (day) => day.day.toLowerCase() === currentDay
  );

  return (
    <div className="space-y-6 w-full max-w-2xl lg:max-w-none">
      {/* Address */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-3 justify-center lg:justify-start">
            <div className="p-2 bg-primary/10 rounded-full">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-foreground mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">{profile.location.address}</p>
              <p className="text-sm text-muted-foreground">
                {profile.location.city}, {profile.location.country}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Briefcase className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground text-center lg:text-left">Services</h3>
          </div>
          <div className="space-y-4">
            {profile.services.map((service, index) => (
              <div 
                key={index}
                className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-foreground text-center lg:text-left">{service.name}</h4>
                  {service.price && (
                    <Badge variant="secondary" className="text-xs">
                      {service.price}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center lg:text-left">{service.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
            <div className="p-2 bg-accent/10 rounded-full">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="font-semibold text-foreground">Business Hours</h3>
              {todaysHours && (
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${todaysHours.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-muted-foreground">
                    {todaysHours.isOpen ? 'Open' : 'Closed'} today
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {profile.businessHours.map((day, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center p-2 rounded transition-colors duration-200 ${
                  day.day.toLowerCase() === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
                    ? 'bg-primary/10' 
                    : 'hover:bg-muted/30'
                }`}
              >
                <span className="text-sm font-medium text-foreground">{day.day}</span>
                <span className={`text-sm ${day.isOpen ? 'text-muted-foreground' : 'text-red-500'}`}>
                  {day.hours}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};