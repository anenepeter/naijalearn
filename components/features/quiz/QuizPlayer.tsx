'use client';

import React, { useState, useEffect } from 'react';
import { sanityClient } from '@/lib/sanityClient';
import { quizDetailQuery } from '@/lib/sanityQueries';
// Import Supabase client and server action here - Placeholder for now
// import { storeQuizAttempt } from '@/app/actions/quiz'; // Need to create this server action

interface QuizPlayerProps {
  quizId: string; // Sanity quiz _id
  lessonId?: string; // Sanity lesson _id (optional)
}

interface Question {
  _key: string;
  _type: 'question';
  questionText: string;
  options: {
    _key: string;
    _type: 'option';
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
}

interface QuizData {
  _id: string;
  _type: 'quiz';
  title: string;
  questions: Question[];
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, lessonId }) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({}); // null: not answered, true: correct, false: incorrect

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fetch quiz data from Sanity
        const data = await sanityClient.fetch<QuizData>(quizDetailQuery, { quizId });
        if (data) {
            setQuizData(data);
        } else {
            setError('Quiz not found.');
        }
      } catch (err) {
        setError('Failed to load quiz.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionKey: string, optionKey: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionKey]: optionKey,
    });
  };

  const handleSubmit = async () => {
    if (!quizData) return;

    let correctCount = 0;
    const attemptAnswers: Record<string, any> = {};
    const newFeedback: Record<string, boolean | null> = {};

    quizData.questions.forEach(question => {
      const selectedOptionKey = userAnswers[question._key];
      const correctOption = question.options.find(opt => opt.isCorrect);

      if (selectedOptionKey && correctOption) {
        const isCorrect = selectedOptionKey === correctOption._key;
        if (isCorrect) {
          correctCount++;
        }
        newFeedback[question._key] = isCorrect;
        attemptAnswers[question._key] = {
          selected: selectedOptionKey,
          correct: correctOption._key,
          isCorrect: isCorrect,
        };
      } else {
         newFeedback[question._key] = null; // Mark as unanswered or incorrect if no option selected
         attemptAnswers[question._key] = {
           selected: selectedOptionKey || null,
           correct: correctOption?._key || null,
           isCorrect: false, // Treat unanswered as incorrect
         };
      }
    });

    const calculatedScore = Math.round((correctCount / quizData.questions.length) * 100);
    setScore(calculatedScore);
    setFeedback(newFeedback);
    setSubmitted(true);

    // Store quiz attempt in Supabase
    try {
      // Call server action to store quiz attempt
      // await storeQuizAttempt({
      //   quizId: quizData._id,
      //   lessonId: lessonId,
      //   score: calculatedScore,
      //   answersPayload: attemptAnswers,
      // });
      console.log('Placeholder: storeQuizAttempt called with:', {
        quizId: quizData._id,
        lessonId: lessonId,
        score: calculatedScore,
        answersPayload: attemptAnswers,
      });

      // Optional: Trigger lesson completion if score is passing
      // if (calculatedScore >= passingScore) { // Need passing score logic
      //   await markLessonComplete(lessonId); // Need to import markLessonComplete
      // }

    } catch (err) {
      console.error('Failed to store quiz attempt:', err);
      // Handle error storing attempt
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!quizData) {
      return <div>Quiz data not found.</div>;
  }

  return (
    <div className="quiz-player p-4 border rounded-md">
      <h2 className="text-2xl font-bold mb-4">{quizData.title}</h2>
      {quizData.questions.map((question) => (
        <div key={question._key} className="question mb-6">
          <p className="font-semibold mb-2">{question.questionText}</p>
          <div className="options space-y-2">
            {question.options.map((option) => (
              <label key={option._key} className={`block cursor-pointer p-2 border rounded-md ${submitted ? (feedback[question._key] === true && option.isCorrect ? 'border-green-500 bg-green-100' : feedback[question._key] === false && userAnswers[question._key] === option._key ? 'border-red-500 bg-red-100' : option.isCorrect ? 'border-green-500' : '') : ''}`}>
                <input
                  type="radio"
                  name={`question-${question._key}`}
                  value={option._key}
                  checked={userAnswers[question._key] === option._key}
                  onChange={() => handleOptionChange(question._key, option._key)}
                  disabled={submitted}
                  className="mr-2"
                />
                {option.text}
                {submitted && option.isCorrect && option.explanation && (
                    <p className="text-sm text-gray-600 mt-1">Explanation: {option.explanation}</p>
                )}
              </label>
            ))}
          </div>
           {submitted && feedback[question._key] !== null && (
               <p className={`mt-2 text-sm ${feedback[question._key] ? 'text-green-600' : 'text-red-600'}`}>
                   {feedback[question._key] ? 'Correct!' : 'Incorrect.'}
               </p>
           )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length !== quizData.questions.length}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Submit Quiz
        </button>
      )}

      {submitted && score !== null && (
        <div className="mt-4 text-xl font-bold">
          Your Score: {score}%
        </div>
      )}
    </div>
  );
};

export default QuizPlayer;