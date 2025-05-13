'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  courseSlug: string;
  courseStructure: Module[];
  activeLessonSlug?: string;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseSlug,
  courseStructure,
  activeLessonSlug,
}) => {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Course Structure</h2>
      <ul>
        {courseStructure.map((module) => (
          <li key={module._id} className="mb-2">
            <div
              className="flex justify-between items-center cursor-pointer py-1"
              onClick={() => toggleModule(module._id)}
            >
              <span className="font-semibold">{module.title}</span>
              <span>{expandedModules.includes(module._id) ? '-' : '+'}</span>
            </div>
            {expandedModules.includes(module._id) && (
              <ul className="ml-4">
                {module.lessons.map((lesson) => (
                  <li key={lesson._id} className="py-1">
                    <Link
                      href={`/courses/${courseSlug}/lessons/${lesson.slug}`}
                      className={`block ${
                        activeLessonSlug !== undefined && activeLessonSlug === lesson.slug.current
                          ? 'text-blue-600 font-bold'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSidebar;