import { defineField, defineType } from 'sanity';

export const matchingActivity = defineType({
  name: 'matchingActivity',
  title: 'Cultural Matching Activity',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'instruction',
      title: 'Instruction',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'pairs',
      title: 'Matching Pairs',
      type: 'array',
      of: [
        {
          name: 'matchingPair',
          title: 'Pair',
          type: 'object',
          fields: [
            defineField({
              name: 'itemA_text',
              title: 'Item A (Text)',
              type: 'string',
            }),
            defineField({
              name: 'itemA_image',
              title: 'Item A (Image)',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'itemB_text',
              title: 'Item B (Text)',
              type: 'string',
            }),
            defineField({
              name: 'itemB_image',
              title: 'Item B (Image)',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required().min(1).custom((pairs) => {
          if (!pairs) return true;
          
          for (const pair of pairs as { itemA_text?: string; itemA_image?: any; itemB_text?: string; itemB_image?: any }[]) {
            if (!pair.itemA_text && !pair.itemA_image) {
              return 'Item A must have either text or an image in all pairs';
            }
            if (!pair.itemB_text && !pair.itemB_image) {
              return 'Item B must have either text or an image in all pairs';
            }
          }
          return true;
        }),
    }),
  ],
});