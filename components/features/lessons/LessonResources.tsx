import React from 'react';

interface Resource {
  _key: string;
  asset: { url: string; originalFilename: string };
}

interface LessonResourcesProps {
  resources?: Resource[];
}

const LessonResources: React.FC<LessonResourcesProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">Resources</h2>
      <ul>
        {resources.map((resource) => (
          <li key={resource._key}>
            <a href={resource.asset.url} download={resource.asset.originalFilename} className="text-blue-600 hover:underline">
              {resource.asset.originalFilename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonResources;