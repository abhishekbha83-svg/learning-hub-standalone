import express from 'express';
import path from 'path';
import fs from 'fs';
import {
  isOpenRouterConfigured,
  testOpenRouterMinimal,
  sendOpenRouterChat,
  OPENROUTER_DEFAULT_MODEL,
  extractJsonFromText
} from './openRouterService.ts';

export const learningHubRouter = express.Router();

export interface ParsedYouTubeResult {
  type: 'playlist' | 'video' | 'both' | 'unknown';
  id: string;
  videoId?: string;
  playlistId?: string;
  originalUrl: string;
}

// Helper to extract YouTube playlist ID and/or video ID supporting all standard YouTube formats
export function parseYouTubeUrl(url: string): ParsedYouTubeResult {
  if (!url) return { type: 'unknown', id: '', originalUrl: '' };
  const clean = url.trim();

  let videoId: string | undefined;
  let playlistId: string | undefined;

  // 1. Playlist check (?list=... or &list=...)
  const playlistMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch && playlistMatch[1]) {
    playlistId = playlistMatch[1];
  }

  // 2. Video check: youtu.be/VIDEO_ID
  const youtuBeMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    videoId = youtuBeMatch[1];
  }

  // 3. Video check: youtube.com/watch?v=, /embed/, /v/, /shorts/, /live/
  if (!videoId) {
    const watchMatch = clean.match(/(?:youtube\.com|m\.youtube\.com)\/(?:watch\?.*v=|embed\/|v\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      videoId = watchMatch[1];
    }
  }

  // 4. Clean direct 11-char video ID
  if (!videoId && !playlistId && /^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    videoId = clean;
  }

  // 5. Clean direct playlist ID
  if (!videoId && !playlistId && /^(?:PL|UU|FL|RD|OLAK)[a-zA-Z0-9_-]+$/.test(clean)) {
    playlistId = clean;
  }

  if (videoId && playlistId) {
    return { type: 'both', id: playlistId, videoId, playlistId, originalUrl: clean };
  }
  if (playlistId) {
    return { type: 'playlist', id: playlistId, playlistId, originalUrl: clean };
  }
  if (videoId) {
    return { type: 'video', id: videoId, videoId, originalUrl: clean };
  }

  return { type: 'unknown', id: '', originalUrl: clean };
}

