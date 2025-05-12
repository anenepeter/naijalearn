import { groq } from 'next-sanity';

// Query to fetch a list of courses for display on cards
export const courseCardQuery = groq`
  *[_type == "course"]{
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    category->{
      title
    },
    difficulty,
    instructor->{
      name
    }
  }
`;

// Query to fetch a single course by slug
export const courseDetailQuery = groq`
  *[_type == "course" && slug.current == $courseSlug][0]{
    _id,
    title,
    slug,
    description,
    mainImage,
    category->{
      title
    },
    difficulty,
    instructor->{
      name,
      bio,
      picture
    },
    modules[]->{
      _id,
      title,
      slug,
      lessons[]->{
        _id,
        title,
        slug,
        videoUrl,
        downloadableResources,
        quiz->{
          _id,
          title
        }
      }
    }
  }
`;

// Query to fetch all course slugs for static path generation
export const courseSlugsQuery = groq`
  *[_type == "course" && defined(slug.current)][].slug.current
`;

// Query to fetch all lessons for a course by slug, used for progress calculation
export const courseLessonsQuery = groq`
  *[_type == "course" && slug.current == $courseSlug][0]{
    modules[]->{
      lessons[]->{
        _id
      }
    }
  }.modules
`;

// Query to fetch a single lesson by course and lesson slug, including course structure for navigation
export const lessonDetailQuery = groq`
  *[_type == "course" && slug.current == $courseSlug][0]{
    title,
    "currentLesson": modules[]->{
      lessons[]->{
        _id,
        title,
        slug,
        content, // Portable Text field
        videoUrl,
        downloadableResources[]{
          _key,
          _type,
          asset->{
            _id,
            url,
            originalFilename
          }
        },
        quiz->{
          _id,
          title
        }
      }
    }.lessons[] | [_type == "lesson" && slug.current == $lessonSlug][0],
    "courseStructure": modules[]->{
      _id,
      title,
      slug,
      lessons[]->{
        _id,
        title,
        slug
      }
    }
  }
`;

// Query to fetch a single quiz by ID, including questions and options
export const quizDetailQuery = groq`
  *[_type == "quiz" && _id == $quizId][0]{
    _id,
    title,
    questions[]{
      _key,
      questionText,
      options[]{
        _key,
        text,
        isCorrect,
        explanation
      }
    }
  }
`;