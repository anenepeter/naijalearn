import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'question',
  title: 'Question',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Question Text',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'questionType',
      title: 'Question Type',
      type: 'string',
      options: {
        list: [
          { title: 'Multiple Choice', value: 'multipleChoice' },
          { title: 'True/False', value: 'trueFalse' },
          // Add other question types as needed
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [
        defineField({
          name: 'option',
          title: 'Option',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'isCorrect',
              title: 'Is Correct',
              type: 'boolean',
            }),
          ],
          preview: {
            select: {
              text: 'text',
              isCorrect: 'isCorrect',
            },
            prepare(selection) {
              const { text, isCorrect } = selection;
              return {
                title: text,
                subtitle: isCorrect ? 'Correct Answer' : '',
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(2), // Require at least two options
    }),
    defineField({
      name: 'explanation',
      title: 'Explanation',
      type: 'array',
      of: [{ type: 'block' }], // Portable Text for rich explanation
      description: 'Optional explanation for the correct answer',
    }),
  ],
});