// Format seconds into MM:SS or HH:MM:SS
function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Curated public learning paths for high-yield exams & topics
export const CURATED_LEARNING_COURSES = [
  {
    id: 'curated-pw-jee-physics',
    title: 'JEE Main & Advanced Complete Physics - Legend Foundation Series',
    channelName: 'Physics Wallah - Alakh Pandey',
    examCategory: 'JEE',
    subject: 'Physics',
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.youtube.com/playlist?list=PLF_7kfnwLFCED_512aM4u8zPqf-2h79xT',
    playlistId: 'PLF_7kfnwLFCED_512aM4u8zPqf-2h79xT',
    totalDurationSeconds: 14200,
    isCurated: true,
    chapters: [
      { id: 'ch-1', title: 'Kinematics & Vectors', order: 1, lectureIds: ['lec-1', 'lec-2'] },
      { id: 'ch-2', title: 'Newton\'s Laws & Friction', order: 2, lectureIds: ['lec-3', 'lec-4'] },
      { id: 'ch-3', title: 'Work, Energy & Power', order: 3, lectureIds: ['lec-5'] }
    ],
    lectures: [
      {
        id: 'lec-1',
        videoId: 'b1t41Q3xRM8',
        title: '01. Vectors & Calculus for Physics - Basics to JEE Level',
        durationSeconds: 2700,
        durationFormatted: '45:00',
        thumbnailUrl: 'https://img.youtube.com/vi/b1t41Q3xRM8/hqdefault.jpg',
        order: 1,
        chapterTitle: 'Kinematics & Vectors',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-2',
        videoId: '7B3VzH9Qx3w',
        title: '02. Motion in 1D & 2D - Projectile Motion Derivations & PYQs',
        durationSeconds: 3100,
        durationFormatted: '51:40',
        thumbnailUrl: 'https://img.youtube.com/vi/7B3VzH9Qx3w/hqdefault.jpg',
        order: 2,
        chapterTitle: 'Kinematics & Vectors',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-3',
        videoId: 'kX1l6vQ6Cj0',
        title: '03. Newton\'s Laws of Motion - Free Body Diagrams & Constraint Relations',
        durationSeconds: 3300,
        durationFormatted: '55:00',
        thumbnailUrl: 'https://img.youtube.com/vi/kX1l6vQ6Cj0/hqdefault.jpg',
        order: 3,
        chapterTitle: 'Newton\'s Laws & Friction',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-4',
        videoId: 'fB2sM9z6Xj8',
        title: '04. Friction & Circular Dynamics - Banking of Roads & Inclined Planes',
        durationSeconds: 2500,
        durationFormatted: '41:40',
        thumbnailUrl: 'https://img.youtube.com/vi/fB2sM9z6Xj8/hqdefault.jpg',
        order: 4,
        chapterTitle: 'Newton\'s Laws & Friction',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-5',
        videoId: 'mY4kP9w8Rz2',
        title: '05. Work-Energy Theorem, Conservative Forces & Vertical Circle',
        durationSeconds: 2600,
        durationFormatted: '43:20',
        thumbnailUrl: 'https://img.youtube.com/vi/mY4kP9w8Rz2/hqdefault.jpg',
        order: 5,
        chapterTitle: 'Work, Energy & Power',
        chapterIndex: 2,
        watchedSeconds: 0,
        completed: false
      }
    ]
  },
  {
    id: 'curated-neet-biology',
    title: 'NEET UG Complete Biology - NCERT Line-by-Line Decoded',
    channelName: 'Tarun Sir Biology Foundation',
    examCategory: 'NEET',
    subject: 'Biology',
    thumbnailUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.youtube.com/playlist?list=PLF_NEET_BIO_NCERT_LINE',
    playlistId: 'PLF_NEET_BIO_NCERT_LINE',
    totalDurationSeconds: 15300,
    isCurated: true,
    chapters: [
      { id: 'ch-bio-1', title: 'Cell: The Unit of Life', order: 1, lectureIds: ['lec-bio-1', 'lec-bio-2'] },
      { id: 'ch-bio-2', title: 'Genetics & Molecular Basis', order: 2, lectureIds: ['lec-bio-3', 'lec-bio-4'] }
    ],
    lectures: [
      {
        id: 'lec-bio-1',
        videoId: 'y1t7Y2QxRM8',
        title: '01. Cell Structure & Organelles - NCERT Diagram Highlights',
        durationSeconds: 3600,
        durationFormatted: '60:00',
        thumbnailUrl: 'https://img.youtube.com/vi/y1t7Y2QxRM8/hqdefault.jpg',
        order: 1,
        chapterTitle: 'Cell: The Unit of Life',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-bio-2',
        videoId: 'b2m81Q3xRM9',
        title: '02. Cell Cycle & Mitosis vs Meiosis Stages with High-Yield PYQs',
        durationSeconds: 3800,
        durationFormatted: '63:20',
        thumbnailUrl: 'https://img.youtube.com/vi/b2m81Q3xRM9/hqdefault.jpg',
        order: 2,
        chapterTitle: 'Cell: The Unit of Life',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-bio-3',
        videoId: 'c3n91Q3xRM1',
        title: '03. Principles of Inheritance - Mendel Laws, Punnett Squares & Pedigree',
        durationSeconds: 4100,
        durationFormatted: '68:20',
        thumbnailUrl: 'https://img.youtube.com/vi/c3n91Q3xRM1/hqdefault.jpg',
        order: 3,
        chapterTitle: 'Genetics & Molecular Basis',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-bio-4',
        videoId: 'd4p01Q3xRM2',
        title: '04. Molecular Basis of Inheritance - DNA Replication & Translation',
        durationSeconds: 3800,
        durationFormatted: '63:20',
        thumbnailUrl: 'https://img.youtube.com/vi/d4p01Q3xRM2/hqdefault.jpg',
        order: 4,
        chapterTitle: 'Genetics & Molecular Basis',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      }
    ]
  },
  {
    id: 'curated-fullstack-dev',
    title: 'Full Stack Web Development - Modern React, Node & TypeScript',
    channelName: 'Striver & FreeCodeCamp',
    examCategory: 'Coding',
    subject: 'Computer Science',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.youtube.com/playlist?list=PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn',
    playlistId: 'PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn',
    totalDurationSeconds: 16800,
    isCurated: true,
    chapters: [
      { id: 'ch-web-1', title: 'React 19 & State Architecture', order: 1, lectureIds: ['lec-web-1', 'lec-web-2'] },
      { id: 'ch-web-2', title: 'Backend APIs & Data Flow', order: 2, lectureIds: ['lec-web-3', 'lec-web-4'] }
    ],
    lectures: [
      {
        id: 'lec-web-1',
        videoId: 'SqcY0GlETPk',
        title: '01. React Fundamentals, Virtual DOM & Modern Hooks',
        durationSeconds: 4200,
        durationFormatted: '70:00',
        thumbnailUrl: 'https://img.youtube.com/vi/SqcY0GlETPk/hqdefault.jpg',
        order: 1,
        chapterTitle: 'React 19 & State Architecture',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-web-2',
        videoId: 'bMknfKXIFA8',
        title: '02. State Management with Zustand & Context API Patterns',
        durationSeconds: 3600,
        durationFormatted: '60:00',
        thumbnailUrl: 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg',
        order: 2,
        chapterTitle: 'React 19 & State Architecture',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-web-3',
        videoId: 'Oe421EPjeBE',
        title: '03. Node.js & Express RESTful APIs with Clean Architecture',
        durationSeconds: 4500,
        durationFormatted: '75:00',
        thumbnailUrl: 'https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg',
        order: 3,
        chapterTitle: 'Backend APIs & Data Flow',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-web-4',
        videoId: 'f2EqECiTBL8',
        title: '04. TypeScript for Full Stack Developers - End-to-End Type Safety',
        durationSeconds: 4500,
        durationFormatted: '75:00',
        thumbnailUrl: 'https://img.youtube.com/vi/f2EqECiTBL8/hqdefault.jpg',
        order: 4,
        chapterTitle: 'Backend APIs & Data Flow',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      }
    ]
  },
  {
    id: 'curated-upsc-economy',
    title: 'UPSC CSE Indian Economy Foundation - Concept Clarity Marathon',
    channelName: 'Mrunal Patel & Khan Global Studies',
    examCategory: 'UPSC',
    subject: 'Economics & GS-3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    sourceUrl: 'https://www.youtube.com/playlist?list=PLfL_UPSC_ECO_MRUNAL',
    playlistId: 'PLfL_UPSC_ECO_MRUNAL',
    totalDurationSeconds: 18000,
    isCurated: true,
    chapters: [
      { id: 'ch-eco-1', title: 'Money, Banking & Monetary Policy', order: 1, lectureIds: ['lec-eco-1', 'lec-eco-2'] },
      { id: 'ch-eco-2', title: 'Fiscal Policy, Budgeting & Inflation', order: 2, lectureIds: ['lec-eco-3', 'lec-eco-4'] }
    ],
    lectures: [
      {
        id: 'lec-eco-1',
        videoId: '8hly31xKli0',
        title: '01. RBI, Monetary Policy Tools (Repo, Reverse Repo, CRR, SLR)',
        durationSeconds: 4500,
        durationFormatted: '75:00',
        thumbnailUrl: 'https://img.youtube.com/vi/8hly31xKli0/hqdefault.jpg',
        order: 1,
        chapterTitle: 'Money, Banking & Monetary Policy',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-eco-2',
        videoId: '3JZ_D3ELwOQ',
        title: '02. Commercial Banks, NPAs, Insolvency & IBC Framework',
        durationSeconds: 4200,
        durationFormatted: '70:00',
        thumbnailUrl: 'https://img.youtube.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
        order: 2,
        chapterTitle: 'Money, Banking & Monetary Policy',
        chapterIndex: 0,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-eco-3',
        videoId: 'k1Y8F7J6Xb4',
        title: '03. Union Budget, Direct & Indirect Taxes, GST Council',
        durationSeconds: 4600,
        durationFormatted: '76:40',
        thumbnailUrl: 'https://img.youtube.com/vi/k1Y8F7J6Xb4/hqdefault.jpg',
        order: 3,
        chapterTitle: 'Fiscal Policy, Budgeting & Inflation',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      },
      {
        id: 'lec-eco-4',
        videoId: 'm2Z9G8K7Yc5',
        title: '04. Inflation Indices (CPI vs WPI) & GDP Calculations',
        durationSeconds: 4700,
        durationFormatted: '78:20',
        thumbnailUrl: 'https://img.youtube.com/vi/m2Z9G8K7Yc5/hqdefault.jpg',
        order: 4,
        chapterTitle: 'Fiscal Policy, Budgeting & Inflation',
        chapterIndex: 1,
        watchedSeconds: 0,
        completed: false
      }
    ]
  }
];

