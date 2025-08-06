import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types/database';
import { toast } from 'sonner';

export const ProfileList: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      toast.error('Error fetching profiles');
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProfiles(profiles.filter(p => p.id !== id));
      toast.success('Profile deleted successfully');
    } catch (error) {
      toast.error('Error deleting profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Management
        </h1>
        <Link to="/admin/create">
          <Button>Create New Profile</Button>
        </Link>
      </div>

      {profiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No profiles found. Create your first profile to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                {profile.cover_image && (
                  <img
                    src={profile.cover_image}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden">
                    {profile.profile_image ? (
                      <img
                        src={profile.profile_image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <CardHeader className="pt-12">
                <CardTitle className="text-lg">{profile.name}</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.tagline}
                </p>
                <Badge variant="secondary" className="w-fit">
                  {profile.location_city}, {profile.location_country}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {/* <Link to={`/?profile=${profile.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </Link> */}
                  
                  <Link to={`/u/${profile.username || profile.id}`} target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Public
                    </Button>
                  </Link>
                  <Link to={`/admin/edit/${profile.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProfile(profile.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};