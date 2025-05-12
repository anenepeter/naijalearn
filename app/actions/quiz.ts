'use server';

import { createClient } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

interface StoreQuizAttemptParams {
  quizId: string;
  lessonId?: string;
  score: number;
  answersPayload: Record<string, any>;
}

export async function storeQuizAttempt({
  quizId,
  lessonId,
  score,
  answersPayload,
}: StoreQuizAttemptParams) {
  const supabase = createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.user) {
    console.error('Error fetching user for quiz attempt:', userError);
    throw new Error('User not authenticated.');
  }

  const { data, error } = await supabase.from('quiz_attempts').insert([
    {
      user_id: user.user.id,
      quiz_id: quizId,
      lesson_id: lessonId,
      score: score,
      answers_payload: answersPayload,
    },
  ]);

  if (error) {
    console.error('Error storing quiz attempt:', error);
    throw new Error('Failed to store quiz attempt.');
  }

  // Optionally revalidate paths related to progress if needed
  if (lessonId) {
     // revalidatePath(`/courses/${courseSlug}/lessons/${lessonId}`); // Need courseSlug
     // revalidatePath('/dashboard');
  }


  console.log('Quiz attempt stored successfully:', data);

  return { success: true, data };
}