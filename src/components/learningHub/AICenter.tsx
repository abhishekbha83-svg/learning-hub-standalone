import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  FileText,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  BookOpen,
  ArrowRight,
  Compass,
  Flame,
  TrendingUp,
  Target
} from 'lucide-react';
import { learningHubService } from '../../services/learningHubService';
import { getStoredTotalSeconds } from '../../services/learnerProfileService';

type AIMode = 'tutor' | 'summary' | 'quiz' | 'coach';

export const AICenter: React.FC = () => {
  const [activeMode, setActiveMode] = useState<AIMode>('tutor');

  // AI Tutor State
  const [tutorQuestion, setTutorQuestion] = useState<string>('');
  const [tutorChat, setTutorChat] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your ABHYVEXA AI Academic Tutor. Ask me any conceptual doubt, request a step-by-step mathematical derivation, or ask for high-yield exam tips for JEE, NEET, UPSC, GATE, or Coding.'
    }
  ]);
  const [isTutorLoading, setIsTutorLoading] = useState<boolean>(false);
  const [tutorError, setTutorError] = useState<string | null>(null);

  // AI Summary State
  const [summaryTopic, setSummaryTopic] = useState<string>('Electromagnetic Induction & Faraday\'s Law');
  const [summaryOutput, setSummaryOutput] = useState<string>('');
  const [summaryDisclaimer, setSummaryDisclaimer] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // AI Quiz State
  const [quizTopic, setQuizTopic] = useState<string>('Chemical Kinetics & Rate Laws');
  const [quizQuestionsCount, setQuizQuestionsCount] = useState<number>(5);
  const [quizDifficulty, setQuizDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isQuizLoading, setIsQuizLoading] = useState<boolean>(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  // AI Study Coach State
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState<boolean>(false);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuestion.trim() || isTutorLoading) return;

    const q = tutorQuestion.trim();
    setTutorQuestion('');
    setTutorError(null);
    setTutorChat((prev) => [...prev, { role: 'user', text: q }]);
    setIsTutorLoading(true);

    try {
      const res = await fetch('/api/learning-hub/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          conversationHistory: tutorChat.map((m) => ({ role: m.role, content: m.text }))
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.answer) {
        throw new Error(data.error || 'Failed to receive answer from AI Tutor.');
      }
      setTutorChat((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer }
      ]);
    } catch (err: any) {
      const errMsg = err.message || 'Service temporarily busy. Please retry.';
      setTutorError(errMsg);
      setTutorChat((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ ${errMsg}` }
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  const handleGenerateSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summaryTopic.trim() || isSummaryLoading) return;

    setIsSummaryLoading(true);
    setSummaryOutput('');
    setSummaryDisclaimer('');
    setSummaryError(null);

    try {
      const res = await fetch('/api/learning-hub/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lectureTitle: summaryTopic.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.summary) {
        throw new Error(data.error || 'Failed to generate summary.');
      }
      setSummaryOutput(data.summary);
      if (data.disclaimer) {
        setSummaryDisclaimer(data.disclaimer);
      }
    } catch (err: any) {
      setSummaryError(err.message || 'Failed to generate summary.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim() || isQuizLoading) return;

    setIsQuizLoading(true);
    setQuizError(null);
    setGeneratedQuiz(null);
    setUserAnswers({});
    setQuizSubmitted(false);

    try {
      const res = await fetch('/api/learning-hub/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic.trim(),
          count: quizQuestionsCount,
          difficulty: quizDifficulty
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.quiz) {
        throw new Error(data.error || 'Failed to generate quiz.');
      }
      setGeneratedQuiz(data.quiz);
    } catch (err: any) {
      setQuizError(err.message || 'Failed to generate quiz.');
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleSubmitQuiz = () => {
    if (!generatedQuiz) return;
    setQuizSubmitted(true);

    let correctCount = 0;
    generatedQuiz.questions.forEach((q: any, idx: number) => {
      if (userAnswers[idx] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const totalQ = generatedQuiz.questions.length;
    const scorePct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

    // Persist attempt in student progress and weak topics
    learningHubService.saveQuizAttempt({
      id: `qa-${Date.now()}`,
      quizId: generatedQuiz.id,
      quizTitle: generatedQuiz.title,
      topicOrLecture: generatedQuiz.topicOrLecture || quizTopic,
      totalQuestions: totalQ,
      correctAnswers: correctCount,
      incorrectAnswers: totalQ - correctCount,
      skippedAnswers: 0,
      scorePercentage: scorePct,
      timeSpentSeconds: 60,
      answers: userAnswers as any,
      attemptedAt: Date.now()
    });
  };

  const handleFetchRecommendations = async () => {
    setIsRecommendationsLoading(true);
    setRecommendationsError(null);

    const enrolledCourses = learningHubService.getCourses();
    const streak = learningHubService.getStudyStreak().streakDays;
    const targetExam = learningHubService.getUserSettings().targetExamName;
    const weakTopics = learningHubService.getWeakTopics();
    const completedLecturesCount = enrolledCourses.reduce(
      (acc, c) => acc + (c.completedLecturesCount || 0),
      0
    );
    const totalStudyMinutes = Math.round(getStoredTotalSeconds() / 60);

    try {
      const res = await fetch('/api/learning-hub/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolledCourses: enrolledCourses.map((c) => ({
            id: c.id,
            title: c.title,
            completedLecturesCount: c.completedLecturesCount,
            totalLectures: c.lectures?.length || 0,
            progressPercentage: c.progressPercentage
          })),
          streakDays: streak,
          targetExam,
          weakTopics,
          completedLecturesCount,
          totalStudyMinutes
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.recommendations) {
        throw new Error(data.error || 'Failed to fetch recommendations.');
      }
      setRecommendations(data.recommendations);
    } catch (err: any) {
      setRecommendationsError(err.message || 'Failed to generate recommendations.');
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Server-Side OpenRouter Nemotron-3.5 Academic Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Study Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Context-grounded AI Tutor, comprehensive revision summaries, diagnostic practice, and personalized guidance.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex justify-center">
        <div className="p-1 bg-[#141418] rounded-2xl border border-white/10 flex items-center gap-1 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveMode('tutor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'tutor'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tutor Chat</span>
          </button>

          <button
            onClick={() => setActiveMode('summary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'summary'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>AI Revision Summary</span>
          </button>

          <button
            onClick={() => setActiveMode('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'quiz'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>AI Quiz Generator</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('coach');
              if (!recommendations && !isRecommendationsLoading) {
                handleFetchRecommendations();
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeMode === 'coach'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>AI Study Coach</span>
          </button>
        </div>
      </div>

      {/* MODE 1: AI TUTOR */}
      {activeMode === 'tutor' && (
        <div className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-4 flex flex-col h-[580px]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {tutorChat.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-2xl ${
                  msg.role === 'user'
                    ? 'ml-auto bg-purple-600/25 border border-purple-500/30 text-purple-100'
                    : 'bg-[#1A1A20] border border-white/5 text-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400 block mb-1">
                  {msg.role === 'user' ? 'You' : 'AI Academic Tutor'}
                </span>
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            ))}
            {isTutorLoading && (
              <div className="p-3.5 rounded-2xl bg-[#1A1A20] border border-white/5 text-purple-400 animate-pulse text-xs">
                Analyzing concept and formulating step-by-step academic explanation...
              </div>
            )}
          </div>

          <form onSubmit={handleAskTutor} className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              value={tutorQuestion}
              onChange={(e) => setTutorQuestion(e.target.value)}
              placeholder="Ask a question (e.g. Derive Work-Energy Theorem for variable force)..."
              className="flex-1 bg-[#1A1A20] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={isTutorLoading || !tutorQuestion.trim()}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* MODE 2: AI SUMMARY */}
      {activeMode === 'summary' && (
        <div className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <form onSubmit={handleGenerateSummary} className="space-y-3">
            <label className="text-xs font-semibold text-slate-300">
              Topic or Lecture Title for Revision Summary:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={summaryTopic}
                onChange={(e) => setSummaryTopic(e.target.value)}
                placeholder="e.g. Photoelectric Effect & Einstein Equation"
                className="flex-1 px-4 py-2.5 bg-[#1A1A20] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSummaryLoading || !summaryTopic.trim()}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-40 shrink-0 flex items-center gap-1.5"
              >
                {isSummaryLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Summary</span>
              </button>
            </div>
          </form>

          {summaryError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
              ⚠️ {summaryError}
            </div>
          )}

          {summaryOutput && (
            <div className="p-5 bg-[#1A1A20] rounded-2xl border border-white/5 space-y-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="font-bold text-emerald-400">Executive Revision Notes</span>
                <button
                  onClick={() => navigator.clipboard.writeText(summaryOutput)}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              {summaryDisclaimer && (
                <div className="p-2.5 bg-black/30 rounded-xl text-[11px] text-slate-400 border border-white/5">
                  ℹ️ {summaryDisclaimer}
                </div>
              )}
              <div className="whitespace-pre-wrap text-slate-200">{summaryOutput}</div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: AI QUIZ */}
      {activeMode === 'quiz' && (
        <div className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <form onSubmit={handleGenerateQuiz} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-300 font-semibold">Quiz Topic / Chapter</label>
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold">Question Count</label>
              <select
                value={quizQuestionsCount}
                onChange={(e) => setQuizQuestionsCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
              >
                <option value={3}>3 Questions (Quick)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (Deep)</option>
              </select>
            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <button
                type="submit"
                disabled={isQuizLoading || !quizTopic.trim()}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-40"
              >
                {isQuizLoading ? 'Generating...' : 'Start Quiz'}
              </button>
            </div>
          </form>

          {quizError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
              ⚠️ {quizError}
            </div>
          )}

          {generatedQuiz && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-white">{generatedQuiz.title}</h3>
              {generatedQuiz.questions.map((q: any, qIdx: number) => (
                <div key={q.id} className="p-4 bg-[#1A1A20] rounded-2xl border border-white/5 space-y-2 text-xs">
                  <p className="font-semibold text-slate-100">
                    {qIdx + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt: string, optIdx: number) => {
                      const isSelected = userAnswers[qIdx] === optIdx;
                      const isCorrect = q.correctOptionIndex === optIdx;
                      let style = 'bg-[#141418] border-white/10 text-slate-300 hover:border-amber-500/40';

                      if (quizSubmitted) {
                        if (isCorrect) style = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                        else if (isSelected && !isCorrect) style = 'bg-red-500/20 border-red-500 text-red-300';
                      } else if (isSelected) {
                        style = 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors cursor-pointer ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <p className="text-[11px] text-slate-400 p-2.5 bg-[#141418] rounded-xl border border-white/5 mt-2">
                      💡 <span className="font-semibold text-emerald-400">Explanation:</span> {q.explanation}
                    </p>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Submit Quiz & Reveal Solutions
                </button>
              ) : (
                <button
                  onClick={handleGenerateQuiz}
                  className="w-full py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Generate New Practice Questions
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 4: AI STUDY COACH */}
      {activeMode === 'coach' && (
        <div className="p-6 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-400" />
                <span>Personalized Academic Strategy Coach</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                AI analyzes your real verified course enrollments, diagnostic quiz scores, and study streak.
              </p>
            </div>
            <button
              onClick={handleFetchRecommendations}
              disabled={isRecommendationsLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecommendationsLoading ? 'animate-spin' : ''}`} />
              <span>{isRecommendationsLoading ? 'Synthesizing...' : 'Re-Evaluate Progress'}</span>
            </button>
          </div>

          {/* Real Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Target Exam</span>
              <span className="text-sm font-extrabold text-white mt-1 block">
                {learningHubService.getUserSettings().targetExamName}
              </span>
            </div>

            <div className="p-3 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Habit Streak</span>
              <span className="text-sm font-extrabold text-amber-400 mt-1 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{learningHubService.getStudyStreak().streakDays} Days</span>
              </span>
            </div>

            <div className="p-3 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Courses Enrolled</span>
              <span className="text-sm font-extrabold text-emerald-400 mt-1 block">
                {learningHubService.getCourses().length} Courses
              </span>
            </div>

            <div className="p-3 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Weak Topics Identified</span>
              <span className="text-sm font-extrabold text-purple-400 mt-1 block">
                {learningHubService.getWeakTopics().length} Topics
              </span>
            </div>
          </div>

          {recommendationsError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
              ⚠️ {recommendationsError}
            </div>
          )}

          {isRecommendationsLoading && !recommendations && (
            <div className="py-12 text-center text-xs text-blue-400 animate-pulse">
              Synthesizing personalized study recommendations from verified activity metrics...
            </div>
          )}

          {recommendations && (
            <div className="space-y-4">
              {recommendations.headline && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
                  <h3 className="font-bold text-sm text-blue-300 mb-1">{recommendations.headline}</h3>
                  {recommendations.motivationalQuote && (
                    <p className="italic text-slate-400 text-[11px]">“{recommendations.motivationalQuote}”</p>
                  )}
                </div>
              )}

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Actionable Next Steps:
                </h4>
                {Array.isArray(recommendations.recommendations) &&
                  recommendations.recommendations.map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#1A1A20] border border-white/5 text-xs space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            rec.priority === 'HIGH'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {rec.priority || 'RECOMMENDED'}
                        </span>
                        <span className="font-bold text-white">{rec.action}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-0.5">{rec.rationale}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
