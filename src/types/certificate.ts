// Study With Abhi - Premium Certificate System Type Definitions

export type CertificateMilestone = 25 | 50 | 75 | 100;

export type CertificateType =
  | 'foundation_progress' // 25%
  | 'halfway_milestone'   // 50%
  | 'advanced_progress'   // 75%
  | 'course_completion';  // 100%

export interface CertificateCourseSnapshot {
  courseId: string;
  courseTitle: string;
  sourceUrl?: string;
  channelName?: string;
  thumbnailUrl?: string;
  examCategory?: string;
  subject?: string;
  completedLecturesAtIssue: number;
  totalLecturesAtIssue: number;
  verifiedPercentage: number;
}

export interface CourseCertificate {
  id: string; // e.g. SWA-CERT-2026-XXXX-XXXX
  userId: string;
  studentName: string;
  courseId: string;
  milestone: CertificateMilestone;
  certificateType: CertificateType;
  title: string; // e.g. 'Course Completion Certificate' or 'Progress Certificate'
  milestoneBadge: string; // e.g. '100% Complete' or '50% Halfway'
  description: string;
  issuedAt: number; // Unix timestamp ms
  issueDateFormatted: string; // e.g. 'October 13, 2026'
  courseSnapshot: CertificateCourseSnapshot;
  verificationUrl: string;
  verificationCode: string; // Anti-tamper verification hash
  issuer: {
    platform: string;
    engine: string;
    authority: string;
    websiteUrl: string;
  };
  metadata?: {
    version: number;
    platformVersion: string;
    userAgentSnippet?: string;
  };
}

export interface MilestoneEligibility {
  milestone: CertificateMilestone;
  certificateType: CertificateType;
  title: string;
  label: string;
  isEligible: boolean;
  isAlreadyClaimed: boolean;
  claimedCertificateId?: string;
  requiredLectures: number;
  completedLectures: number;
  totalLectures: number;
  currentPercentage: number;
  remainingLectures: number;
  progressRatio: number;
}

export interface CourseMilestoneStatus {
  courseId: string;
  courseTitle: string;
  thumbnailUrl?: string;
  examCategory?: string;
  totalLectures: number;
  completedLectures: number;
  currentPercentage: number;
  milestones: Record<CertificateMilestone, MilestoneEligibility>;
  unclaimedEligibleCount: number;
  claimedCount: number;
}

export interface CertificateVerificationResult {
  verified: boolean;
  certificate?: CourseCertificate;
  error?: string;
  verifiedAt: number;
  currentCourseStatus?: {
    isStillActive: boolean;
    currentCompletedLectures: number;
    currentTotalLectures: number;
    currentPercentage: number;
  };
}
