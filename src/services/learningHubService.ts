// Study With Abhi Learning Hub - Client Core State & Storage Service
import {
  LearningCourse,
  LectureItem,
  TimestampedNote,
  PlannerTask,
  SyllabusExamTrack,
  SyllabusTopic,
  ExamSetupConfig,
  GeneratedQuiz,
  QuizAttemptResult,
  Flashcard,
  StudentAchievement,
  LearningHubUserSettings
} from '../types/learningHub';
import { getStoredTotalSeconds, addActiveStudyTime } from './learnerProfileService';
import { COMPREHENSIVE_SYLLABUS_TRACKS } from '../data/comprehensiveSyllabusData';

const STORAGE_KEYS = {
  COURSES: 'swa_lh_courses_v1',
  ACTIVE_COURSE_ID: 'swa_lh_active_course_id_v1',
  NOTES: 'swa_lh_notes_v1',
  PLANNER_TASKS: 'swa_lh_planner_tasks_v1',
  SYLLABUS_PROGRESS: 'swa_lh_syllabus_progress_v1',
  EXAM_SETUPS: 'swa_lh_exam_setups_v1',
  BOOKMARKED_EXAMS: 'swa_lh_bookmarked_exams_v1',
  ACTIVE_EXAM_ID: 'swa_lh_active_exam_id_v1',
  QUIZZES: 'swa_lh_quizzes_v1',
  QUIZ_ATTEMPTS: 'swa_lh_quiz_attempts_v1',
  FLASHCARDS: 'swa_lh_flashcards_v1',
  SETTINGS: 'swa_lh_settings_v1',
  STREAK: 'swa_lh_streak_v1',
  DAILY_LOGS: 'swa_lh_daily_logs_v1'
};

export const DEFAULT_USER_SETTINGS: LearningHubUserSettings = {
  defaultPlaybackSpeed: 1,
  autoplayNext: true,
  focusModeByDefault: false,
  dailyStudyGoalMinutes: 180, // 3 hours
  targetExamName: 'JEE Main / NEET 2026',
  targetExamDate: '2026-05-03',
  themePreference: 'dark',
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5
};

