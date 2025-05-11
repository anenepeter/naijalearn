'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAppDispatch } from '@/store/hooks';
import { setAuthLoading, setAuthError, setAuthUser } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Local message for immediate feedback

  const dispatch = useAppDispatch();
  const router = useRouter(); // Initialize useRouter

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setAuthLoading(true));
    setMessage(''); // Clear local message

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      dispatch(setAuthError(error.message));
      setMessage(error.message); // Set local message for form feedback
    } else {
      // Supabase signUp with email confirmation doesn't automatically log in
      // The user will be logged in after clicking the confirmation link
      setMessage('Check your email for the confirmation link!');
      setEmail('');
      setPassword('');
      // Optionally redirect to a confirmation pending page
      // router.push('/auth/confirm');
    }
    dispatch(setAuthLoading(false));
  };

  // Get loading state from Redux store
  // const { isLoading } = useAppSelector((state) => state.auth); // Uncomment and use if needed for button disabled state

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-md">
        <form onSubmit={handleSignup} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              type="submit"
              disabled={/* isLoading || */ false} // Use Redux loading state if uncommented above
            >
              {/* isLoading ? 'Signing Up...' : 'Sign Up' */} {/* Use Redux loading state if uncommented above */}
              Sign Up {/* Placeholder text */}
            </button>
          </div>
          {message && <p className="text-center text-sm mt-4 text-gray-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}