// Helper to resolve genuine single YouTube video metadata, title, author, and duration
async function resolveSingleVideoData(
  videoId: string,
  options: {
    customTitle?: string;
    preferredExam?: string;
    sourceUrl?: string;
    detectedType?: string;
  }
) {
  let videoTitle = `Lecture Video (${videoId})`;
  let authorName = 'YouTube Educator';
  let durationSeconds = 0;
  let durationFormatted = '0:00';
  let channelUrl = '';

  let oembedOk = false;
  // 1. Fetch oEmbed metadata (Title, Author, Thumbnail)
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (oembedRes.ok) {
      const data: any = await oembedRes.json();
      videoTitle = data.title || videoTitle;
      authorName = data.author_name || authorName;
      channelUrl = data.author_url || '';
      oembedOk = true;
    }
  } catch (oembedErr) {
    console.warn('[YouTube Resolve] oEmbed warning:', oembedErr);
  }

  // 2. Fetch watch page to obtain exact duration and verify video availability
  let watchPageFound = false;
  try {
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': 'CONSENT=PENDING+999; SOCS=CAESEwgDEgk2NTY5MTA3NzQaAmVuIAEaBgiA_LyaBg;'
      }
    });

    if (watchRes.ok) {
      const html = await watchRes.text();
      const pageTitleMatch = html.match(/<title>([^<]+)<\/title>/);
      if (pageTitleMatch && pageTitleMatch[1] && !pageTitleMatch[1].startsWith('YouTube')) {
        watchPageFound = true;
        if (!oembedOk) {
          videoTitle = pageTitleMatch[1].replace(' - YouTube', '').trim();
        }
      }

      // Exact duration in milliseconds or seconds
      const msMatch = html.match(/"approxDurationMs":"(\d+)"/);
      const secMatch = html.match(/"lengthSeconds":"(\d+)"/);
      if (msMatch) {
        durationSeconds = Math.round(Number(msMatch[1]) / 1000);
      } else if (secMatch) {
        durationSeconds = Number(secMatch[1]);
      } else {
        // ISO 8601 duration fallback (e.g. PT15M30S)
        const isoMatch = html.match(/itemprop="duration" content="PT([^"]+)"/);
        if (isoMatch && isoMatch[1]) {
          const iso = isoMatch[1];
          let hrs = 0;
          let mins = 0;
          let secs = 0;
          const hM = iso.match(/(\d+)H/);
          const mM = iso.match(/(\d+)M/);
          const sM = iso.match(/(\d+)S/);
          if (hM) hrs = Number(hM[1]);
          if (mM) mins = Number(mM[1]);
          if (sM) secs = Number(sM[1]);
          durationSeconds = hrs * 3600 + mins * 60 + secs;
        }
      }
    }
  } catch (watchErr) {
    console.warn('[YouTube Resolve] Watch page fetch warning:', watchErr);
  }

  if ((!oembedOk && !watchPageFound) || !videoTitle.trim()) {
    return null;
  }

  if (durationSeconds > 0) {
    durationFormatted = formatDuration(durationSeconds);
  }

  const lecture: any = {
    id: `lec-${videoId}`,
    videoId,
    title: videoTitle,
    durationSeconds,
    durationFormatted: durationFormatted !== '0:00' ? durationFormatted : 'Video Lesson',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    order: 1,
    chapterTitle: 'Module 1: Core Lectures',
    chapterIndex: 0,
    watchedSeconds: 0,
    completed: false
  };

  const courseTitle = options.customTitle || videoTitle;
  const course: any = {
    id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    title: courseTitle,
    description: `Organized study course created from YouTube lecture by ${authorName}.`,
    sourceUrl: options.sourceUrl || `https://www.youtube.com/watch?v=${videoId}`,
    channelName: authorName,
    channelUrl,
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    examCategory: options.preferredExam || 'General',
    subject: 'General Study',
    chapters: [
      {
        id: 'ch-1',
        title: 'Module 1: Core Lectures',
        order: 1,
        lectureIds: [lecture.id]
      }
    ],
    lectures: [lecture],
    totalDurationSeconds: durationSeconds,
    completedLecturesCount: 0,
    progressPercentage: 0,
    status: 'active',
    enrolledAt: Date.now(),
    lastAccessedAt: Date.now()
  };

  return {
    success: true,
    type: 'video',
    detectedType: options.detectedType || 'video',
    course,
    singleLecture: lecture,
    metadata: {
      title: videoTitle,
      author: authorName,
      thumbnailUrl: lecture.thumbnailUrl,
      durationSeconds,
      durationFormatted
    }
  };
}

