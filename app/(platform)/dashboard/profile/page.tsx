'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAppSelector } from '@/store/hooks';

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);
  const [profile, setProfile] = useState<any | null>(null); // Replace 'any' with your profile type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // Add message state
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, bio, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setProfile(data);
          setFullName(data?.full_name || '');
          setBio(data?.bio || '');
          setAvatarUrl(data?.avatar_url || null);
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
        avatar_url: avatarUrl, // Handle avatar upload separately
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        setError(error.message);
      } else {
        // Profile updated successfully, maybe refetch or update local state
        setMessage('Profile updated successfully!'); // Need to add message state
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        {/* Add avatar upload input here later */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>

        {message && <p className="text-center text-sm mt-4 text-green-600">{message}</p>} {/* Display message */}
      </form>
    </div>
  );
}