import { defineField, defineType } from 'sanity';

export const mapLocation = defineType({
  name: 'mapLocation',
  title: 'Map Location',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Geographical coordinates (latitude, longitude)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed description of the location',
    }),
    defineField({
      name: 'cultural_significance',
      title: 'Cultural Significance',
      type: 'text',
      description: 'Brief text about the cultural significance',
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'array',
      of: [{ type: 'image' }, { type: 'file' }], // Assuming 'file' can be used for videos or other media
      description: 'Images or videos related to the location',
    }),
  ],
});