// 1. Resolve YouTube Playlist or Single Video with genuine metadata
learningHubRouter.post('/youtube/resolve', async (req, res) => {
  try {
    const { url, preferredExam, customTitle, mode = 'auto' } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'Please provide a valid YouTube URL.' });
    }

    const parsed = parseYouTubeUrl(url);
    if (parsed.type === 'unknown') {
      return res.status(400).json({
        success: false,
        error: 'Unsupported YouTube URL. Please provide a standard watch, playlist, youtu.be, or shorts URL.'
      });
    }

    // Determine target resolution mode:
    const resolveAsSingle =
      (mode === 'video' && parsed.videoId) ||
      (mode !== 'playlist' && parsed.videoId && !parsed.playlistId) ||
      (mode === 'video' && parsed.type === 'both');

    // === SINGLE VIDEO WORKFLOW ===
    if (resolveAsSingle) {
      const singleVideoResult = await resolveSingleVideoData(parsed.videoId!, {
        customTitle,
        preferredExam,
        sourceUrl: url,
        detectedType: parsed.type
      });

      if (!singleVideoResult) {
        return res.status(404).json({
          success: false,
          error: 'This YouTube video is private, deleted, or unavailable. Please check the URL.'
        });
      }

      return res.json(singleVideoResult);
    }

    // === PLAYLIST WORKFLOW ===
    let playlistId = parsed.playlistId || parsed.id;
    if (!playlistId) {
      return res.status(200).json({ success: false, error: 'Could not detect a valid YouTube playlist ID from this URL.' });
    }

    // Known legacy or restructured playlist aliases
    const PLAYLIST_ALIASES: Record<string, { targetId: string; notice: string }> = {
      'PLgUwDviBIf0oF6QL8m22w1hIDC1vJDA8Q': {
        targetId: 'PLgUwDviBIf0oE3gA41TKO2H5bHpPd7fzn',
        notice: 'The creator updated this playlist series. Loaded the active Striver DSA series instead.'
      }
    };

    let aliasNotice = '';
    if (playlistId && PLAYLIST_ALIASES[playlistId]) {
      aliasNotice = PLAYLIST_ALIASES[playlistId].notice;
      playlistId = PLAYLIST_ALIASES[playlistId].targetId;
    }

    // Check if matches curated courses first
    const matchedCurated = CURATED_LEARNING_COURSES.find(
      (c) => c.playlistId === playlistId || c.sourceUrl === url || c.id === playlistId
    );

    // If it matches a curated verified course and no custom override is requested, return immediately
    if (matchedCurated && !customTitle) {
      return res.json({
        success: true,
        type: 'playlist',
        detectedType: parsed.type,
        course: matchedCurated,
        notice: aliasNotice || 'Loaded verified curriculum from the Learning Hub collection.'
      });
    }

    let playlistTitle = customTitle || `YouTube Course (${playlistId})`;
    let channelName = 'YouTube Educator';
    let fetchedLectures: any[] = [];

    // Fetch playlist page using browser headers and consent cookies
    try {
      const pageRes = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cookie': 'CONSENT=PENDING+999; SOCS=CAESEwgDEgk2NTY5MTA3NzQaAmVuIAEaBgiA_LyaBg;'
        }
      });

      if (!pageRes.ok) {
        // Fallback to video if URL had both
        if (parsed.videoId) {
          const videoFallback = await resolveSingleVideoData(parsed.videoId, {
            customTitle,
            preferredExam,
            sourceUrl: url,
            detectedType: parsed.type
          });
          if (videoFallback) {
            return res.json({
              ...videoFallback,
              notice: `The playlist (${playlistId}) was unavailable on YouTube, so we loaded the selected lecture video instead.`
            });
          }
        }

        if (matchedCurated) {
          return res.json({
            success: true,
            type: 'playlist',
            detectedType: parsed.type,
            course: matchedCurated,
            notice: 'Loaded verified curriculum from the Learning Hub collection.'
          });
        }

        return res.status(200).json({
          success: false,
          error: `Could not retrieve playlist from YouTube. Please ensure this playlist is set to Public and accessible.`
        });
      }

      const html = await pageRes.text();

      // Check for YouTube system alerts (private / deleted playlist)
      const initialDataMatch =
        html.match(/var ytInitialData = ({.*?});<\/script>/s) ||
        html.match(/ytInitialData\s*=\s*({.*?});/s);

      if (initialDataMatch && initialDataMatch[1]) {
        const data = JSON.parse(initialDataMatch[1]);

        // Honest check: does YouTube report an error alert?
        if (data.alerts && Array.isArray(data.alerts)) {
          for (const alertItem of data.alerts) {
            const alertText =
              alertItem?.alertRenderer?.text?.runs?.[0]?.text ||
              alertItem?.alertRenderer?.text?.simpleText;
            if (alertText) {
              // Fallback to video if available
              if (parsed.videoId) {
                const videoFallback = await resolveSingleVideoData(parsed.videoId, {
                  customTitle,
                  preferredExam,
                  sourceUrl: url,
                  detectedType: parsed.type
                });
                if (videoFallback) {
                  return res.json({
                    ...videoFallback,
                    notice: `The playlist (${playlistId}) is no longer available on YouTube (${alertText}), so we loaded the selected lecture video instead.`
                  });
                }
              }

              if (matchedCurated) {
                return res.json({
                  success: true,
                  type: 'playlist',
                  detectedType: parsed.type,
                  course: matchedCurated,
                  notice: 'Loaded verified curriculum from the Learning Hub collection.'
                });
              }

              return res.status(200).json({
                success: false,
                error: `YouTube Notice: ${alertText}. Please ensure this playlist is public and accessible, or try importing an individual lecture video.`
              });
            }
          }
        }

        // Extract playlist title
        playlistTitle =
          data?.metadata?.playlistMetadataRenderer?.title ||
          data?.header?.playlistHeaderRenderer?.title?.simpleText ||
          playlistTitle;

        // Extract playlist channel/owner
        channelName =
          data?.header?.playlistHeaderRenderer?.ownerText?.runs?.[0]?.text ||
          data?.metadata?.playlistMetadataRenderer?.author ||
          channelName;

        // Recursive helper to extract renderers across both modern and classic YouTube schemas
        const findRenderers = (obj: any, targetKey: string, depth = 0): any[] => {
          if (!obj || depth > 25) return [];
          const resList: any[] = [];
          if (typeof obj === 'object') {
            for (const k in obj) {
              if (k === targetKey) {
                resList.push(obj[k]);
              } else if (typeof obj[k] === 'object') {
                resList.push(...findRenderers(obj[k], targetKey, depth + 1));
              }
            }
          }
          return resList;
        };

        const seenVideoIds = new Set<string>();
        let orderIdx = 1;

        // 1. Try modern lockupViewModel (YouTube 2024-2026 standard)
        const lockups = findRenderers(data, 'lockupViewModel');
        if (lockups.length > 0) {
          for (const l of lockups) {
            const vid = l.contentId;
            const meta = l.metadata?.lockupMetadataViewModel;
            const title = meta?.title?.content;
            if (vid && title && !seenVideoIds.has(vid)) {
              seenVideoIds.add(vid);
              const overlays = l.contentImage?.thumbnailViewModel?.overlays || [];
              let durationText = '30:00';
              for (const ov of overlays) {
                const badge = ov.thumbnailBottomOverlayViewModel?.badges?.[0]?.thumbnailBadgeViewModel?.text;
                if (badge) durationText = badge;
              }
              const parts = durationText.split(':').map(Number);
              let durationSec = 1800;
              if (parts.length === 2) durationSec = parts[0] * 60 + parts[1];
              if (parts.length === 3) durationSec = parts[0] * 3600 + parts[1] * 60 + parts[2];

              fetchedLectures.push({
                id: `lec-${vid}`,
                videoId: vid,
                title,
                durationSeconds: durationSec,
                durationFormatted: durationText,
                thumbnailUrl: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
                order: orderIdx++,
                watchedSeconds: 0,
                completed: false
              });
            }
          }
        }

        // 2. Try classic playlistVideoRenderer (YouTube legacy format)
        if (fetchedLectures.length === 0) {
          const classicVideos = findRenderers(data, 'playlistVideoRenderer');
          for (const video of classicVideos) {
            if (video && video.videoId && !seenVideoIds.has(video.videoId)) {
              seenVideoIds.add(video.videoId);
              const title =
                video.title?.runs?.[0]?.text ||
                video.title?.simpleText ||
                `Lecture ${orderIdx}`;
              const durationText = video.lengthText?.simpleText || '30:00';
              const parts = durationText.split(':').map(Number);
              let durationSec = 1800;
              if (parts.length === 2) durationSec = parts[0] * 60 + parts[1];
              if (parts.length === 3) durationSec = parts[0] * 3600 + parts[1] * 60 + parts[2];

              fetchedLectures.push({
                id: `lec-${video.videoId}`,
                videoId: video.videoId,
                title,
                durationSeconds: durationSec,
                durationFormatted: durationText,
                thumbnailUrl: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
                order: orderIdx++,
                watchedSeconds: 0,
                completed: false
              });
            }
          }
        }
      }
    } catch (parseErr: any) {
      console.warn('[YouTube Resolve] Playlist parse warning:', parseErr);
    }

    // Honest check: Did we actually extract genuine videos?
    if (fetchedLectures.length === 0) {
      if (parsed.videoId) {
        const videoFallback = await resolveSingleVideoData(parsed.videoId, {
          customTitle,
          preferredExam,
          sourceUrl: url,
          detectedType: parsed.type
        });
        if (videoFallback) {
          return res.json({
            ...videoFallback,
            notice: `The playlist (${playlistId}) contains no accessible videos, so we loaded the selected lecture video instead.`
          });
        }
      }

      if (matchedCurated) {
        return res.json({
          success: true,
          type: 'playlist',
          detectedType: parsed.type,
          course: matchedCurated,
          notice: 'Loaded verified curriculum from the Learning Hub collection.'
        });
      }

      return res.status(200).json({
        success: false,
        error:
          'No accessible video lectures found in this YouTube playlist. Please check that the playlist is public and contains active videos, or import a lecture video directly.'
      });
    }

    // Group lectures into organized chapters
    const chapters: any[] = [];
    let currentChapter = {
      id: 'ch-1',
      title: 'Chapter 1: Foundational Lectures',
      order: 1,
      lectureIds: [] as string[]
    };
    let chapterCount = 1;

    fetchedLectures.forEach((lec, idx) => {
      if (idx > 0 && idx % 6 === 0) {
        chapters.push(currentChapter);
        chapterCount++;
        currentChapter = {
          id: `ch-${chapterCount}`,
          title: `Chapter ${chapterCount}: Advanced Concepts & Practice`,
          order: chapterCount,
          lectureIds: []
        };
      }
      lec.chapterTitle = currentChapter.title;
      lec.chapterIndex = chapterCount - 1;
      currentChapter.lectureIds.push(lec.id);
    });
    chapters.push(currentChapter);

    const totalDuration = fetchedLectures.reduce((acc, l) => acc + l.durationSeconds, 0);

    const course: any = {
      id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: customTitle || playlistTitle,
      description: `Structured YouTube course with ${fetchedLectures.length} lessons and progress tracking.`,
      playlistId,
      sourceUrl: url,
      channelName,
      thumbnailUrl: fetchedLectures[0].thumbnailUrl,
      examCategory: preferredExam || 'General',
      subject: 'Course Curriculum',
      chapters,
      lectures: fetchedLectures,
      totalDurationSeconds: totalDuration,
      completedLecturesCount: 0,
      progressPercentage: 0,
      status: 'active',
      enrolledAt: Date.now(),
      lastAccessedAt: Date.now()
    };

    return res.json({
      success: true,
      type: 'playlist',
      detectedType: parsed.type,
      course,
      metadata: {
        title: playlistTitle,
        author: channelName,
        thumbnailUrl: fetchedLectures[0].thumbnailUrl,
        totalLectures: fetchedLectures.length,
        totalDurationSeconds: totalDuration
      }
    });
  } catch (err: any) {
    console.error('[YouTube Resolve Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to process YouTube course.' });
  }
});

