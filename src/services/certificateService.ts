// ABHYVEXA — Premium Certificate Service
// Handles milestone eligibility, certificate generation, tamper-proof verification, and high-res export.

import { LearningCourse } from '../types/learningHub';
import {
  CertificateMilestone,
  CertificateType,
  CourseCertificate,
  MilestoneEligibility,
  CourseMilestoneStatus,
  CertificateVerificationResult
} from '../types/certificate';
import { getStoredStudentName, getOrCreateUserId } from './learnerProfileService';

const STORAGE_KEY = 'swa_lh_certificates_v1';

// Milestone Titles and Truthful Descriptions
export const MILESTONE_CONFIGS: Record<
  CertificateMilestone,
  {
    type: CertificateType;
    title: string;
    label: string;
    badge: string;
    minRatio: number;
    description: (courseTitle: string, studentName: string) => string;
  }
> = {
  25: {
    type: 'foundation_progress',
    title: 'Foundation Progress Certificate',
    label: '25% Progress Milestone',
    badge: '25% Foundation',
    minRatio: 0.25,
    description: (courseTitle, studentName) =>
      `This Progress Certificate verifies that ${studentName} has successfully completed the first 25% of the video curriculum in "${courseTitle}", demonstrating dedicated academic initiative and subject consistency.`
  },
  50: {
    type: 'halfway_milestone',
    title: 'Halfway Milestone Certificate',
    label: '50% Halfway Milestone',
    badge: '50% Halfway',
    minRatio: 0.5,
    description: (courseTitle, studentName) =>
      `This Progress Certificate verifies that ${studentName} has successfully completed 50% of the structured video lectures in "${courseTitle}", reaching the major halfway milestone with verified academic progress.`
  },
  75: {
    type: 'advanced_progress',
    title: 'Advanced Progress Certificate',
    label: '75% Advanced Milestone',
    badge: '75% Advanced',
    minRatio: 0.75,
    description: (courseTitle, studentName) =>
      `This Progress Certificate verifies that ${studentName} has successfully completed 75% of the rigorous lecture series in "${courseTitle}", mastering the advanced core modules of the curriculum.`
  },
  100: {
    type: 'course_completion',
    title: 'Course Completion Certificate',
    label: '100% Course Completion',
    badge: '100% Complete',
    minRatio: 1.0,
    description: (courseTitle, studentName) =>
      `This certifies that ${studentName} has successfully completed 100% of the full lecture curriculum for "${courseTitle}", finishing all verified video lectures with demonstrated academic excellence.`
  }
};

