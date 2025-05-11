import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block', // Portable Text for rich content
        },
        {
          type: 'image', // Allow embedding images within content
          options: { hotspot: true },
        },
        // Add other block types as needed (e.g., code, quotes)
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'URL of an embedded video (e.g., YouTube, Vimeo)',
    }),
    defineField({
      name: 'downloadableResources',
      title: 'Downloadable Resources',
      type: 'array',
      of: [
        {
          type: 'file', // Allow uploading files
          title: 'File',
        },
        {
          type: 'object', // Allow linking to external URLs
          title: 'External Link',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'quiz',
      title: 'Quiz',
      type: 'reference',
      to: [{ type: 'quiz' }], // Reference to a 'quiz' schema (to be created)
    }),
  ],
});