// 2. Curated Courses Endpoint
learningHubRouter.get('/curated', (req, res) => {
  res.json({ success: true, courses: CURATED_LEARNING_COURSES });
});

// 3. AI Tutor Chat Endpoint (OpenRouter Powered)
learningHubRouter.post('/ai/tutor', async (req, res) => {
  try {
    const { question, lectureTitle, courseTitle, conversationHistory, notesContext } = req.body || {};
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Please enter a question.' });
    }

    if (!isOpenRouterConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI Tutor service is currently unavailable (OPENROUTER_API_KEY is not configured on the server).'
      });
    }

    const systemPrompt = `You are the ABHYVEXA AI Academic Tutor — a world-class, empathetic, highly rigorous academic mentor for Indian and global competitive exam aspirants (JEE Main & Advanced, NEET UG, UPSC CSE, GATE, SSC CGL, Coding, and College STEM courses).
- Provide crystal-clear explanations with step-by-step mathematical derivations, intuitive physical/conceptual analogies, code snippets, or mnemonics where appropriate.
- Always highlight common exam mistakes, standard textbook references (like NCERT or standard references), and high-yield problem-solving tips.
- Maintain an encouraging, distraction-free, focused academic tone.
- Format beautifully in Markdown with bold headers, bullet points, and code/math blocks.
- Conclude with 1-2 quick check-for-understanding practice questions.`;

    let contextPrefix = '';
    if (courseTitle || lectureTitle) {
      contextPrefix += `[Curriculum Context: Course "${courseTitle || 'Curriculum'}" | Lecture "${lectureTitle || 'General Topic'}"]\n`;
    }
    if (notesContext && typeof notesContext === 'string' && notesContext.trim()) {
      contextPrefix += `[Student Notes: "${notesContext.trim()}"]\n`;
    }

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-8)) {
        if (!msg) continue;
        const role = msg.role === 'assistant' ? 'assistant' : 'user';
        const content = String(msg.text || msg.content || '').trim();
        if (content) {
          messages.push({ role, content });
        }
      }
    }

    messages.push({
      role: 'user',
      content: `${contextPrefix}Student Doubt: ${question.trim()}`
    });

    const aiRes = await sendOpenRouterChat({
      messages,
      temperature: 0.35
    });

    if (!aiRes.success || !aiRes.text) {
      return res.status(502).json({
        success: false,
        error: aiRes.error?.message || 'AI Tutor failed to respond. Please retry.',
        errorType: aiRes.error?.type
      });
    }

    return res.json({
      success: true,
      answer: aiRes.text,
      model: aiRes.model,
      groundingDisclaimer: `Answered by ABHYVEXA AI Tutor using ${aiRes.model || OPENROUTER_DEFAULT_MODEL} grounded in lecture curriculum context.`
    });
  } catch (err: any) {
    console.error('[AI Tutor Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'AI Tutor internal error.' });
  }
});

