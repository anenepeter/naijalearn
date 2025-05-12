// app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { client } from '@/lib/sanityClient';
import { lessonDetailQuery } from '@/lib/sanityQueries';
import { PortableText } from '@portabletext/react';
import ReactPlayer from 'react-player'; // Note: If you encounter TypeScript errors here, you might need to install @types/react-player
import { markLessonComplete } from '@/app/actions/progress';
import QuizPlayer from '@/components/features/quiz/QuizPlayer';

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{currentLesson.title}</h1>

      {currentLesson.videoUrl && (
        <div className="mb-6">
          <ReactPlayer url={currentLesson.videoUrl} controls width="100%" />
        </div>
      )}

      <div className="prose max-w-none mb-6">
        <PortableText value={currentLesson.content} />
      </div>

      {currentLesson.downloadableResources && currentLesson.downloadableResources.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Resources</h2>
          <ul>
            {currentLesson.downloadableResources.map((resource) => (
              <li key={resource._key}>
                <a href={resource.asset.url} download={resource.asset.originalFilename} className="text-blue-600 hover:underline">
                  {resource.asset.originalFilename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentLesson.quiz && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Quiz</h2>
          {/* Render the QuizPlayer component */}
          <QuizPlayer quizId={currentLesson.quiz._id} lessonId={currentLesson._id} />
        </div>
      )}

      <button
        onClick={() => markLessonComplete(currentLesson._id, courseSlug)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Mark Complete
      </button>

      <div className="flex justify-between mt-8">
        {previousLesson && (
          <a href={`/courses/${courseSlug}/lessons/${previousLesson.slug.current}`} className="text-blue-600 hover:underline">
            ← Previous Lesson: {previousLesson.title}
          </a>
        )}
        {nextLesson && (
          <a href={`/courses/${courseSlug}/lessons/${nextLesson.slug.current}`} className="text-blue-600 hover:underline">
            Next Lesson: {nextLesson.title} →
          </a>
        )}
      </div>

      {/* TODO: Integrate Course Structure Sidebar */}
    </div>
  );
};

export default LessonPage;