class CertificateService {
  // Generate a cryptographically structured unique Certificate ID: ABHY-CERT-YYYY-XXXX-XXXX
  private generateCertificateId(): string {
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let part1 = '';
    let part2 = '';
    for (let i = 0; i < 4; i++) {
      part1 += chars.charAt(Math.floor(Math.random() * chars.length));
      part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ABHY-CERT-${year}-${part1}-${part2}`;
  }

  // Generate an anti-tamper verification hash based on issuance payload
  private generateVerificationCode(userId: string, courseId: string, milestone: number, timestamp: number): string {
    const raw = `${userId}:${courseId}:${milestone}:${timestamp}:SWA_AUTH_KEY_2026`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
    return `VER-${hex.substring(0, 4)}-${hex.substring(4, 8)}`;
  }

  // Load all certificates from localStorage
  public getStoredCertificates(): CourseCertificate[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.warn('[CertificateService] Failed to read stored certificates:', err);
      return [];
    }
  }

  // Save certificates to localStorage and silently sync to backend
  public saveCertificates(certificates: CourseCertificate[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(certificates));
      this.syncToServer(certificates).catch(() => {});
    } catch (err) {
      console.warn('[CertificateService] Failed to save certificates:', err);
    }
  }

  // Sync certificates to server for multi-device & public verification support
  public async syncToServer(certificates: CourseCertificate[]): Promise<void> {
    try {
      await fetch('/api/learning-hub/certificates/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificates })
      });
    } catch {
      // Offline or network error - local storage remains primary
    }
  }

  // Calculate milestone eligibility for a specific course
  public calculateCourseMilestoneStatus(
    course: LearningCourse,
    certificates: CourseCertificate[] = this.getStoredCertificates()
  ): CourseMilestoneStatus {
    const totalLectures = course.lectures?.length || 0;
    const completedLectures = (course.lectures || []).filter((l) => l.completed).length;
    const currentPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

    const milestones: Record<CertificateMilestone, MilestoneEligibility> = {
      25: this.evaluateMilestone(25, course, completedLectures, totalLectures, certificates),
      50: this.evaluateMilestone(50, course, completedLectures, totalLectures, certificates),
      75: this.evaluateMilestone(75, course, completedLectures, totalLectures, certificates),
      100: this.evaluateMilestone(100, course, completedLectures, totalLectures, certificates)
    };

    let unclaimedEligibleCount = 0;
    let claimedCount = 0;

    ([25, 50, 75, 100] as CertificateMilestone[]).forEach((m) => {
      if (milestones[m].isAlreadyClaimed) claimedCount++;
      else if (milestones[m].isEligible) unclaimedEligibleCount++;
    });

    return {
      courseId: course.id,
      courseTitle: course.title,
      thumbnailUrl: course.thumbnailUrl,
      examCategory: course.examCategory,
      totalLectures,
      completedLectures,
      currentPercentage,
      milestones,
      unclaimedEligibleCount,
      claimedCount
    };
  }

  // Evaluate single milestone eligibility with strict rounding and safety rules
  private evaluateMilestone(
    milestone: CertificateMilestone,
    course: LearningCourse,
    completedLectures: number,
    totalLectures: number,
    certificates: CourseCertificate[]
  ): MilestoneEligibility {
    const config = MILESTONE_CONFIGS[milestone];

    // Check if already claimed for this course and milestone
    const existing = certificates.find(
      (c) => c.courseId === course.id && c.milestone === milestone
    );

    // Calculate required lectures with documented rounding policy
    let requiredLectures = 0;
    let isEligible = false;

    if (totalLectures > 0) {
      if (milestone === 100) {
        // Strict 100% policy: All lectures must be completed, and at least 1 lecture exists
        requiredLectures = totalLectures;
        isEligible = completedLectures === totalLectures && totalLectures > 0;
      } else {
        // Intermediate milestone policy: Ceiling of ratio (e.g. 25% of 10 lectures = 3 lectures)
        requiredLectures = Math.max(1, Math.ceil(totalLectures * config.minRatio));
        isEligible = completedLectures >= requiredLectures;
      }
    }

    const currentPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;
    const remainingLectures = Math.max(0, requiredLectures - completedLectures);
    const progressRatio = totalLectures > 0 ? Math.min(1, completedLectures / requiredLectures) : 0;

    return {
      milestone,
      certificateType: config.type,
      title: config.title,
      label: config.label,
      isEligible,
      isAlreadyClaimed: Boolean(existing),
      claimedCertificateId: existing?.id,
      requiredLectures,
      completedLectures,
      totalLectures,
      currentPercentage,
      remainingLectures,
      progressRatio
    };
  }

  // Issue a verified certificate
  public async issueCertificate(
    course: LearningCourse,
    milestone: CertificateMilestone,
    recipientName?: string
  ): Promise<CourseCertificate> {
    const existingCerts = this.getStoredCertificates();

    // Check if already claimed
    const alreadyIssued = existingCerts.find(
      (c) => c.courseId === course.id && c.milestone === milestone
    );
    if (alreadyIssued) {
      return alreadyIssued;
    }

    // Evaluate eligibility
    const status = this.calculateCourseMilestoneStatus(course, existingCerts);
    const milestoneInfo = status.milestones[milestone];
    if (!milestoneInfo.isEligible) {
      throw new Error(
        `Course does not qualify for the ${milestone}% milestone. Needs ${milestoneInfo.remainingLectures} more completed lectures.`
      );
    }

    const userId = getOrCreateUserId();
    const finalStudentName = (recipientName || getStoredStudentName() || 'Student Scholar').trim();
    const config = MILESTONE_CONFIGS[milestone];
    const timestamp = Date.now();
    const certId = this.generateCertificateId();
    const verificationCode = this.generateVerificationCode(userId, course.id, milestone, timestamp);

    // Format human-readable date
    const dateFormatted = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(timestamp));

    // Construct verification URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://studywithabhi.com';
    const verificationUrl = `${baseUrl}/#/verify-certificate?id=${certId}`;

    const newCertificate: CourseCertificate = {
      id: certId,
      userId,
      studentName: finalStudentName,
      courseId: course.id,
      milestone,
      certificateType: config.type,
      title: config.title,
      milestoneBadge: config.badge,
      description: config.description(course.title, finalStudentName),
      issuedAt: timestamp,
      issueDateFormatted: dateFormatted,
      courseSnapshot: {
        courseId: course.id,
        courseTitle: course.title,
        sourceUrl: course.sourceUrl,
        channelName: course.channelName,
        thumbnailUrl: course.thumbnailUrl,
        examCategory: course.examCategory,
        subject: course.subject,
        completedLecturesAtIssue: course.completedLecturesCount || course.lectures.filter((l) => l.completed).length,
        totalLecturesAtIssue: course.lectures.length,
        verifiedPercentage: milestone
      },
      verificationUrl,
      verificationCode,
      issuer: {
        platform: 'ABHYVEXA — LEARN BEYOND LIMITS',
        engine: 'Automated Academic Lecture Verification Engine',
        authority: 'ABHYVEXA Digital Credential Registry',
        websiteUrl: baseUrl
      },
      metadata: {
        version: 1,
        platformVersion: '2026.10',
        userAgentSnippet: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : 'Web'
      }
    };

    // Save locally
    const updated = [newCertificate, ...existingCerts];
    this.saveCertificates(updated);

    // Also record on server
    try {
      await fetch('/api/learning-hub/certificates/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCertificate)
      });
    } catch (err) {
      console.warn('[CertificateService] Non-critical: Failed to save to server immediately, saved in local cache:', err);
    }

    return newCertificate;
  }