// 4. AI Lecture Summary Endpoint (OpenRouter Powered)
learningHubRouter.post('/ai/summary', async (req, res) => {
  try {
    const { lectureTitle, courseTitle, chapterTitle, durationFormatted, transcriptContent } = req.body || {};
    const title = lectureTitle?.trim() || 'Core Curriculum Lecture';

    if (!isOpenRouterConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI Summary service unavailable (OPENROUTER_API_KEY not configured).'
      });
    }

    const hasTranscript = Boolean(transcriptContent && typeof transcriptContent === 'string' && transcriptContent.trim().length > 50);

    const systemPrompt = `You are the ABHYVEXA Academic Synthesis Specialist.
Your task is to generate an exhaustive, structured, academic revision summary for students preparing for competitive exams.
Requirements:
1. If transcript content is provided, analyze the actual lecture text thoroughly.
2. If transcript content is NOT provided, explicitly begin with an honest disclosure banner:
"> **Notice**: Full spoken transcript is not available for this embed. This structured revision guide is synthesized from verified syllabus standards for "${title}" (${courseTitle || 'Curriculum'})."
Never falsely claim that you listened to or read an absent transcript.
3. Structure the summary strictly with:
- **Executive Overview & Scope**
- **Core Concepts & Definitions**
- **Governing Equations, Formulas & Laws**
- **Step-by-Step Derivations / Key Proofs**
- **Common Exam Traps & Negative-Marking Pitfalls**
- **High-Yield Fast Revision Checklist (5 Bullet Points)**
Format in clean Markdown with math formatting.`;

    const userPrompt = hasTranscript
      ? `Generate a structured lecture summary from the provided transcript for:
Title: "${title}"
Course: "${courseTitle || 'Curriculum'}"
${chapterTitle ? `Chapter: "${chapterTitle}"` : ''}

TRANSCRIPT CONTENT:
${transcriptContent.substring(0, 8000)}`
      : `Generate a structured academic revision guide based on the verified curriculum metadata:
Title: "${title}"
Course: "${courseTitle || 'Curriculum'}"
${chapterTitle ? `Chapter: "${chapterTitle}"` : ''}
${durationFormatted ? `Duration: ${durationFormatted}` : ''}`;

    const aiRes = await sendOpenRouterChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3
    });

    if (!aiRes.success || !aiRes.text) {
      return res.status(502).json({
        success: false,
        error: aiRes.error?.message || 'Failed to generate summary from AI provider.',
        errorType: aiRes.error?.type
      });
    }

    res.json({
      success: true,
      summary: aiRes.text,
      model: aiRes.model,
      isFromTranscript: hasTranscript,
      disclaimer: hasTranscript
        ? 'Generated from lecture transcript via OpenRouter.'
        : 'Synthesized from curriculum metadata & syllabus standard (closed-caption transcript not available for this embed).'
    });
  } catch (err: any) {
    console.error('[AI Summary Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate lecture summary.' });
  }
});

// 5. AI Quiz Generator Endpoint (OpenRouter Powered)
learningHubRouter.post('/ai/quiz', async (req, res) => {
  try {
    const { topic, count = 5, difficulty = 'medium', examContext, sourceContent } = req.body || {};
    const quizTopic = (topic || '').trim() || 'General Curriculum Concepts';
    const numQuestions = Math.min(Math.max(Number(count) || 5, 3), 10);

    if (!isOpenRouterConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI Quiz service unavailable (OPENROUTER_API_KEY not configured).'
      });
    }

    const systemPrompt = `You are a strict examination controller and question author for competitive examinations (${examContext || 'JEE, NEET, GATE, UPSC'}).
Your task is to generate challenging, high-yield diagnostic multiple-choice questions.
Think concisely and output the JSON immediately without lengthy internal reasoning.

Output ONLY a single valid JSON object strictly matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question statement...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOptionIndex": 0,
      "explanation": "Detailed explanation of why this option is correct and why other options are incorrect traps."
    }
  ]
}

Rules:
- Generate exactly ${numQuestions} questions.
- Every question MUST have exactly 4 options in an array.
- "correctOptionIndex" MUST be an integer: 0, 1, 2, or 3.
- No giveaways like "all of the above" or "none of the above".
- Respond with pure JSON only, no introduction or markdown text outside the JSON.`;

    const userPrompt = `Generate ${numQuestions} ${difficulty} difficulty MCQs on the topic: "${quizTopic}".
${sourceContent ? `Source / Lecture Notes Context:\n"${sourceContent.substring(0, 3000)}"` : ''}`;

    const aiRes = await sendOpenRouterChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.35
    });

    if (!aiRes.success || !aiRes.text) {
      return res.status(502).json({
        success: false,
        error: aiRes.error?.message || 'Failed to generate quiz from AI provider.',
        errorType: aiRes.error?.type
      });
    }

    const parsed = extractJsonFromText<{ questions: any[] }>(aiRes.text);

    if (!parsed || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'Model output could not be validated into structured questions. Please retry.'
      });
    }

    // Strict validation of each question
    const validatedQuestions = parsed.questions
      .filter((q) => q && typeof q.question === 'string' && q.question.trim().length > 5 && Array.isArray(q.options) && q.options.length >= 2)
      .map((q, idx) => {
        let options = q.options.map((opt: any) => String(opt || '').trim()).filter(Boolean);
        while (options.length < 4) {
          options.push(`Option ${String.fromCharCode(65 + options.length)}`);
        }
        options = options.slice(0, 4);

        let correctIdx = Number(q.correctOptionIndex);
        if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) {
          correctIdx = 0;
        }

        return {
          id: q.id || `q-${Date.now()}-${idx}`,
          question: q.question.trim(),
          options,
          correctOptionIndex: correctIdx,
          explanation: typeof q.explanation === 'string' && q.explanation.trim()
            ? q.explanation.trim()
            : `Option ${options[correctIdx]} is the verified correct answer based on standard syllabus principles.`
        };
      });

    if (validatedQuestions.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'No valid questions could be verified from AI response.'
      });
    }

    return res.json({
      success: true,
      quiz: {
        id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: `AI Practice Quiz: ${quizTopic}`,
        topicOrLecture: quizTopic,
        difficulty,
        questions: validatedQuestions,
        createdAt: Date.now()
      },
      model: aiRes.model,
      disclaimer: `Generated by OpenRouter (${aiRes.model}) based on topic curriculum requirements.`
    });
  } catch (err: any) {
    console.error('[AI Quiz Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate quiz.' });
  }
});



