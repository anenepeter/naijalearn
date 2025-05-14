import { groq } from 'next-sanity';
import { client } from './sanityClient';

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

// Query to fetch all map locations
export const mapLocationsQuery = groq`
  *[_type == "mapLocation"]{
    _id,
    name,
    coordinates,
    description,
    cultural_significance,
    media
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

// Query to fetch a single matching activity by ID or slug
export const matchingActivityQuery = groq`
  *[_type == "matchingActivity" && (_id == $id || slug.current == $slug)][0]{
    _id,
    title,
    instruction,
    pairs[]{
      _key,
      itemA_text,
      itemA_image,
      itemB_text,
      itemB_image
    }
  }
`;

// Query to fetch a single recipe by slug
export const recipeDetailQuery = groq`
  *[_type == "recipe" && slug.current == $slug][0]{
    _id,
    title,
    description,
    image,
    prep_time,
    cook_time,
    servings,
    ingredients,
    steps,
    cuisine_type
  }
`;

// Function to fetch a single matching activity
export async function getMatchingActivity(idOrSlug: string) {
  const query = matchingActivityQuery;
  const params = idOrSlug.startsWith('drafts.') ? { id: idOrSlug, slug: null } : { id: null, slug: idOrSlug };
  const activity = await client.fetch(query, params);
  return activity;
}

// Function to fetch a single recipe by slug
export async function getRecipe(slug: string) {
  const query = recipeDetailQuery;
  const params = { slug };
  const recipe = await client.fetch(query, params);
  return recipe;
}

// Query to fetch all matching activities
export const allMatchingActivitiesQuery = groq`
  *[_type == "matchingActivity"]{
    _id,
    title,
    instruction,
    pairs[]{
      _key,
      itemA_text,
      itemA_image,
      itemB_text,
      itemB_image
    }
  }
`;

// Function to fetch all matching activities
export async function getAllMatchingActivities() {
  const query = allMatchingActivitiesQuery;
  const activities = await client.fetch(query);
  return activities;
}

// Query to fetch all language terms
export const languageTermsQuery = groq`
  *[_type == "languageTerm"]{
    _id,
    term,
    language,
    phonetic_transcription,
    audio_pronunciation{
      asset->{
        _id,
        url
      }
    },
    meaning,
    category
  }
`;

// Function to fetch all language terms
export async function getAllLanguageTerms() {
  const query = languageTermsQuery;
  const terms = await client.fetch(query);
  return terms;
}

// Query to fetch the first recipe (e.g., for a featured section)
export const firstRecipeQuery = groq`
  *[_type == "recipe"] | order(_createdAt asc)[0]{
    _id,
    title,
    description,
    image,
    prep_time,
    cook_time,
    servings,
    ingredients,
    steps,
    cuisine_type
  }
`;

// Function to fetch the first recipe
export async function getFirstRecipe() {
  const query = firstRecipeQuery;
  const recipe = await client.fetch(query);
  return recipe;
}