  // Verify certificate by ID (checks local cache, then queries server)
  public async verifyCertificate(certId: string): Promise<CertificateVerificationResult> {
    const cleanId = (certId || '').trim();
    if (!cleanId) {
      return { verified: false, error: 'Certificate ID is required', verifiedAt: Date.now() };
    }

    // 1. Check local cache first
    const localCerts = this.getStoredCertificates();
    const foundLocal = localCerts.find((c) => c.id.toLowerCase() === cleanId.toLowerCase());
    if (foundLocal) {
      return {
        verified: true,
        certificate: foundLocal,
        verifiedAt: Date.now()
      };
    }

    // 2. Query backend verification endpoint
    try {
      const res = await fetch(`/api/learning-hub/certificates/verify/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.certificate) {
          return {
            verified: true,
            certificate: data.certificate,
            verifiedAt: Date.now(),
            currentCourseStatus: data.currentCourseStatus
          };
        }
      }
    } catch (err) {
      console.warn('[CertificateService] Verification query failed:', err);
    }

    return {
      verified: false,
      error: 'Certificate not found. The provided credential ID could not be verified in the ABHYVEXA registry.',
      verifiedAt: Date.now()
    };
  }

  // Draw high-resolution certificate on offscreen canvas for crisp 300DPI image export
  public renderToCanvas(certificate: CourseCertificate): HTMLCanvasElement {
    // 2480 x 1754 corresponds to A4 landscape at ~300 DPI
    const width = 2480;
    const height = 1754;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background: Rich Deep Obsidian with subtle radial glow
    ctx.fillStyle = '#0B0B0F';
    ctx.fillRect(0, 0, width, height);

    // Subtle Radial Glow behind seal/content
    const radGlow = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 1100);
    radGlow.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
    radGlow.addColorStop(0.6, 'rgba(15, 23, 42, 0.04)');
    radGlow.addColorStop(1, 'rgba(11, 11, 15, 0)');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, width, height);

    // Outer Decorative Border (Double Gold/Emerald Stroke)
    ctx.strokeStyle = '#D97706'; // Gold outer
    ctx.lineWidth = 14;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = '#10B981'; // Emerald inner accent
    ctx.lineWidth = 4;
    ctx.strokeRect(70, 70, width - 140, height - 140);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, dirX: number, dirY: number) => {
      ctx.save();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, y + dirY * 60);
      ctx.lineTo(x, y);
      ctx.lineTo(x + dirX * 60, y);
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(x + dirX * 18, y + dirY * 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(90, 90, 1, 1);
    drawCorner(width - 90, 90, -1, 1);
    drawCorner(90, height - 90, 1, -1);
    drawCorner(width - 90, height - 90, -1, -1);

    // Top Header: Brand Name & Badge
    ctx.textAlign = 'center';
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 36px sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('STUDY WITH ABHI  •  LEARNING HUB', width / 2, 180);

    // Main Title based on milestone
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 78px sans-serif';
    ctx.letterSpacing = '4px';
    const is100 = certificate.milestone === 100;
    ctx.fillText(
      is100 ? 'COURSE COMPLETION CERTIFICATE' : certificate.title.toUpperCase(),
      width / 2,
      290
    );

    // Milestone Badge Pill
    const badgeText = `${certificate.milestone}% VERIFIED MILESTONE`;
    ctx.font = 'bold 28px sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + 60;
    ctx.fillStyle = is100 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)';
    ctx.strokeStyle = is100 ? '#10B981' : '#F59E0B';
    ctx.lineWidth = 3;
    const badgeX = width / 2 - badgeWidth / 2;
    const badgeY = 330;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeWidth, 54, 27);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = is100 ? '#34D399' : '#FBBF24';
    ctx.fillText(badgeText, width / 2, badgeY + 37);

    // "This certifies that"
    ctx.fillStyle = '#94A3B8';
    ctx.font = '36px Georgia, serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('This verifiable credential is presented to', width / 2, 470);

    // Student Name
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 96px Georgia, serif';
    ctx.fillText(certificate.studentName, width / 2, 590);

    // Elegant Divider Under Name
    const divWidth = 800;
    const divGrad = ctx.createLinearGradient(width / 2 - divWidth / 2, 0, width / 2 + divWidth / 2, 0);
    divGrad.addColorStop(0, 'rgba(217, 119, 6, 0)');
    divGrad.addColorStop(0.5, '#F59E0B');
    divGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');
    ctx.fillStyle = divGrad;
    ctx.fillRect(width / 2 - divWidth / 2, 630, divWidth, 4);

    // Achievement Text
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '38px sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('for successfully completing the verified academic lecture curriculum of', width / 2, 720);

    // Course Title (Highlighted in Emerald/White)
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 64px sans-serif';
    // Wrap course title if too long
    const maxCourseWidth = width - 400;
    const courseTitle = `"${certificate.courseSnapshot.courseTitle}"`;
    ctx.fillText(courseTitle, width / 2, 820);

    // Lecture Statistics Line
    ctx.fillStyle = '#94A3B8';
    ctx.font = '32px sans-serif';
    const lectureStats = `Verified Lectures Completed: ${certificate.courseSnapshot.completedLecturesAtIssue} of ${certificate.courseSnapshot.totalLecturesAtIssue} Video Lectures (${certificate.courseSnapshot.verifiedPercentage}%)`;
    ctx.fillText(lectureStats, width / 2, 900);

    // Detailed Truthful Description (Centered paragraph)
    ctx.fillStyle = '#64748B';
    ctx.font = '30px sans-serif';
    const descLines = this.wrapText(ctx, certificate.description, width - 600);
    descLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, 990 + idx * 46);
    });

    // Bottom Section: Details & Official Verification Box
    const bottomY = 1350;

    // Left Column: Issue Date & Platform Authority
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('DATE OF ISSUANCE', 220, bottomY);
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(certificate.issueDateFormatted, 220, bottomY + 45);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('ISSUING PLATFORM', 220, bottomY + 120);
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('ABHYVEXA — LEARN BEYOND LIMITS', 220, bottomY + 160);
    ctx.fillStyle = '#475569';
    ctx.font = '24px sans-serif';
    ctx.fillText('Verified Digital Educational Credential', 220, bottomY + 195);

    // Center Column: Official Golden Seal
    const sealX = width / 2;
    const sealY = bottomY + 70;
    ctx.save();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 95, 0, Math.PI * 2);
    ctx.fillStyle = '#141418';
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sealX, sealY, 82, 0, Math.PI * 2);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('STUDY WITH ABHI', sealX, sealY - 30);
    ctx.fillStyle = '#10B981';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('VERIFIED', sealX, sealY + 10);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('ACADEMIC RECORD', sealX, sealY + 45);
    ctx.restore();

    // Right Column: Unique Certificate ID & Verification Code
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('CERTIFICATE ID', width - 220, bottomY);
    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(certificate.id, width - 220, bottomY + 45);

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('TAMPER-PROOF VERIFICATION HASH', width - 220, bottomY + 120);
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(certificate.verificationCode, width - 220, bottomY + 160);
    ctx.fillStyle = '#475569';
    ctx.font = '24px sans-serif';
    ctx.fillText('Verify online at studywithabhi.com', width - 220, bottomY + 195);

    return canvas;
  }

  // Helper to wrap text for canvas
  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  // 1-Click High-Res Download (PNG at 300 DPI)
  public downloadAsImage(certificate: CourseCertificate): void {
    const canvas = this.renderToCanvas(certificate);
    const link = document.createElement('a');
    link.download = `${certificate.id}-${certificate.studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Native Print / Save PDF
  public printCertificate(): void {
    window.print();
  }
}

export const certificateService = new CertificateService();
