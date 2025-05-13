import React from 'react';
import ReactPlayer from 'react-player';

interface LessonVideoProps {
  videoUrl?: string;
}

const LessonVideo: React.FC<LessonVideoProps> = ({ videoUrl }) => {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="mb-6">
      <ReactPlayer url={videoUrl} controls width="100%" />
    </div>
  );
};

export default LessonVideo;