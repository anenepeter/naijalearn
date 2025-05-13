import React from 'react';
import { PortableText } from '@portabletext/react';

interface LessonContentProps {
  content: any; // Portable Text
}

const LessonContent: React.FC<LessonContentProps> = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div className="prose max-w-none mb-6">
      <PortableText value={content} />
    </div>
  );
};

export default LessonContent;