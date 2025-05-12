interface SanityDocument {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface Course extends SanityDocument {
  _id: string;
  title: string;
  slug: { current: string };
  description?: any; // Sanity block content
  mainImage?: SanityImage;
  category?: { title: string };
  difficulty?: string;
  instructor?: Instructor;
  modules?: Module[];
}

interface SanityImage {
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

interface Instructor {
  name: string;
  bio?: any; // Sanity block content
  picture?: SanityImage;
}

interface Module {
  _id: string;
  title: string;
  slug: { current: string };
  lessons?: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  slug: { current: string };
  videoUrl?: string;
  downloadableResources?: Resource[];
  quiz?: Quiz;
}

interface Resource {
  _key: string;
  name: string;
  file?: SanityFile;
  url?: string;
}

interface SanityFile {
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

interface Quiz {
  _id: string;
  title: string;
}