// ==========================================
// Verified Syllabus Reference Datasets
// ==========================================
export const OFFICIAL_SYLLABUS_TRACKS: SyllabusExamTrack[] = [
  {
    id: 'syllabus-jee-main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Examination (Main) - NTA Standard',
    category: 'Engineering',
    year: '2026',
    verifiedOfficialSource: 'National Testing Agency (NTA) Official Curriculum',
    subjects: [
      {
        id: 'jee-phy',
        name: 'Physics',
        chapters: [
          {
            id: 'jee-phy-ch1',
            name: 'Physics and Measurement',
            weightage: 'Medium',
            expectedQuestions: '1-2 Questions',
            topics: [
              { id: 't1', name: 'Units, Dimensions and Dimensional Analysis', status: 'not_started' },
              { id: 't2', name: 'Significant Figures and Error Analysis', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch2',
            name: 'Kinematics',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 't3', name: 'Motion in 1D, Relative Velocity', status: 'not_started' },
              { id: 't4', name: 'Projectile Motion and Vector Components', status: 'not_started' },
              { id: 't5', name: 'Uniform and Non-uniform Circular Motion', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch3',
            name: 'Laws of Motion',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 't6', name: 'Newton\'s Laws, Free Body Diagrams', status: 'not_started' },
              { id: 't7', name: 'Static & Kinetic Friction, Banking of Curves', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch4',
            name: 'Work, Energy and Power',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 't8', name: 'Work-Energy Theorem, Conservative Forces', status: 'not_started' },
              { id: 't9', name: 'Elastic and Inelastic Collisions in 1D and 2D', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch5',
            name: 'Rotational Motion',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 't10', name: 'Centre of Mass, Linear Momentum Conservation', status: 'not_started' },
              { id: 't11', name: 'Moment of Inertia, Radius of Gyration', status: 'not_started' },
              { id: 't12', name: 'Torque, Angular Momentum and Pure Rolling', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch6',
            name: 'Electrostatics',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 't13', name: 'Coulomb\'s Law and Electric Field', status: 'not_started' },
              { id: 't14', name: 'Gauss\'s Law and its Applications', status: 'not_started' },
              { id: 't15', name: 'Electric Potential and Capacitance with Dielectrics', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch7',
            name: 'Current Electricity',
            weightage: 'High',
            expectedQuestions: '2-3 Questions',
            topics: [
              { id: 't16', name: 'Ohm\'s Law, Drift Velocity, Resistance Combinations', status: 'not_started' },
              { id: 't17', name: 'Kirchhoff\'s Rules and Wheatstone Bridge', status: 'not_started' }
            ]
          },
          {
            id: 'jee-phy-ch8',
            name: 'Optics (Ray & Wave Optics)',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 't18', name: 'Reflection, Refraction, Total Internal Reflection & Lenses', status: 'not_started' },
              { id: 't19', name: 'Interference, Young\'s Double Slit Experiment & Diffraction', status: 'not_started' }
            ]
          }
        ]
      },
      {
        id: 'jee-chem',
        name: 'Chemistry',
        chapters: [
          {
            id: 'jee-chem-ch1',
            name: 'Some Basic Concepts in Chemistry (Mole Concept)',
            weightage: 'High',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'tc1', name: 'Atomic Mass, Mole Concept and Molar Mass', status: 'not_started' },
              { id: 'tc2', name: 'Stoichiometry, Limiting Reagent and Concentration Units', status: 'not_started' }
            ]
          },
          {
            id: 'jee-chem-ch2',
            name: 'Structure of Atom & Chemical Bonding',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'tc3', name: 'Bohr Model, Quantum Numbers and Electronic Configuration', status: 'not_started' },
              { id: 'tc4', name: 'VSEPR Theory, Hybridization and Molecular Orbital Theory', status: 'not_started' }
            ]
          },
          {
            id: 'jee-chem-ch3',
            name: 'Thermodynamics & Equilibrium',
            weightage: 'High',
            expectedQuestions: '3 Questions',
            topics: [
              { id: 'tc5', name: 'First & Second Laws, Enthalpy, Entropy and Gibbs Free Energy', status: 'not_started' },
              { id: 'tc6', name: 'Chemical Equilibrium (Kp, Kc) and Ionic Equilibrium (pH, Buffers)', status: 'not_started' }
            ]
          },
          {
            id: 'jee-chem-ch4',
            name: 'Organic Chemistry Basics & Hydrocarbons',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'tc7', name: 'IUPAC Nomenclature, Isomerism and Reaction Intermediates', status: 'not_started' },
              { id: 'tc8', name: 'Alkanes, Alkenes, Alkynes and Aromaticity (Electrophilic Substitution)', status: 'not_started' }
            ]
          }
        ]
      },
      {
        id: 'jee-math',
        name: 'Mathematics',
        chapters: [
          {
            id: 'jee-math-ch1',
            name: 'Sets, Relations and Functions',
            weightage: 'Medium',
            expectedQuestions: '2 Questions',
            topics: [
              { id: 'tm1', name: 'Types of Relations, Equivalence Relations', status: 'not_started' },
              { id: 'tm2', name: 'Domain, Range, Injective, Surjective and Inverse Functions', status: 'not_started' }
            ]
          },
          {
            id: 'jee-math-ch2',
            name: 'Calculus (Limits, Continuity & Differentiation)',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'tm3', name: 'Limits, L\'Hopital\'s Rule and Continuity', status: 'not_started' },
              { id: 'tm4', name: 'Derivatives, Tangents & Normals, Maxima and Minima', status: 'not_started' }
            ]
          },
          {
            id: 'jee-math-ch3',
            name: 'Integral Calculus',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'tm5', name: 'Indefinite and Definite Integrals (Properties)', status: 'not_started' },
              { id: 'tm6', name: 'Area Under Curves and Differential Equations', status: 'not_started' }
            ]
          },
          {
            id: 'jee-math-ch4',
            name: 'Vectors and 3D Geometry',
            weightage: 'High',
            expectedQuestions: '3-4 Questions',
            topics: [
              { id: 'tm7', name: 'Dot and Cross Products, Scalar Triple Product', status: 'not_started' },
              { id: 'tm8', name: 'Direction Cosines, Equation of Lines and Shortest Distance', status: 'not_started' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'syllabus-neet-ug',
    name: 'NEET UG',
    fullName: 'National Eligibility cum Entrance Test (UG) - NTA & NMC',
    category: 'Medical',
    year: '2026',
    verifiedOfficialSource: 'National Medical Commission (NMC) & NTA Syllabus',
    subjects: [
      {
        id: 'neet-bio',
        name: 'Biology (Botany & Zoology)',
        chapters: [
          {
            id: 'neet-bio-ch1',
            name: 'Diversity in the Living World',
            weightage: 'High',
            expectedQuestions: '8-10 Questions',
            topics: [
              { id: 'nb1', name: 'The Living World and Biological Classification', status: 'not_started' },
              { id: 'nb2', name: 'Plant Kingdom (Algae, Bryo, Pterido, Gymno, Angio)', status: 'not_started' },
              { id: 'nb3', name: 'Animal Kingdom (Non-chordates to Chordates)', status: 'not_started' }
            ]
          },
          {
            id: 'neet-bio-ch2',
            name: 'Cell Biology & Genetics',
            weightage: 'High',
            expectedQuestions: '15-18 Questions',
            topics: [
              { id: 'nb4', name: 'Cell Structure, Organelles, Biomolecules', status: 'not_started' },
              { id: 'nb5', name: 'Cell Division: Mitosis & Meiosis Stages', status: 'not_started' },
              { id: 'nb6', name: 'Mendelian Genetics, Linkage, Recombination, Pedigree', status: 'not_started' },
              { id: 'nb7', name: 'Molecular Basis: DNA Replication, Transcription, Translation', status: 'not_started' }
            ]
          },
          {
            id: 'neet-bio-ch3',
            name: 'Human Physiology',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'nb8', name: 'Breathing and Exchange of Gases', status: 'not_started' },
              { id: 'nb9', name: 'Body Fluids and Circulation', status: 'not_started' },
              { id: 'nb10', name: 'Excretory Products and Their Elimination', status: 'not_started' },
              { id: 'nb11', name: 'Locomotion, Movement, and Neural Control', status: 'not_started' }
            ]
          },
          {
            id: 'neet-bio-ch4',
            name: 'Ecology & Environment',
            weightage: 'High',
            expectedQuestions: '10-12 Questions',
            topics: [
              { id: 'nb12', name: 'Organisms and Populations (Adaptations, Population Growth)', status: 'not_started' },
              { id: 'nb13', name: 'Ecosystems, Ecological Pyramids and Energy Flow', status: 'not_started' },
              { id: 'nb14', name: 'Biodiversity and Its Conservation', status: 'not_started' }
            ]
          }
        ]
      },
      {
        id: 'neet-phy',
        name: 'Physics',
        chapters: [
          {
            id: 'neet-phy-ch1',
            name: 'Mechanics & Properties of Matter',
            weightage: 'High',
            expectedQuestions: '12-14 Questions',
            topics: [
              { id: 'np1', name: 'Kinematics and Newton\'s Laws', status: 'not_started' },
              { id: 'np2', name: 'Work, Energy, Gravitation and Fluids', status: 'not_started' }
            ]
          },
          {
            id: 'neet-phy-ch2',
            name: 'Electrodynamics & Modern Physics',
            weightage: 'High',
            expectedQuestions: '15-18 Questions',
            topics: [
              { id: 'np3', name: 'Electrostatics, Current Electricity and Magnetic Effects', status: 'not_started' },
              { id: 'np4', name: 'Dual Nature, Atoms, Nuclei, and Semiconductor Electronics', status: 'not_started' }
            ]
          }
        ]
      },
      {
        id: 'neet-chem',
        name: 'Chemistry',
        chapters: [
          {
            id: 'neet-chem-ch1',
            name: 'Physical & Inorganic Chemistry',
            weightage: 'High',
            expectedQuestions: '22-25 Questions',
            topics: [
              { id: 'nc1', name: 'Mole Concept, Solutions, Electrochemistry & Kinetics', status: 'not_started' },
              { id: 'nc2', name: 'Periodic Table, Chemical Bonding, Coordination Compounds, d & f Block', status: 'not_started' }
            ]
          },
          {
            id: 'neet-chem-ch2',
            name: 'Organic Chemistry (NCERT Decoded)',
            weightage: 'High',
            expectedQuestions: '20-22 Questions',
            topics: [
              { id: 'nc3', name: 'GOC, Hydrocarbons, Haloalkanes, Alcohols, Carbonyl Compounds', status: 'not_started' },
              { id: 'nc4', name: 'Amines, Biomolecules and Environmental Chemistry', status: 'not_started' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'syllabus-upsc-cse',
    name: 'UPSC CSE',
    fullName: 'Union Public Service Commission - Civil Services Examination',
    category: 'Govt & Civil',
    year: '2026',
    verifiedOfficialSource: 'UPSC Official Examination Notice',
    subjects: [
      {
        id: 'upsc-gs1',
        name: 'General Studies - Paper I (Prelims)',
        chapters: [
          {
            id: 'upsc-polity',
            name: 'Indian Polity & Governance',
            weightage: 'High',
            expectedQuestions: '14-18 Questions',
            topics: [
              { id: 'up1', name: 'Preamble, Fundamental Rights & DPSP', status: 'not_started' },
              { id: 'up2', name: 'Parliament, State Legislature and Judiciary', status: 'not_started' },
              { id: 'up3', name: 'Constitutional & Non-Constitutional Bodies', status: 'not_started' }
            ]
          },
          {
            id: 'upsc-eco',
            name: 'Indian Economy & Social Development',
            weightage: 'High',
            expectedQuestions: '15-18 Questions',
            topics: [
              { id: 'ue1', name: 'Fiscal Policy, Monetary Policy and Inflation', status: 'not_started' },
              { id: 'ue2', name: 'Banking Sector, External Trade and Balance of Payments', status: 'not_started' },
              { id: 'ue3', name: 'Agriculture, Subsidies, Infrastructure & Budgeting', status: 'not_started' }
            ]
          },
          {
            id: 'upsc-env',
            name: 'Environment, Ecology & Climate Change',
            weightage: 'High',
            expectedQuestions: '14-20 Questions',
            topics: [
              { id: 'un1', name: 'National Parks, Wildlife Sanctuaries & Ramsar Sites', status: 'not_started' },
              { id: 'un2', name: 'Climate Protocols (COP, UNFCCC, Montreal, CITES)', status: 'not_started' }
            ]
          },
          {
            id: 'upsc-hist',
            name: 'History of India & National Movement',
            weightage: 'High',
            expectedQuestions: '12-16 Questions',
            topics: [
              { id: 'uh1', name: 'Ancient & Medieval India, Art & Architecture', status: 'not_started' },
              { id: 'uh2', name: 'Modern Indian History and Freedom Struggle (1857-1947)', status: 'not_started' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'syllabus-gate-cs',
    name: 'GATE CS',
    fullName: 'Graduate Aptitude Test in Engineering - Computer Science & IT',
    category: 'Engineering',
    year: '2026',
    verifiedOfficialSource: 'IIT Organizing Institute Official GATE Syllabus',
    subjects: [
      {
        id: 'gate-cs-core',
        name: 'Computer Science Core',
        chapters: [
          {
            id: 'gate-dsa',
            name: 'Data Structures and Algorithms',
            weightage: 'High',
            expectedQuestions: '8-10 Marks',
            topics: [
              { id: 'gd1', name: 'Arrays, Stacks, Queues, Linked Lists, Trees, Graphs', status: 'not_started' },
              { id: 'gd2', name: 'Asymptotic Analysis, Sorting, Divide & Conquer, Dynamic Programming, Greedy', status: 'not_started' }
            ]
          },
          {
            id: 'gate-os',
            name: 'Operating Systems',
            weightage: 'High',
            expectedQuestions: '8-10 Marks',
            topics: [
              { id: 'go1', name: 'Processes, Threads, CPU Scheduling, Deadlock', status: 'not_started' },
              { id: 'go2', name: 'Memory Management, Virtual Memory, Paging, File Systems', status: 'not_started' }
            ]
          },
          {
            id: 'gate-dbms',
            name: 'Databases & Computer Networks',
            weightage: 'High',
            expectedQuestions: '14-16 Marks',
            topics: [
              { id: 'gb1', name: 'ER Model, Relational Algebra, SQL, Normalization, Transactions', status: 'not_started' },
              { id: 'gb2', name: 'OSI/TCP-IP, IPv4/IPv6, Congestion Control, Routing, Socket Basics', status: 'not_started' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'syllabus-ssc-cgl',
    name: 'SSC CGL',
    fullName: 'Staff Selection Commission - Combined Graduate Level',
    category: 'Govt & Civil',
    year: '2026',
    verifiedOfficialSource: 'SSC Official Examination Notification',
    subjects: [
      {
        id: 'ssc-quant',
        name: 'Quantitative Aptitude & Reasoning',
        chapters: [
          {
            id: 'ssc-arithmetic',
            name: 'Arithmetic & Advanced Mathematics',
            weightage: 'High',
            expectedQuestions: '25 Questions (Tier 1)',
            topics: [
              { id: 'sq1', name: 'Percentages, Profit & Loss, Ratio & Proportion, SI & CI', status: 'not_started' },
              { id: 'sq2', name: 'Time & Work, Pipes & Cisterns, Speed, Distance & Time', status: 'not_started' },
              { id: 'sq3', name: 'Geometry, Mensuration, Trigonometry and Algebra', status: 'not_started' }
            ]
          }
        ]
      }
    ]
  }
];

// ==========================================
// Service Class Implementation
// ==========================================
export class LearningHubService {
  private static instance: LearningHubService;

  private constructor() {
    this.initDefaultSeed();
  }

  public static getInstance(): LearningHubService {
    if (!LearningHubService.instance) {
      LearningHubService.instance = new LearningHubService();
    }
    return LearningHubService.instance;
  }

  private initDefaultSeed(): void {
    try {
      // Seed curated starter courses if user has zero courses
      const existingCourses = this.getCourses();
      if (existingCourses.length === 0) {
        // Will load from backend or seed
      }
    } catch {
      // Ignore
    }
  }

  // ==========================================
  // Course Management
  // ==========================================
  public getCourses(): LearningCourse[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[LearningHub] Error reading courses:', e);
    }
    return [];
  }

  public saveCourses(courses: LearningCourse[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('[LearningHub] Failed to save courses:', e);
    }
  }

  public getActiveCourseId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE_ID) || '';
  }

  public setActiveCourseId(courseId: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COURSE_ID, courseId);
  }

  public getCourseById(id: string): LearningCourse | undefined {
    return this.getCourses().find((c) => c.id === id);
  }

  public enrollCourse(course: LearningCourse): void {
    const list = this.getCourses();
    const existingIdx = list.findIndex((c) => c.id === course.id || (c.playlistId && c.playlistId === course.playlistId));
    if (existingIdx >= 0) {
      list[existingIdx] = {
        ...list[existingIdx],
        ...course,
        lastAccessedAt: Date.now()
      };
    } else {
      list.unshift(course);
    }
    this.saveCourses(list);
    this.setActiveCourseId(course.id);
  }

  public createCourseFromLectures(params: {
    title: string;
    description?: string;
    examCategory?: string;
    lectures: LectureItem[];
    sourceUrl?: string;
    channelName?: string;
    thumbnailUrl?: string;
  }): LearningCourse {
    const {
      title,
      description,
      examCategory = 'General',
      lectures,
      sourceUrl = '',
      channelName = 'YouTube Educator',
      thumbnailUrl
    } = params;

    const chapters: { id: string; title: string; order: number; lectureIds: string[] }[] = [];
    let currentChapter = {
      id: 'ch-1',
      title: 'Module 1: Core Lectures',
      order: 1,
      lectureIds: [] as string[]
    };
    let chapterCount = 1;

    const formattedLectures = lectures.map((lec, idx) => {
      if (idx > 0 && idx % 6 === 0) {
        chapters.push(currentChapter);
        chapterCount++;
        currentChapter = {
          id: `ch-${chapterCount}`,
          title: `Module ${chapterCount}: Advanced Concepts`,
          order: chapterCount,
          lectureIds: []
        };
      }
      const item: LectureItem = {
        ...lec,
        order: idx + 1,
        chapterTitle: currentChapter.title,
        chapterIndex: chapterCount - 1
      };
      currentChapter.lectureIds.push(item.id);
      return item;
    });
    chapters.push(currentChapter);

    const totalDurationSeconds = formattedLectures.reduce(
      (acc, l) => acc + (l.durationSeconds || 0),
      0
    );
    const courseId = `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newCourse: LearningCourse = {
      id: courseId,
      title,
      description:
        description ||
        `Custom Study With Abhi course featuring ${formattedLectures.length} video lectures.`,
      sourceUrl,
      channelName,
      thumbnailUrl:
        thumbnailUrl ||
        formattedLectures[0]?.thumbnailUrl ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      examCategory,
      subject: 'Curriculum',
      chapters,
      lectures: formattedLectures,
      totalDurationSeconds,
      completedLecturesCount: 0,
      progressPercentage: 0,
      status: 'active',
      enrolledAt: Date.now(),
      lastAccessedAt: Date.now()
    };

    this.enrollCourse(newCourse);
    return newCourse;
  }

  public scheduleCourseInPlanner(
    course: LearningCourse,
    lecturesPerDay: number = 2
  ): PlannerTask[] {
    const tasks: PlannerTask[] = [];
    const today = new Date();
    let currentDayOffset = 0;

    course.lectures.forEach((lec, idx) => {
      if (idx > 0 && idx % lecturesPerDay === 0) {
        currentDayOffset++;
      }
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + currentDayOffset);
      const dateStr = targetDate.toISOString().split('T')[0];

      const estMins = Math.max(15, Math.round((lec.durationSeconds || 1800) / 60));
      const created = this.addTask({
        title: `Watch: ${lec.title}`,
        description: `Study lecture from course "${course.title}". Take timestamped notes & attempt quiz.`,
        date: dateStr,
        timeSlot: `${(9 + (idx % 3) * 3).toString().padStart(2, '0')}:00 - ${(
          10 +
          (idx % 3) * 3
        )
          .toString()
          .padStart(2, '0')}:30`,
        estimatedMinutes: estMins,
        priority: idx === 0 ? 'HIGH' : 'MEDIUM',
        status: 'To Do',
        examTag: course.examCategory || 'General',
        courseId: course.id,
        lectureId: lec.id
      });
      tasks.push(created);
    });

    return tasks;
  }

  public updateLectureProgress(
    courseId: string,
    lectureId: string,
    watchedSeconds: number,
    completedManual?: boolean
  ): { course: LearningCourse; newlyCompleted: boolean } {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex((c) => c.id === courseId);
    if (courseIndex === -1) throw new Error('Course not found');

    const course = { ...courses[courseIndex] };
    const lectureIndex = course.lectures.findIndex((l) => l.id === lectureId);
    if (lectureIndex === -1) throw new Error('Lecture not found');

    const lecture = { ...course.lectures[lectureIndex] };
    lecture.watchedSeconds = Math.max(lecture.watchedSeconds, watchedSeconds);
    lecture.lastWatchedAt = Date.now();

    // Check completion threshold (>80% of total duration or manually checked)
    const threshold = lecture.durationSeconds > 0 ? lecture.durationSeconds * 0.8 : 60;
    const previouslyCompleted = lecture.completed;
    const shouldMarkComplete = completedManual !== undefined ? completedManual : (lecture.watchedSeconds >= threshold);

    let newlyCompleted = false;
    if (shouldMarkComplete && !previouslyCompleted) {
      lecture.completed = true;
      lecture.completedAt = Date.now();
      newlyCompleted = true;
    } else if (completedManual === false) {
      lecture.completed = false;
    }

    course.lectures[lectureIndex] = lecture;
    course.completedLecturesCount = course.lectures.filter((l) => l.completed).length;
    course.progressPercentage = course.lectures.length > 0
      ? Math.round((course.completedLecturesCount / course.lectures.length) * 100)
      : 0;
    course.lastAccessedAt = Date.now();

    if (course.progressPercentage === 100) {
      course.status = 'completed';
    }

    courses[courseIndex] = course;
    this.saveCourses(courses);

    // Record study time into central workspace service
    addActiveStudyTime(course.id, 10, {
      name: course.title,
      category: course.examCategory || 'Video Course',
      logo: course.thumbnailUrl,
      url: course.sourceUrl
    });

    return { course, newlyCompleted };
  }

  public deleteCourse(courseId: string): void {
    const courses = this.getCourses().filter((c) => c.id !== courseId);
    this.saveCourses(courses);
    if (this.getActiveCourseId() === courseId) {
      this.setActiveCourseId(courses[0]?.id || '');
    }
  }

  // ==========================================
  // Timestamped Notes
  // ==========================================
  public getNotes(courseId?: string): TimestampedNote[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (raw) {
        const parsed: TimestampedNote[] = JSON.parse(raw);
        if (courseId) return parsed.filter((n) => n.courseId === courseId);
        return parsed;
      }
    } catch (e) {
      console.warn('[LearningHub] Error reading notes:', e);
    }
    return [];
  }

  public saveNote(note: Omit<TimestampedNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): TimestampedNote {
    const list = this.getNotes();
    const now = Date.now();
    let saved: TimestampedNote;

    if (note.id) {
      const idx = list.findIndex((n) => n.id === note.id);
      saved = {
        ...list[idx],
        ...note,
        id: note.id,
        updatedAt: now
      };
      if (idx >= 0) list[idx] = saved;
      else list.unshift(saved);
    } else {
      saved = {
        ...note,
        id: `note-${now}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: now,
        updatedAt: now
      };
      list.unshift(saved);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(list));
    } catch (e) {
      console.error('[LearningHub] Failed to save note:', e);
    }
    return saved;
  }

  public deleteNote(noteId: string): void {
    const list = this.getNotes().filter((n) => n.id !== noteId);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(list));
  }

  // ==========================================
  // Study Planner Tasks
  // ==========================================
  public getTasks(dateFilter?: string): PlannerTask[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLANNER_TASKS);
      if (raw) {
        const parsed: PlannerTask[] = JSON.parse(raw);
        if (dateFilter) return parsed.filter((t) => t.date === dateFilter);
        return parsed;
      }
    } catch {
      // Ignore
    }
    return [];
  }

  public saveTasks(tasks: PlannerTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANNER_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('[LearningHub] Error saving planner tasks:', e);
    }
  }

  public addTask(task: Omit<PlannerTask, 'id' | 'createdAt'>): PlannerTask {
    const list = this.getTasks();
    const newTask: PlannerTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    list.unshift(newTask);
    this.saveTasks(list);
    return newTask;
  }

  public toggleTaskStatus(taskId: string): PlannerTask | undefined {
    const list = this.getTasks();
    const idx = list.findIndex((t) => t.id === taskId);
    if (idx === -1) return undefined;

    const current = list[idx];
    const nextStatus: PlannerTask['status'] =
      current.status === 'Done' ? 'To Do' : current.status === 'In Progress' ? 'Done' : 'Done';

    list[idx] = {
      ...current,
      status: nextStatus,
      completedAt: nextStatus === 'Done' ? Date.now() : undefined
    };
    this.saveTasks(list);

    // If task was linked to a syllabus topic, reflect status in syllabus progress
    if (current.syllabusTopicId && nextStatus === 'Done') {
      const overrides = this.getSavedSyllabusOverrides();
      overrides[current.syllabusTopicId] = {
        ...(overrides[current.syllabusTopicId] || {}),
        status: 'completed',
        updatedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(overrides));
    }
    if (nextStatus === 'Done') {
      this.recordDailyActivity(15, 1);
    }
    return list[idx];
  }

  public deleteTask(taskId: string): void {
    const list = this.getTasks().filter((t) => t.id !== taskId);
    this.saveTasks(list);
  }

  // ==========================================
  // Syllabus Tracking & Exam Management
  // ==========================================
  public getSyllabusTracks(): SyllabusExamTrack[] {
    // Merge comprehensive official tracks with user's saved status overrides
    const savedOverrides = this.getSavedSyllabusOverrides();
    return COMPREHENSIVE_SYLLABUS_TRACKS.map((track) => {
      return {
        ...track,
        subjects: track.subjects.map((sub) => ({
          ...sub,
          chapters: sub.chapters.map((ch) => ({
            ...ch,
            topics: ch.topics.map((t) => {
              const override = savedOverrides[t.id];
              return override ? { ...t, ...override } : t;
            })
          }))
        }))
      };
    });
  }

  public getSavedSyllabusOverrides(): Record<string, Partial<SyllabusTopic>> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SYLLABUS_PROGRESS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public updateTopicStatus(
    topicId: string,
    status: SyllabusTopic['status'],
    isDifficult?: boolean,
    isBookmarked?: boolean,
    incrementRevision?: boolean
  ): void {
    const overrides = this.getSavedSyllabusOverrides();
    const current = overrides[topicId] || {};
    const nextRevision = incrementRevision ? (current.revisionCount || 0) + 1 : current.revisionCount;

    overrides[topicId] = {
      ...current,
      status,
      isDifficult: isDifficult !== undefined ? isDifficult : current.isDifficult,
      isBookmarked: isBookmarked !== undefined ? isBookmarked : current.isBookmarked,
      revisionCount: nextRevision,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(overrides));

    // If marked completed, also sync corresponding planner task to Done
    if (status === 'completed') {
      const tasks = this.getTasks();
      const matched = tasks.find((t) => t.syllabusTopicId === topicId && t.status !== 'Done');
      if (matched) {
        matched.status = 'Done';
        matched.completedAt = Date.now();
        this.saveTasks(tasks);
        this.recordDailyActivity(15, 1);
      }
    }
  }

  public toggleTopicBookmark(topicId: string): boolean {
    const overrides = this.getSavedSyllabusOverrides();
    const current = overrides[topicId] || {};
    const nextState = !current.isBookmarked;
    overrides[topicId] = {
      ...current,
      isBookmarked: nextState,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(overrides));
    return nextState;
  }

  public resetExamProgress(examId: string): void {
    const overrides = this.getSavedSyllabusOverrides();
    const allTracks = this.getSyllabusTracks();
    const exam = allTracks.find((e) => e.id === examId);
    if (!exam) return;

    // Collect all topic IDs for this exam and clear their overrides
    exam.subjects.forEach((s) => {
      s.chapters.forEach((c) => {
        c.topics.forEach((t) => {
          delete overrides[t.id];
        });
      });
    });

    localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(overrides));
  }

  // Active Selected Exam Persistence
  public getActiveExamId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_EXAM_ID) || null;
    } catch {
      return null;
    }
  }

  public setActiveExamId(examId: string | null): void {
    if (examId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_EXAM_ID, examId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_EXAM_ID);
    }
  }

  // Exam Preparation Setups
  public getExamSetups(): Record<string, ExamSetupConfig> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXAM_SETUPS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  public getExamSetup(examId: string): ExamSetupConfig | undefined {
    return this.getExamSetups()[examId];
  }

  public saveExamSetup(setup: ExamSetupConfig): void {
    const setups = this.getExamSetups();
    setups[setup.examId] = {
      ...setup,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.EXAM_SETUPS, JSON.stringify(setups));
  }

  // Bookmarked / Favourited Exams in Directory
  public getBookmarkedExamIds(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_EXAMS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public toggleExamBookmark(examId: string): boolean {
    const list = this.getBookmarkedExamIds();
    const idx = list.indexOf(examId);
    let nextList: string[];
    let bookmarked: boolean;

    if (idx >= 0) {
      nextList = list.filter((id) => id !== examId);
      bookmarked = false;
    } else {
      nextList = [...list, examId];
      bookmarked = true;
    }

    localStorage.setItem(STORAGE_KEYS.BOOKMARKED_EXAMS, JSON.stringify(nextList));
    return bookmarked;
  }

  // ==========================================
  // Flashcards (Spaced Repetition)
  // ==========================================
  public getFlashcards(): Flashcard[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    // Return high-yield starter flashcards if empty
    return [
      {
        id: 'fc-1',
        subject: 'Physics',
        topic: 'Rotational Motion',
        frontQuestion: 'State the Parallel Axis Theorem for Moment of Inertia.',
        backAnswer: 'I = I_cm + M * d^2, where I_cm is moment of inertia about parallel axis passing through centre of mass, and d is perpendicular distance.',
        boxLevel: 2,
        status: 'learning',
        createdAt: Date.now()
      },
      {
        id: 'fc-2',
        subject: 'Chemistry',
        topic: 'Electrochemistry',
        frontQuestion: 'What is the Nernst Equation for a general cell at 298 K?',
        backAnswer: 'E_cell = E°_cell - (0.0591 / n) * log10(Q), where n is moles of electrons transferred and Q is reaction quotient.',
        boxLevel: 3,
        status: 'mastered',
        createdAt: Date.now()
      },
      {
        id: 'fc-3',
        subject: 'Biology',
        topic: 'Genetics',
        frontQuestion: 'What is the phenotypic and genotypic ratio of a Monohybrid Cross (F2 generation)?',
        backAnswer: 'Phenotypic ratio: 3:1 (Dominant : Recessive). Genotypic ratio: 1:2:1 (Homozygous dominant : Heterozygous : Homozygous recessive).',
        boxLevel: 1,
        status: 'new',
        createdAt: Date.now()
      }
    ];
  }

  public saveFlashcard(card: Omit<Flashcard, 'id' | 'createdAt'> & { id?: string }): Flashcard {
    const list = this.getFlashcards();
    let saved: Flashcard;
    if (card.id) {
      const idx = list.findIndex((c) => c.id === card.id);
      saved = { ...list[idx], ...card, id: card.id };
      if (idx >= 0) list[idx] = saved;
      else list.unshift(saved);
    } else {
      saved = {
        ...card,
        id: `fc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: Date.now()
      };
      list.unshift(saved);
    }
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(list));
    return saved;
  }

  public reviewFlashcard(cardId: string, remembered: boolean): void {
    const list = this.getFlashcards();
    const idx = list.findIndex((c) => c.id === cardId);
    if (idx === -1) return;

    const card = list[idx];
    if (remembered) {
      card.boxLevel = Math.min((card.boxLevel || 1) + 1, 5);
      card.status = card.boxLevel >= 4 ? 'mastered' : 'learning';
    } else {
      card.boxLevel = 1;
      card.status = 'needs_revision';
    }
    card.lastReviewedAt = Date.now();
    list[idx] = card;
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(list));
  }

  public deleteFlashcard(cardId: string): void {
    const list = this.getFlashcards().filter((c) => c.id !== cardId);
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(list));
  }

  // ==========================================
  // Quiz Attempts & Weak Topic Diagnostics
  // ==========================================
  public getQuizAttempts(): QuizAttemptResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return [];
  }

  public saveQuizAttempt(attempt: QuizAttemptResult): void {
    try {
      const list = this.getQuizAttempts();
      list.unshift(attempt);
      localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.error('[LearningHub] Error saving quiz attempt:', e);
    }
  }

  public getWeakTopics(): string[] {
    const attempts = this.getQuizAttempts();
    const weak = new Set<string>();
    attempts.forEach((a) => {
      if (a.scorePercentage < 70 && a.topicOrLecture) {
        weak.add(a.topicOrLecture);
      }
    });
    return Array.from(weak);
  }

  // ==========================================
  // User Settings & Streaks
  // ==========================================
  public getUserSettings(): LearningHubUserSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (raw) return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
    } catch {
      // Ignore
    }
    return DEFAULT_USER_SETTINGS;
  }

  public saveUserSettings(settings: Partial<LearningHubUserSettings>): void {
    const current = this.getUserSettings();
    const merged = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  }

  public getStudyStreak(): { streakDays: number; lastActiveDate: string } {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Ignore
    }
    const today = new Date().toISOString().split('T')[0];
    return { streakDays: 3, lastActiveDate: today };
  }

  public recordDailyActivity(minutesLearned: number = 0, plannerTasksDone: number = 0): void {
    const today = new Date().toISOString().split('T')[0];
    const current = this.getStudyStreak();

    // Check if consecutive day
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    let nextStreak = current.streakDays;
    if (current.lastActiveDate !== today) {
      nextStreak = current.lastActiveDate === yesterday ? current.streakDays + 1 : 1;
      localStorage.setItem(
        STORAGE_KEYS.STREAK,
        JSON.stringify({ streakDays: nextStreak, lastActiveDate: today })
      );
    }

    // Record into daily activity heatmap logs
    try {
      const logs = this.getDailyLogs();
      const existing = logs[today] || { date: today, minutes: 0, tasksDone: 0, sessionsCount: 0 };
      logs[today] = {
        date: today,
        minutes: existing.minutes + minutesLearned,
        tasksDone: existing.tasksDone + plannerTasksDone,
        sessionsCount: existing.sessionsCount + 1
      };
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
    } catch {
      // Ignore quota
    }
  }

  public getDailyLogs(): Record<string, { date: string; minutes: number; tasksDone: number; sessionsCount: number }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    // Return initial seed based on today if empty
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: { date: today, minutes: 25, tasksDone: 1, sessionsCount: 1 }
    };
  }

  // Cross-feature sync: Schedule syllabus topic into daily planner without duplicates
  public scheduleTopicToPlanner(topic: SyllabusTopic, chapterName: string, subjectName: string, examName: string, targetDate?: string): { success: boolean; task?: PlannerTask; isDuplicate?: boolean } {
    const date = targetDate || new Date().toISOString().split('T')[0];
    const title = `${subjectName}: ${topic.name}`;
    const desc = `Syllabus Chapter: ${chapterName} (${examName}) · Target study & active recall session`;

    const existingTasks = this.getTasks();
    const existing = existingTasks.find(
      (t) => (t.syllabusTopicId === topic.id && t.date === date) ||
             (t.title.toLowerCase().trim() === title.toLowerCase().trim() && t.date === date)
    );

    if (existing) {
      return { success: true, task: existing, isDuplicate: true };
    }

    const newTask = this.addTask({
      title,
      description: desc,
      date,
      timeSlot: '08:00 - 09:30 AM',
      priority: topic.isDifficult ? 'HIGH' : 'MEDIUM',
      status: 'To Do',
      examTag: examName,
      subject: subjectName,
      syllabusTopicId: topic.id
    });

    return { success: true, task: newTask, isDuplicate: false };
  }

  // Calculate student achievements dynamically based on genuine activity
  public getAchievements(): StudentAchievement[] {
    const totalSeconds = getStoredTotalSeconds();
    const hours = Math.round(totalSeconds / 3600);
    const courses = this.getCourses();
    const completedLectures = courses.reduce((acc, c) => acc + (c.completedLecturesCount || 0), 0);
    const streak = this.getStudyStreak().streakDays;

    return [
      {
        id: 'ach-first-step',
        title: 'First Step',
        description: 'Complete your first structured video lecture.',
        icon: 'Footprints',
        unlocked: completedLectures >= 1,
        category: 'lectures',
        progress: Math.min(completedLectures, 1),
        target: 1
      },
      {
        id: 'ach-5-lectures',
        title: 'Focused Scholar',
        description: 'Complete 5 structured curriculum lectures.',
        icon: 'GraduationCap',
        unlocked: completedLectures >= 5,
        category: 'lectures',
        progress: Math.min(completedLectures, 5),
        target: 5
      },
      {
        id: 'ach-10-lectures',
        title: 'Curriculum Master',
        description: 'Complete 10 structured lectures.',
        icon: 'Award',
        unlocked: completedLectures >= 10,
        category: 'lectures',
        progress: Math.min(completedLectures, 10),
        target: 10
      },
      {
        id: 'ach-7-streak',
        title: '7-Day Study Streak',
        description: 'Study consistently for 7 consecutive days.',
        icon: 'Flame',
        unlocked: streak >= 7,
        category: 'streak',
        progress: Math.min(streak, 7),
        target: 7
      },
      {
        id: 'ach-30-streak',
        title: '30-Day Relentless Habit',
        description: 'Achieve a 30-day continuous study habit.',
        icon: 'Zap',
        unlocked: streak >= 30,
        category: 'streak',
        progress: Math.min(streak, 30),
        target: 30
      },
      {
        id: 'ach-10-hours',
        title: '10 Hours Deep Focus',
        description: 'Accumulate 10 verified hours of active study time.',
        icon: 'Clock',
        unlocked: hours >= 10,
        category: 'hours',
        progress: Math.min(hours, 10),
        target: 10
      },
      {
        id: 'ach-course-finisher',
        title: 'Course Finisher',
        description: 'Complete 100% of an enrolled structured course.',
        icon: 'Trophy',
        unlocked: courses.some((c) => c.status === 'completed' || c.progressPercentage >= 100),
        category: 'mastery',
        progress: courses.some((c) => c.status === 'completed' || c.progressPercentage >= 100) ? 1 : 0,
        target: 1
      }
    ];
  }

  // Backup & Restore
  public exportDataBackupJSON(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      courses: this.getCourses(),
      notes: this.getNotes(),
      tasks: this.getTasks(),
      syllabusOverrides: this.getSavedSyllabusOverrides(),
      flashcards: this.getFlashcards(),
      settings: this.getUserSettings(),
      streak: this.getStudyStreak()
    };
    return JSON.stringify(backup, null, 2);
  }

  public importDataBackupJSON(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') throw new Error('Invalid backup file format');

      if (Array.isArray(data.courses)) this.saveCourses(data.courses);
      if (Array.isArray(data.notes)) localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.notes));
      if (Array.isArray(data.tasks)) this.saveTasks(data.tasks);
      if (data.syllabusOverrides) localStorage.setItem(STORAGE_KEYS.SYLLABUS_PROGRESS, JSON.stringify(data.syllabusOverrides));
      if (Array.isArray(data.flashcards)) localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(data.flashcards));
      if (data.settings) this.saveUserSettings(data.settings);
      if (data.streak) localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data.streak));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to parse backup JSON.' };
    }
  }
}

export const learningHubService = LearningHubService.getInstance();
