import React from 'react';
import { useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ModernProfileCard } from './ModernProfileCard';
import { SEOHead } from './SEOHead';
import { ThemeToggle } from '../ThemeToggle';
import { usePublicProfile } from '../../hooks/usePublicProfile';
import { Button } from '../ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { profile, loading, error } = usePublicProfile(username);

  const profileUrl = `${window.location.origin}/u/${username}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
            <ExternalLink className="w-12 h-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Profile Not Found</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-500">
        <SEOHead profile={profile} profileUrl={profileUrl} />
        
        {/* Fixed Top Bar with Theme Toggle */}
        <div className="fixed top-0 right-0 z-50 p-4">
          <ThemeToggle />
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-in fade-in duration-1000">
            <ModernProfileCard profile={profile} profileUrl={profileUrl} />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t bg-background/50 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p>Powered by Profile Card • Share your professional presence</p>
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
};