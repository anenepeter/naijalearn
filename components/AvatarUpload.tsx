import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust path as needed
import Image from 'next/image'; // Import Image component

interface AvatarUploadProps {
    userId: string;
    currentAvatarUrl: string | null;
    onUploadSuccess: (newAvatarUrl: string) => void;
}

export default function AvatarUpload({ userId, currentAvatarUrl, onUploadSuccess }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(currentAvatarUrl);

    useEffect(() => {
        // Update preview if currentAvatarUrl prop changes
        setAvatarPreview(currentAvatarUrl);
    }, [currentAvatarUrl]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (!file) return;

        if (!userId) {
            setError("User not identified. Cannot upload avatar.");
            return;
        }

        // Optional: Client-side preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);

        await uploadAvatar(file);
    };

    const uploadAvatar = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `avatar.${fileExt}`; // Consistent naming for easy replacement
            const filePath = `${userId}/${fileName}`; // Path: user_id_folder/avatar.ext

            // 1. Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('avatars') // Your bucket name
                .upload(filePath, file, {
                    cacheControl: '3600', // Cache for 1 hour
                    upsert: true,         // Overwrite if file exists
                });

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            // Note: If your bucket is private, you'd generate a signed URL here.
            // For public buckets, we construct the URL or use getPublicUrl.
            const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(uploadData.path);

            if (!urlData.publicUrl) {
                throw new Error("Could not get public URL for avatar.");
            }
            const newAvatarUrl = urlData.publicUrl;

            // 3. Update user's profile with the new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: newAvatarUrl, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (updateError) throw updateError;

            setAvatarPreview(newAvatarUrl + `?t=${new Date().getTime()}`); // Add timestamp to bust cache for display
            if (onUploadSuccess) {
                onUploadSuccess(newAvatarUrl);
            }
            console.log('Avatar uploaded and profile updated:', newAvatarUrl);

        } catch (e: any) {
            console.error("Upload error:", e);
            setError(e.message || "Failed to upload avatar.");
            // Revert preview if upload failed
            setAvatarPreview(currentAvatarUrl);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4"> {/* Using Tailwind classes */}
            {avatarPreview && typeof avatarPreview === 'string' ? (
                <Image
                    src={avatarPreview}
                    alt="Avatar preview"
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-2 border-gray-300" // Using Tailwind classes
                />
            ) : (
                <div className="w-[150px] h-[150px] rounded-full bg-gray-200 flex justify-center items-center border-2 border-gray-300"> {/* Using Tailwind classes */}
                    No Avatar
                </div>
            )}
            <label htmlFor="avatar-upload" className="cursor-pointer px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"> {/* Using Tailwind classes */}
                {uploading ? 'Uploading...' : 'Change Avatar'}
            </label>
            <input
                type="file"
                id="avatar-upload"
                accept="image/png, image/jpeg, image/gif" // Specify acceptable file types
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden" // Hide the default input, use label for styling
            />
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>} {/* Using Tailwind classes */}
        </div>
    );
}