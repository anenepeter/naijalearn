import { supabase } from '@/lib/supabaseClient';
import { client } from '@/lib/sanityClient';
import { lessonDetailQuery, courseLessonsQuery } from '@/lib/sanityQueries';

export async function calculateCourseProgress(userId: string, courseSlug: string): Promise<number> {
  // Fetch all lessons for the course from Sanity
  const lessonsData = await client.fetch<{ lessons: { _id: string }[] }[]>(courseLessonsQuery, { courseSlug });

  if (!lessonsData || lessonsData.length === 0) {
    return 0; // No lessons found for the course
  }

  // Flatten the lessons array from modules
  const allLessons = lessonsData.flatMap(module => module.lessons);
  const totalLessons = allLessons.length;

  if (totalLessons === 0) {
    return 0; // Avoid division by zero
  }

  // Fetch completed lesson IDs for the user and course from Supabase
  const { data: completedLessonsData, error } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseSlug) // Assuming courseSlug is stored as course_id in lesson_progress
    .eq('status', 'completed');

  if (error) {
    console.error('Error fetching completed lessons:', error.message);
    return 0; // Or handle the error appropriately
  }

  const completedLessonIds = new Set(completedLessonsData.map(progress => progress.lesson_id));

  // Calculate the number of completed lessons that are actually part of the course
  const completedLessonsInCourse = allLessons.filter(lesson => completedLessonIds.has(lesson._id)).length;

  const progressPercentage = (completedLessonsInCourse / totalLessons) * 100;

  return Math.round(progressPercentage);
}