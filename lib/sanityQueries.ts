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
  *[_type == "course" && slug.current == $slug][0]{
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