import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../axios';

interface Question {
  _id: string;
  questionText: string;
  options: string[];
}

interface SubmitResult {
  score: number;
  total: number;
  results: { questionId: string; correctAnswer: number; isCorrect: boolean }[];
}

type QuizState = 'loading' | 'taking' | 'submitted' | 'empty' | 'error' | 'missing';

const Quiz = () => {
  const { topicId, subjectId } = useParams<{ topicId: string; subjectId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [state, setQuizState] = useState<QuizState>('loading');
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    if (!topicId) {
      setQuizState('missing');
      return;
    }
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`/questions/${topicId}`);
        if (res.data.length === 0) {
          setQuizState('empty');
        } else {
          setQuestions(res.data);
          setQuizState('taking');
        }
      } catch {
        setQuizState('error');
      }
    };
    fetchQuestions();
  }, [topicId]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    setSelected((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post(`/questions/${topicId}/submit`, { answers: selected });
      setSubmitResult(res.data);
      setQuizState('submitted');
    } catch {
      setQuizState('error');
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => selected[q._id] !== undefined);
  const percentage = submitResult && submitResult.total > 0
    ? Math.round((submitResult.score / submitResult.total) * 100)
    : 0;
  const backToTopics = () => navigate(`/subjects/${subjectId}/topics`);

  const getCorrectAnswer = (questionId: string) =>
    submitResult?.results.find((r) => r.questionId === questionId)?.correctAnswer ?? -1;

  const getIsCorrect = (questionId: string) =>
    submitResult?.results.find((r) => r.questionId === questionId)?.isCorrect ?? false;

  if (state === 'missing') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 text-sm">Topic not found.</p>
        <button onClick={backToTopics} className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors">
          Back to Topics
        </button>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-mongo-muted text-sm">Loading questions...</p>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-mongo-heading font-semibold text-lg mb-2">No questions yet</p>
        <p className="text-mongo-muted text-sm mb-6">There are no questions available for this topic.</p>
        <button onClick={backToTopics} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
        <button onClick={backToTopics} className="mt-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Score banner */}
      {state === 'submitted' && submitResult && (
        <div className={`mb-8 rounded-xl p-6 text-center border ${percentage >= 50 ? 'bg-mongo-green-light border-mongo-green' : 'bg-red-50 border-red-200'}`}>
          <p className="text-mongo-muted text-sm mb-1">Your Score</p>
          <p className={`text-4xl font-bold mb-1 ${percentage >= 50 ? 'text-mongo-green' : 'text-red-500'}`}>
            {submitResult.score} / {submitResult.total}
          </p>
          <p className={`text-lg font-medium ${percentage >= 50 ? 'text-mongo-green' : 'text-red-500'}`}>
            {percentage}%
          </p>
          <p className="text-mongo-muted text-sm mt-2">
            {percentage >= 80 ? 'Excellent work!' : percentage >= 50 ? 'Good effort, keep practicing!' : 'Keep studying and try again!'}
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const userAnswer = selected[q._id];
          const correctAnswer = getCorrectAnswer(q._id);
          const isCorrect = getIsCorrect(q._id);

          return (
            <div key={q._id} className="bg-mongo-card border border-mongo-border rounded-xl p-6 shadow-sm">
              <p className="text-xs font-medium text-mongo-muted mb-2">Question {idx + 1}</p>
              <p className="text-mongo-heading font-medium mb-4">{q.questionText}</p>
              <div className="space-y-2">
                {q.options.map((option, i) => {
                  let optionStyle = 'border-mongo-border text-mongo-text hover:border-mongo-green hover:bg-mongo-green-light';

                  if (state === 'taking' && userAnswer === i) {
                    optionStyle = 'border-mongo-green bg-mongo-green-light text-mongo-heading';
                  }

                  if (state === 'submitted') {
                    if (i === correctAnswer) {
                      optionStyle = 'border-mongo-green bg-mongo-green-light text-mongo-heading font-medium';
                    } else if (userAnswer === i && !isCorrect) {
                      optionStyle = 'border-red-400 bg-red-50 text-red-600';
                    } else {
                      optionStyle = 'border-mongo-border text-mongo-muted';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={state === 'submitted'}
                      onClick={() => handleSelect(q._id, i)}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${optionStyle} ${state === 'submitted' ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                      {option}
                      {state === 'submitted' && i === correctAnswer && (
                        <span className="ml-2 text-mongo-green text-xs font-semibold">✓ Correct</span>
                      )}
                      {state === 'submitted' && userAnswer === i && !isCorrect && (
                        <span className="ml-2 text-red-500 text-xs font-semibold">✗ Your answer</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3 justify-end">
        <button
          onClick={backToTopics}
          className="px-4 py-2 rounded-md text-sm font-medium text-mongo-muted border border-mongo-border hover:bg-mongo-bg transition-colors"
        >
          Back to Topics
        </button>
        {state === 'taking' && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-6 py-2 rounded-md text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        )}
        {state === 'submitted' && (
          <button
            onClick={() => {
              setSelected({});
              setSubmitResult(null);
              setQuizState('taking');
            }}
            className="px-6 py-2 rounded-md text-sm font-medium text-white bg-mongo-green hover:bg-mongo-green/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
