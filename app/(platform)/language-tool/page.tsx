import { getAllLanguageTerms } from '@/lib/sanityQueries';
import LanguagePronunciationTool from '@/components/features/language/LanguagePronunciationTool';

interface LanguageTerm {
  _id: string;
  term: string;
  language: string;
  phonetic_transcription?: string;
  audio_pronunciation?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  meaning?: string;
  category?: string;
}

export default async function LanguageToolPage() {
  const languageTerms = await getAllLanguageTerms();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Language Pronunciation Tool</h1>
      <LanguagePronunciationTool terms={languageTerms} />
    </div>
  );
}