
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAppSelector } from '@/store/hooks';
import { client } from '@/lib/sanityClient';
import { courseCardQuery } from '@/lib/sanityQueries'; // Use courseCardQuery for enrolled courses display
import Link from 'next/link'; // For linking to course pages
import Image from 'next/image'; // For course images

// Define a basic type for enrolled course data
interface EnrolledCourse {
  id: string;
  course_sanity_id: string;
  enrolled_at: string;
  progress_percentage: number;
  // Add Sanity course details here after fetching
  sanityCourse?: {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: any; // Replace 'any' with a proper Sanity image type later
    // Add other fields needed for display
  };
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch enrollment records from Supabase
        const { data: enrollments, error: supabaseError } = await supabase
          .from('enrollments')
          .select('id, course_sanity_id, enrolled_at, progress_percentage')
          .eq('user_id', user.id);

        if (supabaseError) {
          setError(supabaseError.message);
          setLoading(false);
          return;
        }

        if (enrollments && enrollments.length > 0) {
          // Extract Sanity course IDs from enrollments
          const sanityCourseIds = enrollments.map(enrollment => enrollment.course_sanity_id);

          // Fetch corresponding course details from Sanity
          // Using a GROQ query to fetch multiple courses by ID
          const sanityCoursesQuery = `*[_id in [${sanityCourseIds.map(id => `"${id}"`).join(',')}]]{
             _id,
             title,
             slug,
             mainImage
             // Add other fields you need for the dashboard display
           }`;

          const sanityCourses = await client.fetch(sanityCoursesQuery);

          // Merge enrollment data with Sanity course details
          const mergedCourses = enrollments.map(enrollment => {
            const sanityCourse = sanityCourses.find((course: any) => course._id === enrollment.course_sanity_id);
            return {
              ...enrollment,
              sanityCourse,
            };
          });

          setEnrolledCourses(mergedCourses);

        } else {
          setEnrolledCourses([]); // No enrollments found
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user]); // Refetch if user changes

  if (loading) {
    return <div>Loading enrolled courses...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error fetching enrolled courses: {error}</div>;
  }

  if (!user) {
     // This case should be handled by the protected route layout, but fallback is good
     return <div>Please log in to view your dashboard.</div>;
  }


  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
      {enrolledCourses.length === 0 ? (
        <p>You are not currently enrolled in any courses.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((enrolledCourse) => (
            <div key={enrolledCourse.id} className="border rounded-lg overflow-hidden shadow-lg">
              {enrolledCourse.sanityCourse?.mainImage && (
                 <div className="relative w-full h-48">
                   {/* Replace with Sanity image URL builder later */}
                   <Image
                     src="/placeholder-course-image.jpg" // Use a placeholder image
                     alt={enrolledCourse.sanityCourse.title}
                     layout="fill"
                     objectFit="cover"
                   />
                 </div>
               )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{enrolledCourse.sanityCourse?.title || 'Loading...'}</h3>
                <p className="text-sm text-gray-600">Progress: {enrolledCourse.progress_percentage}%</p>
                {enrolledCourse.sanityCourse?.slug && (
                   <Link href={`/courses/${enrolledCourse.sanityCourse.slug.current}`} className="mt-4 inline-block text-blue-600 hover:underline">
                     Resume Learning
                   </Link>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add links to profile settings, etc. */}
      <div className="mt-8">
         <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
           View/Edit Profile
         </Link>
      </div>
    </div>
  );
}