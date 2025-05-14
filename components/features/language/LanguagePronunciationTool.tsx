'use client';

import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

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

interface LanguagePronunciationToolProps {
  terms: LanguageTerm[];
}

const LanguagePronunciationTool: React.FC<LanguagePronunciationToolProps> = ({ terms }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  const playAudio = (audioUrl: string) => {
    const audio = audioRefs.current.find(audio => audio.id === audioUrl);

    if (!audio) {
      console.error("Audio element not found for URL:", audioUrl);
      toast.error("Audio element not found.");
      return;
    }

    if (playingAudio === audioUrl) {
      // If the same audio is playing, pause it
      audio.pause();
      setPlayingAudio(null);
    } else {
      // Stop currently playing audio if any
      if (playingAudio) {
        const currentAudio = audioRefs.current.find(audio => audio.id === playingAudio);
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      // Play the new audio
      setLoadingAudio(audioUrl);
      audio.playbackRate = playbackSpeed; // Set playback speed
      audio.play().then(() => {
        setPlayingAudio(audioUrl);
        setLoadingAudio(null);
      }).catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Error playing audio.");
        setPlayingAudio(null); // Reset state on error
        setLoadingAudio(null);
      });

      audio.onended = () => {
        setPlayingAudio(null);
      };
      audio.onerror = (event) => {
        console.error("Audio error:", event);
        toast.error("Audio playback error.");
        setPlayingAudio(null); // Reset state on error
        setLoadingAudio(null);
      };
       audio.oncanplaythrough = () => {
        if (loadingAudio === audioUrl) {
          setLoadingAudio(null);
        }
      };
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Language Pronunciation Tool</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {terms.map((term) => {
          const audioUrl = term.audio_pronunciation?.asset?.url;
          return (
            <div key={term._id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold">{term.term}</h3>
              <p className="text-gray-600">Language: {term.language}</p>
              {term.phonetic_transcription && (
                <p className="text-gray-500 italic">{term.phonetic_transcription}</p>
              )}
              {term.meaning && (
                <p className="mt-2"><strong>Meaning:</strong> {term.meaning}</p>
              )}
              {audioUrl && (
                <div className="mt-3 flex items-center space-x-2">
                  {loadingAudio === audioUrl ? (
                    <span className="text-blue-500 flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.908l3-2.617z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : playingAudio === audioUrl ? (
                    <button
                      onClick={() => playAudio(audioUrl)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      aria-label={`Pause pronunciation for ${term.term}`}
                    >
                      Pause Audio
                    </button>
                  ) : (
                    <button
                      onClick={() => playAudio(audioUrl)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      aria-label={`Play pronunciation for ${term.term}`}
                    >
                      Play Audio
                    </button>
                  )}
                  {/* Hidden audio element for controlling playback */}
                  <audio
                    id={audioUrl}
                    src={audioUrl}
                    preload="none"
                    ref={audio => {
                      if (audio) {
                        audioRefs.current.push(audio);
                      }
                    }}
                  ></audio>
                </div>
              )}
              {audioUrl && (
                <div className="mt-2 flex items-center space-x-2">
                  <label htmlFor={`speed-${term._id}`} className="text-sm text-gray-700">Speed:</label>
                  <select
                    id={`speed-${term._id}`}
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="text-sm border rounded p-1"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1.0}>Normal</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguagePronunciationTool;