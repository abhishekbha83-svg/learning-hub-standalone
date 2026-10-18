// ABHYVEXA — Unified Type Definitions

export type LearningHubTab =
  | 'overview'
  | 'courses'
  | 'certificates'
  | 'explore'
  | 'converter'
  | 'planner'
  | 'syllabus'
  | 'ai-center'
  | 'practice'
  | 'tools'
  | 'analytics'
  | 'settings';

export interface LectureItem {
  id: string;
  videoId: string;
  title: string;
  durationSeconds: number;
  durationFormatted: string;
  thumbnailUrl: string;
  chapterTitle?: string;
  chapterIndex?: number;
  order: number;
  watchedSeconds: number;
  completed: boolean;
  completedAt?: number;
  lastWatchedAt?: number;
}

export interface CourseChapter {
  id: string;
  title: string;
  order: number;
  lectureIds: string[];
}

export interface LearningCourse {
  id: string;
  title: string;
  description?: string;
  playlistId?: string;
  sourceUrl: string;
  channelName: string;
  channelUrl?: string;
  thumbnailUrl: string;
  examCategory: 'JEE' | 'NEET' | 'UPSC' | 'GATE' | 'Coding' | 'School' | 'Govt' | 'General' | string;
  subject?: string;
  chapters: CourseChapter[];
  lectures: LectureItem[];
  totalDurationSeconds: number;
  completedLecturesCount: number;
  progressPercentage: number;
  isCurated?: boolean;
  status: 'active' | 'completed' | 'archived';
  enrolledAt: number;
  lastAccessedAt: number;
  colorAccent?: string;
  mappedSyllabusExamId?: string;
}

export interface TimestampedNote {
  id: string;
  courseId: string;
  lectureId: string;
  lectureTitle: string;
  videoId: string;
  timestampSeconds: number;
  timestampFormatted: string;
  content: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface PlannerTask {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  timeSlot?: string; // e.g. "07:00 - 08:30 AM"
  estimatedMinutes?: number;
  priority: TaskPriority;
  status: TaskStatus;
  examTag?: string; // e.g. 'JEE', 'NEET', 'UPSC', 'GATE', 'Coding', 'College'
  subject?: string;
  courseId?: string;
  lectureId?: string;
  syllabusTopicId?: string;
  syllabusExamId?: string;
  createdAt: number;
  completedAt?: number;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'revision_required';
  isDifficult?: boolean;
  isBookmarked?: boolean;
  revisionCount?: number;
  estimatedMinutes?: number;
  mappedLectureIds?: string[];
  notes?: string;
  updatedAt?: number;
}

export interface SyllabusChapter {
  id: string;
  name: string;
  stage?: string; // e.g., 'Prelims', 'Mains', 'Tier 1', 'Tier 2', 'Foundation'
  weightage?: 'High' | 'Medium' | 'Low';
  expectedQuestions?: string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  stage?: string;
  iconName?: string;
  chapters: SyllabusChapter[];
}

export interface ExamVariant {
  id: string;
  name: string;
  description?: string;
}

export interface ExamSetupConfig {
  examId: string;
  variantId?: string;
  targetYear: string;
  targetDate?: string; // ISO date string e.g. '2026-05-03'
  isOfficialDate?: boolean;
  dailyStudyHours: number;
  prepMode: 'Self Study' | 'Coaching';
  targetScoreOrGoal?: string;
  selectedStage?: string;
  updatedAt: number;
}

export interface SyllabusExamTrack {
  id: string;
  name: string;
  abbreviation?: string;
  fullName: string;
  category: 'Engineering' | 'Medical' | 'Govt & Civil' | 'Commerce' | 'Defence & Law' | 'University';
  year: string;
  officialExamDate?: string; // official confirmed date if any
  isOfficialDateAnnounced?: boolean;
  verifiedOfficialSource?: string;
  description?: string;
  variants?: ExamVariant[];
  stages?: string[]; // e.g. ['Prelims', 'Mains'] or ['Tier 1', 'Tier 2']
  subjects: SyllabusSubject[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  sourceContext?: string;
}

export interface GeneratedQuiz {
  id: string;
  title: string;
  topicOrLecture: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: QuizQuestion[];
  createdAt: number;
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  quizTitle: string;
  topicOrLecture?: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex
  attemptedAt: number;
}

export interface Flashcard {
  id: string;
  courseId?: string;
  subject: string;
  topic?: string;
  frontQuestion: string;
  backAnswer: string;
  boxLevel: number; // Spaced repetition interval (1 to 5)
  status: 'new' | 'learning' | 'mastered' | 'needs_revision';
  lastReviewedAt?: number;
  nextReviewAt?: number;
  createdAt: number;
}

export interface StudentAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'streak' | 'lectures' | 'hours' | 'syllabus' | 'mastery';
  progress: number;
  target: number;
}

export interface LearningHubUserSettings {
  defaultPlaybackSpeed: number;
  autoplayNext: boolean;
  focusModeByDefault: boolean;
  dailyStudyGoalMinutes: number;
  targetExamName: string;
  targetExamDate: string; // YYYY-MM-DD
  themePreference: 'dark' | 'light' | 'system';
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
}
