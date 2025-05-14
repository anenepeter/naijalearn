import { defineField, defineType } from 'sanity';

export const languageTerm = defineType({
  name: 'languageTerm',
  title: 'Language Term',
  type: 'document',
  fields: [
    defineField({
      name: 'term',
      title: 'Term',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'e.g., "Yoruba", "Igbo", "Hausa"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phonetic_transcription',
      title: 'Phonetic Transcription',
      type: 'string',
      description: 'e.g., "[jɔ̀rùbá]"',
    }),
    defineField({
      name: 'audio_pronunciation',
      title: 'Audio Pronunciation',
      type: 'file',
      options: {
        accept: 'audio/*',
      },
      description: 'Upload an audio file for pronunciation.',
    }),
    defineField({
      name: 'meaning',
      title: 'Meaning',
      type: 'text',
      description: 'Meaning or definition of the term.',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string', // Or reference to a category schema if needed
      description: 'e.g., "Greetings", "Food", "Numbers"',
    }),
  ],
});