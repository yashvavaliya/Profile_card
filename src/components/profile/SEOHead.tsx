import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ProfileData } from '../../types/profile';

interface SEOHeadProps {
  profile: ProfileData;
  profileUrl: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ profile, profileUrl }) => {
  const title = `${profile.name} - ${profile.tagline}`;
  const description = profile.bio.length > 160 
    ? `${profile.bio.substring(0, 157)}...` 
    : profile.bio;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.name,
    "jobTitle": profile.tagline,
    "description": profile.bio,
    "image": profile.profileImage,
    "url": profileUrl,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.location.city,
      "addressCountry": profile.location.country,
      "streetAddress": profile.location.address
    },
    "sameAs": profile.socialLinks.map(link => link.url)
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={`${profile.name}, ${profile.tagline}, ${profile.location.city}, ${profile.services.map(s => s.name).join(', ')}`} />
      <meta name="author" content={profile.name} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={profile.coverImage || profile.profileImage} />
      <meta property="og:url" content={profileUrl} />
      <meta property="og:type" content="profile" />
      <meta property="og:site_name" content="Profile Card" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={profile.coverImage || profile.profileImage} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={profileUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};