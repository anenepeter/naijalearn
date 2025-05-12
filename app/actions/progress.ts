'use server';

import { supabase } from '@/lib/supabaseClient';

export async function markLessonComplete(lessonId: string, courseId: string) {
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.user) {
    console.error('Error getting user:', userError?.message);
    return { success: false, error: 'User not authenticated' };
  }

  const userId = user.user.id;

  // Upsert the lesson progress
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        course_id: courseId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, lesson_id' } // Specify the unique constraint for upsert
    );

  if (error) {
    console.error('Error marking lesson complete:', error.message);
    return { success: false, error: error.message };
  }

  console.log(`Lesson ${lessonId} marked complete for user ${userId}`);
  return { success: true, data };
}