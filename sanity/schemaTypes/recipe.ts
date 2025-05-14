import { defineField, defineType } from 'sanity';

export const recipe = defineType({
  name: 'recipe',
  title: 'Recipe',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prep_time',
      title: 'Preparation Time',
      type: 'string',
    }),
    defineField({
      name: 'cook_time',
      title: 'Cook Time',
      type: 'string',
    }),
    defineField({
      name: 'servings',
      title: 'Servings',
      type: 'string',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'steps',
      title: 'Instructions',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'cuisine_type',
      title: 'Cuisine Type',
      type: 'string', // Or reference to a cuisine type document if needed
    }),
  ],
});