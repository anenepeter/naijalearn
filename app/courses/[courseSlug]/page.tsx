'use client'; // This page needs client-side interactivity for enrollment

import { useState, useEffect } from 'react'; // Import useState and useEffect
import { client } from '@/lib/sanityClient';
import { courseDetailQuery, courseSlugsQuery } from '@/lib/sanityQueries';
import { PortableText } from '@portabletext/react'; // To render rich text content
import Image from 'next/image'; // For optimized images
import Link from 'next/link'; // For navigation
import { supabase } from '@/lib/supabaseClient'; // Import supabase client
import { useAppSelector } from '@/store/hooks'; // Import Redux hook

// Define a type for the fetched course data (basic structure)
interface Course {
  _id: string;
  title: string;
  courseSlug: { current: string };
  description?: string;
  mainImage?: any; // Replace 'any' with a proper Sanity image type later
  category?: { title: string };
  difficulty?: string;
  instructor?: { name: string; bio?: string; picture?: any }; // Replace 'any' with image type
  modules?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    lessons?: Array<{
      _id: string;
      title: string;
      slug: { current: string };
      videoUrl?: string;
      downloadableResources?: Array<{ _key: string; name: string; file?: any; url?: string }>; // Replace 'any' with file type
      quiz?: { _id: string; title: string };
    }>;
  }>;
}

// Generate static paths for all courses based on their slugs
export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(courseSlugsQuery);
  return slugs.map((slug) => ({ courseSlug: slug }));
}

// Fetch course data on the server
async function getCourse(courseSlug: string): Promise<Course> {
  const course: Course = await client.fetch(courseDetailQuery, { courseSlug });
  return course;
}


export default function CourseDetailPage({ params }: { params: { courseSlug: string } }) {
  const { courseSlug } = params;
  const [course, setCourse] = useState<Course | null>(null); // Use state for course data
  const [loading, setLoading] = useState(true); // Add loading state
  const [enrollmentStatus, setEnrollmentStatus] = useState<'not_enrolled' | 'enrolled' | 'loading'>('loading'); // Track enrollment status

  const [message, setMessage] = useState<string | null>(null); // Add message state
  const [isErrorMessage, setIsErrorMessage] = useState(false); // Add state to track if message is an error

  const { user } = useAppSelector((state) => state.auth); // Get user from Redux
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedCourse = await getCourse(courseSlug);
      setCourse(fetchedCourse);
      setLoading(false);

      // Check enrollment status if user is logged in
      if (user && fetchedCourse) {
        const { data, error } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_sanity_id', fetchedCourse._id)
          .single();

        if (data) {
          setEnrollmentStatus('enrolled');
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
           console.error('Error checking enrollment:', error);
           setEnrollmentStatus('not_enrolled'); // Assume not enrolled on other errors
        }
         else {
          setEnrollmentStatus('not_enrolled');
        }
      } else {
         setEnrollmentStatus('not_enrolled');
      }
    };    fetchData();
  }, [courseSlug, user]); // Refetch if courseSlug or user changes

  const handleEnroll = async () => {
    if (!user) {
      setMessage('Please log in to enroll in this course.');
      return;
    }

    if (!course) {
       setMessage('Course data not available for enrollment.');
       return;
    }

    setEnrollmentStatus('loading');
    setMessage(null);

    const { error } = await supabase.from('enrollments').insert([
      {
        user_id: user.id,
        course_sanity_id: course._id,
      },
    ]);

    if (error) {
      setMessage('Error enrolling in course: ' + error.message);
      setIsErrorMessage(true); // Set to true on error
      setEnrollmentStatus('not_enrolled');
    } else {
      setMessage('Successfully enrolled in course!');
      setIsErrorMessage(false); // Set to false on success
      setEnrollmentStatus('enrolled');
    }
  };

  if (loading || enrollmentStatus === 'loading') {
    return <div>Loading course details...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      {course.mainImage && (
        <div className="relative w-full h-64 mb-6">
          {/* Replace with Sanity image URL builder later */}
          <Image
            src="/placeholder-course-image.jpg" // Use a placeholder image for now
            alt={course.title}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      {course.category && <p className="text-sm text-gray-600 mb-2">Category: {course.category.title}</p>}
      {course.difficulty && <p className="text-sm text-gray-600 mb-6">Difficulty: {course.difficulty}</p>}

      <div className="prose max-w-none mb-8">
        {/* Render rich text description */}
        {course.description && <p>{course.description}</p>} {/* Simple paragraph for now, use PortableText if description is rich text */}
      </div>

      {/* Enrollment Button */}
      {enrollmentStatus === 'not_enrolled' && (
        <button
          onClick={handleEnroll}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-8 disabled:opacity-50"
          disabled={!user || enrollmentStatus !== 'not_enrolled'}
        >
          Enroll in Course (Free)
        </button>
      )}
       {enrollmentStatus === 'enrolled' && (
        <p className="text-green-600 font-semibold mb-8">You are enrolled in this course!</p>
      )}


      {message && <p className={`text-center text-sm mt-4 ${isErrorMessage ? 'text-red-600' : 'text-green-600'}`} >{message}</p>} {/* Display messages */}


      {course.modules && course.modules.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
          {course.modules.map((module) => (
            <div key={module._id} className="mb-6 border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
              {module.lessons && module.lessons.length > 0 && (
                <ul>
                  {module.lessons.map((lesson) => (
                    <li key={lesson._id} className="mb-2">
                      <Link href={`/courses/${course.courseSlug.current}/lessons/${lesson.slug.current}`} className="text-blue-600 hover:underline">
                        {lesson.title}
                      </Link>
                      {lesson.quiz && <span className="ml-2 text-sm text-gray-500">(Quiz)</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {course.instructor && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Instructor</h2>
          <div className="flex items-center">
            {course.instructor.picture && (
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                 {/* Replace with Sanity image URL builder later */}
                <Image
                  src="/placeholder-avatar.jpg" // Use a placeholder image
                  alt={course.instructor.name}
                  width={64}
                  height={64}
                  objectFit="cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
              {course.instructor.bio && <p className="text-gray-700">{course.instructor.bio}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Add sections for reviews, ratings, etc. later */}
    </main>
  );
}