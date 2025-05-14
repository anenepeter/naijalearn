import React from 'react';
import RecipeExplorer from '@/components/features/cuisine/RecipeExplorer';
import { getFirstRecipe } from '@/lib/sanityQueries';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  image: any; // Sanity image asset type
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  ingredients?: string[];
  steps?: any[]; // Portable Text
  cuisine_type?: string;
}

export default async function CuisinePage() {
  const recipe: Recipe = await getFirstRecipe();

  if (!recipe) {
    return <div>No recipe found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Explore Nigerian Cuisine</h1>
      <RecipeExplorer recipe={recipe} />
    </div>
  );
}