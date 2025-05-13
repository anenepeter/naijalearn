// app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/lib/sanityClient';
import { lessonDetailQuery } from '@/lib/sanityQueries';
import { PortableText } from '@portabletext/react';
import { markLessonComplete } from '@/app/actions/progress';
import QuizPlayer from '@/components/features/quiz/QuizPlayer';
import CourseSidebar from '@/components/features/courses/CourseSidebar';
import LessonVideo from '@/components/features/lessons/LessonVideo';
import LessonContent from '@/components/features/lessons/LessonContent';
import LessonResources from '@/components/features/lessons/LessonResources';
import LessonNavigation from '@/components/features/lessons/LessonNavigation';

interface LessonPageProps {
  params: {
    courseSlug: string;
    lessonSlug: string;
  };
}

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  content: any; // Portable Text
  videoUrl?: string;
  downloadableResources?: { _key: string; asset: { url: string; originalFilename: string } }[];
  quiz?: { _id: string; title: string };
}

interface CourseStructure {
  _id: string;
  title: string;
  slug: { current: string };
  lessons: { _id: string; title: string; slug: { current: string } }[];
}

interface LessonData {
  title: string;
  currentLesson: Lesson;
  courseStructure: CourseStructure[];
}

const LessonPage: React.FC<LessonPageProps> = ({ params }) => {
  const { courseSlug, lessonSlug } = params;
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await client.fetch<LessonData>(lessonDetailQuery, { courseSlug, lessonSlug });
        if (data && data.currentLesson) {
          setLessonData(data);
        } else {
          setError('Lesson not found');
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseSlug, lessonSlug]);

  const handleMarkComplete = async () => {
    try {
      await markLessonComplete(currentLesson._id, courseSlug);
      // Optionally, add user feedback here (e.g., a toast notification)
      console.log('Lesson marked complete!');
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
      // Optionally, display an error message to the user
    }
  };


  if (loading) {
    return <div>Loading lesson...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!lessonData || !lessonData.currentLesson) {
    return <div>Lesson not found.</div>;
  }

  const { currentLesson, courseStructure } = lessonData;

  // Find current lesson index and module index for navigation
  let currentLessonIndex = -1;
  let currentModuleIndex = -1;
  let previousLesson = null;
  let nextLesson = null;

  courseStructure.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      if (lesson.slug.current === lessonSlug) {
        currentLessonIndex = lessonIndex;
        currentModuleIndex = moduleIndex;
      }
    });
  });

  if (currentModuleIndex !== -1 && currentLessonIndex !== -1) {
    // Determine previous lesson
    if (currentLessonIndex > 0) {
      previousLesson = courseStructure[currentModuleIndex].lessons[currentLessonIndex - 1];
    } else if (currentModuleIndex > 0) {
      const previousModule = courseStructure[currentModuleIndex - 1];
      previousLesson = previousModule.lessons[previousModule.lessons.length - 1];
    }

    // Determine next lesson
    if (currentLessonIndex < courseStructure[currentModuleIndex].lessons.length - 1) {
      nextLesson = courseStructure[currentModuleIndex].lessons[currentLessonIndex + 1];
    } else if (currentModuleIndex < courseStructure.length - 1) {
      const nextModule = courseStructure[currentModuleIndex + 1];
      nextLesson = nextModule.lessons[0];
    }
  }


  return (
    <div className="flex flex-col md:flex-row container mx-auto p-4">
      {/* Course Structure Sidebar */}
      {courseStructure && (
        <div className="md:w-1/4 md:mr-8 mb-8 md:mb-0">
          <CourseSidebar
            courseSlug={courseSlug}
            courseStructure={courseStructure}
            activeLessonSlug={lessonSlug}
          />
        </div>
      )}

      {/* Main Lesson Content */}
      <div className="md:w-3/4">
        <h1 className="text-3xl font-bold mb-4">{currentLesson.title}</h1>

        <LessonVideo videoUrl={currentLesson.videoUrl} />

        <LessonContent content={currentLesson.content} />

        <LessonResources resources={currentLesson.downloadableResources} />

        {currentLesson.quiz && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Quiz</h2>
            {/* Render the QuizPlayer component */}
            <QuizPlayer quizId={currentLesson.quiz._id} lessonId={currentLesson._id} />
          </div>
        )}

        <button
          onClick={handleMarkComplete}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Mark Complete
        </button>

        <LessonNavigation
          courseSlug={courseSlug}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
        />

      </div>
    </div>
  );
};

export default LessonPage;