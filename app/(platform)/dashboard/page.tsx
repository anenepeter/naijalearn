'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAppSelector } from '@/store/hooks';
import { client } from '@/lib/sanityClient';
import { courseCardQuery } from '@/lib/sanityQueries'; // Use courseCardQuery for enrolled courses display
import Link from 'next/link'; // For linking to course pages
import Image from 'next/image'; // For course images
import { calculateCourseProgress } from '@/lib/courseProgress'; // Import the progress calculation function

// Define a basic type for enrolled course data
interface EnrolledCourse {
  id: string;
  course_sanity_id: string;
  enrolled_at: string;
  progress_percentage: number; // This will now hold the calculated progress
  // Add Sanity course details here after fetching
  sanityCourse?: {
    _id: string;
    title: string;
    slug: { current: string };
    mainImage?: any; // Replace 'any' with a proper Sanity image type later
    modules?: Array<{ // Add modules and lessons to the type
      _key: string;
      title: string;
      lessons: Array<{
        _id: string;
        _key: string;
        title: string;
        slug: { current: string };
        _updatedAt: string;
      }>;
    }>;
  };
  lastIncompleteLessonSlug?: string; // Add field for the last incomplete lesson slug
}

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch enrollment records from Supabase
        const { data: enrollments, error: supabaseError } = await supabase
          .from('enrollments')
          .select('id, course_sanity_id, enrolled_at')
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
          const sanityCoursesQuery = `*[_id in [${sanityCourseIds.map(id => `"${id}"`).join(',')}]]{
            _id,
            title,
            slug,
            mainImage,
            modules[] {
              _key,
              title,
              lessons[]->{
                _id,
                _key,
                title,
                slug,
                _updatedAt // Include _updatedAt to potentially order lessons if needed
              }
            }
          }`;

          const sanityCourses = await client.fetch(sanityCoursesQuery);

          // Fetch lesson progress for the user
          const { data: lessonProgress, error: progressError } = await supabase
            .from('lesson_progress')
            .select('lesson_sanity_id, completed')
            .eq('user_id', user.id);

          if (progressError) {
            setError(progressError.message);
            setLoading(false);
            return;
          }

          // Create a map for quick lookup of lesson progress
          const completedLessons = new Set(
            lessonProgress?.filter(lp => lp.completed).map(lp => lp.lesson_sanity_id)
          );

          // Merge enrollment data with Sanity course details, calculate progress, and find last incomplete lesson
          const mergedCoursesWithProgress = await Promise.all(
            enrollments.map(async (enrollment) => {
              const sanityCourse = sanityCourses.find((course: any) => course._id === enrollment.course_sanity_id);
              let progressPercentage = 0;
              let lastIncompleteLessonSlug: string | undefined;

              if (sanityCourse?.slug?.current) {
                progressPercentage = await calculateCourseProgress(user.id, sanityCourse.slug.current);

                // Find the first incomplete lesson
                if (sanityCourse.modules) {
                  for (const module of sanityCourse.modules) {
                    if (module.lessons) {
                      for (const lesson of module.lessons) {
                        if (!completedLessons.has(lesson._id)) {
                          lastIncompleteLessonSlug = lesson.slug.current;
                          break; // Found the first incomplete lesson
                        }
                      }
                    }
                    if (lastIncompleteLessonSlug) break; // Found in a module, break outer loop
                  }
                }

                // If all lessons are completed, link to the first lesson or a completion page
                if (!lastIncompleteLessonSlug && sanityCourse.modules?.[0]?.lessons?.[0]?.slug?.current) {
                   lastIncompleteLessonSlug = sanityCourse.modules[0].lessons[0].slug.current;
                }
              }

              return {
                ...enrollment,
                sanityCourse,
                progress_percentage: progressPercentage,
                lastIncompleteLessonSlug, // Add the determined slug
              };
            })
          );

          setEnrolledCourses(mergedCoursesWithProgress);

        } else {
          setEnrolledCourses([]); // No enrollments found
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })(); // Call the IIFE immediately

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
                 <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                   <div
                     className="bg-blue-600 h-2.5 rounded-full"
                     style={{ width: `${enrolledCourse.progress_percentage}%` }}
                   ></div>
                 </div>
                 <p className="text-sm text-gray-600">Progress: {enrolledCourse.progress_percentage}%</p>
                 {enrolledCourse.sanityCourse?.slug?.current && enrolledCourse.lastIncompleteLessonSlug && (
                    <Link
                      href={`/courses/${enrolledCourse.sanityCourse.slug.current}/lessons/${enrolledCourse.lastIncompleteLessonSlug}`}
                      className="mt-4 inline-block text-blue-600 hover:underline"
                    >
                      {enrolledCourse.progress_percentage === 100 ? 'Review Course' : 'Resume Learning'}
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