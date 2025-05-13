import React from 'react';
import Link from 'next/link';

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
}

interface LessonNavigationProps {
  courseSlug: string;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
}

const LessonNavigation: React.FC<LessonNavigationProps> = ({ courseSlug, previousLesson, nextLesson }) => {
  return (
    <div className="flex justify-between mt-8">
      {previousLesson && (
        <Link href={`/courses/${courseSlug}/lessons/${previousLesson.slug.current}`} className="text-blue-600 hover:underline">
          ← Previous Lesson: {previousLesson.title}
        </Link>
      )}
      {nextLesson && (
        <Link href={`/courses/${courseSlug}/lessons/${nextLesson.slug.current}`} className="text-blue-600 hover:underline">
          Next Lesson: {nextLesson.title} →
        </Link>
      )}
    </div>
  );
};

export default LessonNavigation;