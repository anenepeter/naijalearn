'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAppSelector } from '@/store/hooks';
import Image from 'next/image'; // Import Image component
import AvatarUpload from '@/components/AvatarUpload'; // Import the new component

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<any | null>(null); // Replace 'any' with your profile type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // Add message state
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  // avatarUrl state is now managed by the AvatarUpload component, but we keep it here to pass as prop and update profile state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);


  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching profile for user ID:', user.id); // Log user ID
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, bio, avatar_url')
          .eq('id', user.id); // Remove .single() temporarily for inspection

        console.log('Supabase query result:', data); // Log the raw data result

        if (data && data.length === 1) {
           const profileData = data[0];
           setProfile(profileData);
           setFullName(profileData?.full_name || '');
           setBio(profileData?.bio || '');
           setAvatarUrl(profileData?.avatar_url || null);
        } else if (data && data.length > 1) {
           console.error('Multiple profile rows found for user ID:', user.id);
           setError('Multiple profile entries found.');
        } else {
           console.warn('No profile row found for user ID:', user.id);
           console.log('Attempting to create profile for user ID:', user.id); // Log before creation attempt
           // No profile found, create one
           const { error: createError } = await supabase
             .from('profiles')
             .insert([
               { id: user.id, full_name: '', bio: '', avatar_url: null } // Initialize with default values
             ]);

           if (createError) {
             console.error('Error creating profile:', createError.message);
             setError('Error creating profile.');
           } else {
             // Profile created, refetch it
             fetchProfile(); // Recursively call to fetch the newly created profile
           }
        }

        if (error) {
          setError(error.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);


  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null); // Clear previous messages

    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        bio: bio,
        // avatar_url is handled by the AvatarUpload component
        updated_at: new Date().toISOString(),
      };

      // Handle profile text updates
      const { error: profileError } = await supabase.from('profiles').upsert(updates);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      // Profile updated successfully
      setMessage('Profile updated successfully!');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUploaded = (newAvatarUrl: string) => {
    // Update the avatarUrl state in this component when the AvatarUpload component
    // successfully uploads a new avatar and updates the profile in the database.
    setAvatarUrl(newAvatarUrl);
    setMessage('Avatar updated successfully!');
  };


  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!user) {
    // This case should ideally be handled by the protected route layout,
    // but including a fallback here is good practice.
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={handleUpdateProfile} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="fullName"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bio"
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        {/* Avatar Section */}
        <div className="mb-4">
           <AvatarUpload
             userId={user.id}
             currentAvatarUrl={avatarUrl}
             onUploadSuccess={handleAvatarUploaded}
           />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            type="submit"
            disabled={loading} // Disable while loading
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>

        {message && <p className="text-center text-sm mt-4 text-green-600">{message}</p>} {/* Display message */}
      </form>
    </div>
  );
}