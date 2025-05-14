import course from './course';
import category from './category';
import instructor from './instructor';
import module from './module';
import lesson from './lesson';
import quiz from './quiz';
import question from './question';
import { languageTerm } from './languageTerm';
import { mapLocation } from './mapLocation';
import { matchingActivity } from './matchingActivity';

import { recipe } from './recipe';

export const schemaTypes = [
  course,
  category,
  instructor,
  module,
  lesson,
  quiz,
  question,
  languageTerm,
  mapLocation,
  matchingActivity,
  recipe,
];