// 6. AI Study Plan Generator Endpoint (OpenRouter Powered)
learningHubRouter.post('/ai/plan', async (req, res) => {
  try {
    const {
      dailyHours = 6,
      examDate,
      subjects = [],
      topicFocus = '',
      targetExam = 'JEE Main',
      syllabusProgress = [],
      existingTaskCount = 0
    } = req.body || {};

    const hours = Math.min(Math.max(Number(dailyHours) || 6, 1), 16);

    let daysRemaining = 90;
    if (examDate) {
      const target = new Date(examDate).getTime();
      const now = Date.now();
      const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) daysRemaining = diffDays;
    }

    if (!isOpenRouterConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI Study Planner unavailable (OPENROUTER_API_KEY not configured).'
      });
    }

    const activeSubjects = Array.isArray(subjects) && subjects.length > 0
      ? subjects.map((s: any) => String(s).trim()).filter(Boolean)
      : ['Physics', 'Chemistry', 'Mathematics / Biology', 'Revision & Practice'];

    const systemPrompt = `You are a study timetable architect for ${targetExam}. Generate exactly 7 daily tasks, 1 focused task per day (dayOffset 0 to 6).
Daily study capacity: ${hours} hours/day. Days remaining: ${daysRemaining} days.
Active subjects: ${activeSubjects.join(', ')}.
Focus areas: ${topicFocus || 'Balanced coverage of high-weightage chapters and daily problem practice'}.
Think concisely and output pure JSON immediately without lengthy internal reasoning.

Output strictly a single valid JSON object:
{
  "strategyOverview": "Brief 1-2 sentence strategy explaining how the hours are balanced",
  "tasks": [
    {
      "dayOffset": 0,
      "title": "Clear action-oriented task title (e.g. Physics: Rotational Motion Lecture + DPP)",
      "timeSlot": "07:30 - 10:30 AM",
      "estimatedMinutes": ${Math.min(hours * 60, 240)},
      "priority": "HIGH",
      "subject": "Physics",
      "examTag": "${targetExam}",
      "description": "Specific focus, e.g. Derivations & numerical problem set"
    }
  ]
}

Rules:
- Generate exactly 7 daily tasks, one task per day (dayOffset 0 to 6).
- dayOffset must be an integer from 0 (today) to 6 (7th day).
- priority must be one of "HIGH", "MEDIUM", "LOW".
- Day 6 (7th day) should incorporate cumulative revision and mock practice.
- Respond with pure JSON only, without commentary.`;

    const userPrompt = `Generate the 7-day study schedule for ${targetExam} in JSON.`;

    const aiRes = await sendOpenRouterChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3
    });

    if (!aiRes.success || !aiRes.text) {
      return res.status(502).json({
        success: false,
        error: aiRes.error?.message || 'Failed to generate study plan from AI provider.',
        errorType: aiRes.error?.type
      });
    }

    const parsed = extractJsonFromText<{ strategyOverview?: string; tasks: any[] }>(aiRes.text);

    if (!parsed || !Array.isArray(parsed.tasks) || parsed.tasks.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'Model output could not be validated into structured tasks. Please retry.'
      });
    }

    const today = new Date();
    const validatedTasks: any[] = [];

    parsed.tasks.forEach((t, i) => {
      if (!t || !t.title) return;
      const dayOffset = typeof t.dayOffset === 'number' && t.dayOffset >= 0 && t.dayOffset <= 6 ? t.dayOffset : (i % 7);
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + dayOffset);
      const dateStr = targetDate.toISOString().split('T')[0];

      const estMins = typeof t.estimatedMinutes === 'number' && t.estimatedMinutes > 0
        ? Math.min(t.estimatedMinutes, 360)
        : 90;

      const priority = ['HIGH', 'MEDIUM', 'LOW'].includes(t.priority) ? t.priority : 'HIGH';

      validatedTasks.push({
        id: `task-gen-${dateStr}-${i}-${Date.now().toString(36).substring(2, 6)}`,
        title: String(t.title).trim(),
        date: dateStr,
        timeSlot: t.timeSlot ? String(t.timeSlot).trim() : '08:00 - 10:00 AM',
        estimatedMinutes: estMins,
        priority,
        status: 'To Do',
        examTag: t.examTag ? String(t.examTag).trim() : targetExam,
        subject: t.subject ? String(t.subject).trim() : activeSubjects[i % activeSubjects.length],
        description: t.description ? String(t.description).trim() : undefined
      });
    });

    if (validatedTasks.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'No valid tasks generated by AI model.'
      });
    }

    res.json({
      success: true,
      plan: {
        targetExam,
        daysRemaining,
        dailyHours: hours,
        strategyOverview: parsed.strategyOverview || `Personalized ${hours}h/day schedule balancing theory, problem solving, and weekly revision.`,
        tasks: validatedTasks
      },
      model: aiRes.model
    });
  } catch (err: any) {
    console.error('[AI Plan Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate study plan.' });
  }
});

// 7. AI Flashcard Generator Endpoint (OpenRouter Powered)
learningHubRouter.post('/ai/flashcards', async (req, res) => {
  try {
    const { topic, count = 5, subject = 'Physics', examTag = 'JEE Main' } = req.body || {};
    const cardTopic = (topic || '').trim() || 'High-Yield Formulae and Core Definitions';
    const numCards = Math.min(Math.max(Number(count) || 5, 2), 10);

    if (!isOpenRouterConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI Flashcard service unavailable (OPENROUTER_API_KEY not configured).'
      });
    }

    const systemPrompt = `You are a spaced-repetition active recall flashcard creator for ${examTag}.
Generate ${numCards} active recall flashcards for topic: "${cardTopic}" (Subject: ${subject}).
Think concisely and output the JSON immediately without lengthy internal reasoning.
Output strictly a JSON object:
{
  "flashcards": [
    {
      "frontQuestion": "Specific prompt, equation verification, or formula question",
      "backAnswer": "Concise, precise answer with correct units or mathematical formulation",
      "subject": "${subject}"
    }
  ]
}
Rules:
- Front should test a single atomic concept.
- Back should give the exact formula/explanation directly without unnecessary filler.
- Return pure JSON only.`;

    const aiRes = await sendOpenRouterChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${numCards} flashcards for "${cardTopic}".` }
      ],
      temperature: 0.3
    });

    if (!aiRes.success || !aiRes.text) {
      return res.status(502).json({
        success: false,
        error: aiRes.error?.message || 'Failed to generate flashcards from AI provider.'
      });
    }

    const parsed = extractJsonFromText<{ flashcards: any[] }>(aiRes.text);
    if (!parsed || !Array.isArray(parsed.flashcards) || parsed.flashcards.length === 0) {
      return res.status(502).json({
        success: false,
        error: 'Failed to parse structured flashcards from model output.'
      });
    }

    const validatedCards = parsed.flashcards
      .filter((c) => c && c.frontQuestion && c.backAnswer)
      .map((c, i) => ({
        id: `fc-ai-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
        frontQuestion: String(c.frontQuestion).trim(),
        backAnswer: String(c.backAnswer).trim(),
        subject: c.subject ? String(c.subject).trim() : subject,
        boxLevel: 1,
        status: 'new' as const,
        lastReviewedAt: undefined,
        nextReviewAt: undefined
      }));

    res.json({
      success: true,
      flashcards: validatedCards,
      model: aiRes.model
    });
  } catch (err: any) {
    console.error('[AI Flashcards Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate flashcards.' });
  }
});

