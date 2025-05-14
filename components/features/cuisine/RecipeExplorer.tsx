import React from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { urlForImage } from '@/lib/sanityClient'; // Assuming urlForImage is available for image URLs

interface Recipe {
  _id: string;
  title: string;
  description: string;
  image: any; // Sanity image type
  prep_time?: string;
  cook_time?: string;
  servings?: string;
  ingredients?: string[];
  steps: any[]; // Portable Text type
  cuisine_type?: string;
}

interface RecipeExplorerProps {
  recipe: Recipe;
}

const RecipeExplorer: React.FC<RecipeExplorerProps> = ({ recipe }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      {recipe.image && (
        <div className="relative w-full h-64 mb-6">
          <Image
            src={urlForImage(recipe.image).url()}
            alt={recipe.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-md"
          />
        </div>
      )}
      <p className="text-lg mb-6">{recipe.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {recipe.prep_time && <p><strong>Prep Time:</strong> {recipe.prep_time}</p>}
        {recipe.cook_time && <p><strong>Cook Time:</strong> {recipe.cook_time}</p>}
        {recipe.servings && <p><strong>Servings:</strong> {recipe.servings}</p>}
        {recipe.cuisine_type && <p><strong>Cuisine Type:</strong> {recipe.cuisine_type}</p>}
      </div>

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}

      {recipe.steps && recipe.steps.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
          <div className="prose max-w-none">
            <PortableText value={recipe.steps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeExplorer;