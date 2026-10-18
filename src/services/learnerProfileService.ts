/**
 * Standalone browser storage for ABHYVEXA.
 */
const USER_ID_KEY = 'learning_hub_user_id';
const STUDENT_NAME_KEY = 'learning_hub_student_name';
const TOTAL_SECONDS_KEY = 'learning_hub_total_seconds';
const COURSE_TIME_KEY = 'learning_hub_course_study_time_v1';

function readNumber(key: string): number {
  try {
    const value = Number.parseInt(localStorage.getItem(key) || '0', 10);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

export function getOrCreateUserId(): string {
  try {
    const existing = localStorage.getItem(USER_ID_KEY);
    if (existing) return existing;

    const userId = `learner_${crypto.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
    localStorage.setItem(USER_ID_KEY, userId);
    return userId;
  } catch {
    return `learner_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
}

export function getStoredStudentName(): string {
  try {
    return localStorage.getItem(STUDENT_NAME_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredStudentName(name: string): void {
  try {
    localStorage.setItem(STUDENT_NAME_KEY, name.trim());
  } catch {
    // Storage may be disabled by the browser; the caller can continue in-session.
  }
}

export function getStoredTotalSeconds(): number {
  return readNumber(TOTAL_SECONDS_KEY);
}

/** Records course-viewing time for the Learning Hub analytics views. */
export function addActiveStudyTime(
  platformId: string,
  seconds: number,
  _courseMetadata?: { name?: string; category?: string; logo?: string; url?: string }
): void {
  if (!platformId || !Number.isFinite(seconds) || seconds <= 0) return;

  try {
    const total = getStoredTotalSeconds() + Math.floor(seconds);
    localStorage.setItem(TOTAL_SECONDS_KEY, String(total));

    const courseTimes = JSON.parse(localStorage.getItem(COURSE_TIME_KEY) || '{}') as Record<string, number>;
    courseTimes[platformId] = (courseTimes[platformId] || 0) + Math.floor(seconds);
    localStorage.setItem(COURSE_TIME_KEY, JSON.stringify(courseTimes));
  } catch {
    // Keep the course player usable if browser storage is unavailable or full.
  }
}