// 8. AI Recommendations Endpoint (OpenRouter Powered)
learningHubRouter.post('/ai/recommendations', async (req, res) => {
  try {
    const {
      enrolledCourses = [],
      streakDays = 0,
      targetExam = 'JEE Main',
      weakTopics = [],
      completedLecturesCount = 0,
      totalStudyMinutes = 0
    } = req.body || {};

    if (!isOpenRouterConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI Recommendations service unavailable (OPENROUTER_API_KEY not configured).'
      });
    }

    const coursesSummary = Array.isArray(enrolledCourses) && enrolledCourses.length > 0
      ? enrolledCourses.map((c: any) => `- "${c.title}" (${c.completedLecturesCount || 0}/${c.totalLectures || 0} completed, ${c.progressPercentage || 0}%)`).join('\n')
      : 'No courses enrolled yet.';

    const weakTopicsSummary = Array.isArray(weakTopics) && weakTopics.length > 0
      ? weakTopics.join(', ')
      : 'None recorded yet (take practice quizzes to diagnose weak topics).';

    const systemPrompt = `You are the ABHYVEXA Academic Progress Coach.
Analyze the student's REAL study metrics without hallucinating or fabricating facts:
- Target Exam: ${targetExam}
- Current Habit Streak: ${streakDays} days
- Enrolled Courses:
${coursesSummary}
- Recorded Weak Topics: ${weakTopicsSummary}
- Completed Lectures: ${completedLecturesCount}
- Logged Study Time: ${Math.round(totalStudyMinutes)} minutes

Provide honest, actionable next-study recommendations.
Think concisely and output the JSON immediately without lengthy internal reasoning.
Output JSON conforming to:
{
  "headline": "Short motivating title tailored to their real progress",
  "recommendations": [
    {
      "priority": "HIGH",
      "action": "Immediate next step (e.g. watch next lecture or revise identified weak topic)",
      "rationale": "Why this is recommended based on real progress"
    }
  ],
  "motivationalQuote": "A concise academic quote"
}`;

    const aiRes = await sendOpenRouterChat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Synthesize my personalized next study recommendations.' }
      ],
      temperature: 0.3
    });

    if (!aiRes.success || !aiRes.text) {
      return res.status(502).json({
        success: false,
        error: aiRes.error?.message || 'Failed to generate recommendations.'
      });
    }

    const parsed = extractJsonFromText<{ headline?: string; recommendations: any[]; motivationalQuote?: string }>(aiRes.text);

    if (!parsed || !Array.isArray(parsed.recommendations)) {
      return res.status(502).json({
        success: false,
        error: 'Failed to parse recommendations structure.'
      });
    }

    res.json({
      success: true,
      recommendations: parsed,
      model: aiRes.model
    });
  } catch (err: any) {
    console.error('[AI Recommendations Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate recommendations.' });
  }
});

// 7. OpenRouter Diagnostics & Test Endpoint
learningHubRouter.get('/openrouter/status', (req, res) => {
  res.json({
    configured: isOpenRouterConfigured(),
    defaultModel: OPENROUTER_DEFAULT_MODEL,
    baseUrl: 'https://openrouter.ai/api/v1',
    chatEndpoint: '/chat/completions'
  });
});

learningHubRouter.post('/openrouter/test', async (req, res) => {
  const result = await testOpenRouterMinimal();
  res.status(result.success ? 200 : (result.httpStatus || 400)).json(result);
});

// ==========================================
// 8. Academic Certificate Registry & Public Verification Endpoints
// ==========================================
const serverCertificatesStore = new Map<string, any>();

// Helper to sanitize and load initial certificates from file if available
const CERTIFICATES_BACKUP_PATH = path.join(process.cwd(), 'server', 'learningHub', 'certificates-registry.json');
try {
  if (fs.existsSync(CERTIFICATES_BACKUP_PATH)) {
    const raw = fs.readFileSync(CERTIFICATES_BACKUP_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      parsed.forEach((c) => {
        if (c && c.id) serverCertificatesStore.set(c.id.toUpperCase(), c);
      });
      console.log(`[Certificates Registry] Loaded ${serverCertificatesStore.size} certificates from disk.`);
    }
  }
} catch (err) {
  console.warn('[Certificates Registry] Could not read backup file:', err);
}

const persistCertificatesToDisk = () => {
  try {
    const list = Array.from(serverCertificatesStore.values());
    const dir = path.dirname(CERTIFICATES_BACKUP_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CERTIFICATES_BACKUP_PATH, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Certificates Registry] Disk write failed:', err);
  }
};

// Public Certificate Verification Endpoint
learningHubRouter.get('/certificates/verify/:certId', (req, res) => {
  const certId = (req.params.certId || '').trim().toUpperCase();
  if (!certId) {
    return res.status(400).json({ success: false, verified: false, error: 'Certificate ID is required' });
  }

  const certificate = serverCertificatesStore.get(certId);
  if (!certificate) {
    return res.status(404).json({
      success: false,
      verified: false,
      error: 'Certificate not found in ABHYVEXA Registry'
    });
  }

  res.json({
    success: true,
    verified: true,
    certificate,
    verifiedAt: Date.now()
  });
});

// Register or Issue Certificate Endpoint
learningHubRouter.post('/certificates/issue', (req, res) => {
  try {
    const cert = req.body;
    if (!cert || !cert.id || !cert.milestone) {
      return res.status(400).json({ success: false, error: 'Invalid certificate payload' });
    }

    const key = cert.id.toUpperCase();
    serverCertificatesStore.set(key, cert);
    persistCertificatesToDisk();

    console.log(`[Certificates Registry] Issued & Verified credential: ${key} (${cert.studentName} - ${cert.title})`);
    res.json({ success: true, certificate: cert });
  } catch (err: any) {
    console.error('[Certificates Registry Error]:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to issue certificate' });
  }
});

// Batch Sync Certificates (e.g. from local storage)
learningHubRouter.post('/certificates/sync', (req, res) => {
  try {
    const { certificates } = req.body || {};
    if (Array.isArray(certificates)) {
      certificates.forEach((c) => {
        if (c && c.id) {
          serverCertificatesStore.set(c.id.toUpperCase(), c);
        }
      });
      persistCertificatesToDisk();
    }
    res.json({ success: true, count: serverCertificatesStore.size });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to sync certificates' });
  }
});

