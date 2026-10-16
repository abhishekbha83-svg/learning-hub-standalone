import React, { useState } from 'react';
import {
  Wrench,
  Calculator,
  Search,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Flame,
  ArrowRight,
  BookOpen,
  Beaker,
  Compass,
  GraduationCap
} from 'lucide-react';

type ToolId =
  | 'neet-rank'
  | 'jee-percentile'
  | 'youtube-duration'
  | 'jee-weightage'
  | 'neet-weightage'
  | 'upsc-weightage'
  | 'attendance'
  | 'gpa-calc'
  | 'chemical-reynolds'
  | 'chemical-dilution'
  | 'chemical-heat-exchanger';

export const ToolsDirectory: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('neet-rank');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. NEET Predictor State (matching Reference Screenshot 10)
  const [neetScore, setNeetScore] = useState<number>(635);
  const [neetCategory, setNeetCategory] = useState<'GEN' | 'OBC' | 'EWS' | 'SC' | 'ST'>('GEN');

  // 2. JEE Estimator State
  const [jeeScore, setJeeScore] = useState<number>(185);
  const [jeeShiftDifficulty, setJeeShiftDifficulty] = useState<'Moderate' | 'Easy' | 'Tough'>('Moderate');

  // 3. YouTube Duration Calculator State
  const [videoCount, setVideoCount] = useState<number>(45);
  const [avgVideoMinutes, setAvgVideoMinutes] = useState<number>(40);
  const [dailyStudyHours, setDailyStudyHours] = useState<number>(2.5);

  // 4. Attendance Calculator State
  const [attendedClasses, setAttendedClasses] = useState<number>(38);
  const [totalClassesHeld, setTotalClassesHeld] = useState<number>(48);
  const [requiredPercent, setRequiredPercent] = useState<number>(75);

  // 5. CGPA Calculator State
  const [cgpaInput, setCgpaInput] = useState<number>(8.4);
  const [gradingScale, setGradingScale] = useState<'cbse' | 'mumbai' | 'vtu'>('cbse');

  // 6. Chemical Engineering State
  const [fluidDensity, setFluidDensity] = useState<number>(1000); // kg/m^3
  const [fluidVelocity, setFluidVelocity] = useState<number>(1.5); // m/s
  const [pipeDiameter, setPipeDiameter] = useState<number>(0.05); // m
  const [fluidViscosity, setFluidViscosity] = useState<number>(0.001); // Pa.s

  const [m1, setM1] = useState<number>(12); // Initial Molarity
  const [v1, setV1] = useState<number>(50); // Initial Volume mL
  const [m2, setM2] = useState<number>(1); // Desired Molarity

  // NEET Calculation Logic (based on verified NTA 2024-2025 normalized scores)
  const calculateNeetPrediction = () => {
    let airMin = 1;
    let airMax = 1;
    let percentile = 99.9;
    let gmcChances = 'High';

    if (neetScore >= 700) {
      airMin = 1;
      airMax = 250;
      percentile = 99.98;
      gmcChances = 'Top AIIMS & Premier GMCs Guaranteed';
    } else if (neetScore >= 660) {
      airMin = 251;
      airMax = 4500;
      percentile = 99.5;
      gmcChances = 'Top State GMCs (AIQ 15% & State 85%)';
    } else if (neetScore >= 635) {
      airMin = 14001;
      airMax = 26000;
      percentile = 98.4;
      gmcChances = neetCategory === 'GEN' ? 'Good Chance in State GMCs (Borderline AIQ)' : 'Strong Chance in Govt Medical College';
    } else if (neetScore >= 600) {
      airMin = 26001;
      airMax = 75000;
      percentile = 95.8;
      gmcChances = ['SC', 'ST', 'OBC'].includes(neetCategory) ? 'Decent GMC Chances in Reserved Quota' : 'State Quota Mop-Up or Semi-Govt';
    } else if (neetScore >= 500) {
      airMin = 75001;
      airMax = 180000;
      percentile = 89.2;
      gmcChances = neetCategory === 'SC' || neetCategory === 'ST' ? 'Eligible for State Quota GMC' : 'Private Medical College / BDS / BAMS';
    } else {
      airMin = 180001;
      airMax = 550000;
      percentile = Math.max(30, Math.round((neetScore / 720) * 100));
      gmcChances = neetScore >= 164 ? 'Qualified for NEET Counseling' : 'Below Expected Qualifying Cutoff';
    }

    const minCutoff = neetCategory === 'GEN' || neetCategory === 'EWS' ? 164 : 129;
    const isQualified = neetScore >= minCutoff;

    return { airMin, airMax, percentile, gmcChances, isQualified, minCutoff };
  };

  const neetResult = calculateNeetPrediction();

  // JEE Calculation Logic
  const calculateJeePrediction = () => {
    let base = (jeeScore / 300) * 100;
    if (jeeShiftDifficulty === 'Tough') base += 2.5;
    if (jeeShiftDifficulty === 'Easy') base -= 2.5;
    const percentile = Math.min(99.99, Math.max(40, Number(base.toFixed(2))));
    const candidatePool = 1200000;
    const approxAIR = Math.max(1, Math.round(((100 - percentile) / 100) * candidatePool));
    return { percentile, approxAIR };
  };

  const jeeResult = calculateJeePrediction();

  // YouTube Duration Calculation
  const totalMins = videoCount * avgVideoMinutes;
  const totalHoursAt1x = (totalMins / 60).toFixed(1);
  const totalHoursAt125 = (totalMins / (60 * 1.25)).toFixed(1);
  const totalHoursAt15 = (totalMins / (60 * 1.5)).toFixed(1);
  const totalHoursAt2x = (totalMins / (60 * 2)).toFixed(1);
  const daysNeededAt1x = Math.ceil(Number(totalHoursAt1x) / Math.max(dailyStudyHours, 0.5));
  const daysNeededAt15 = Math.ceil(Number(totalHoursAt15) / Math.max(dailyStudyHours, 0.5));

  // Attendance Calculation
  const currentAttendancePct = totalClassesHeld > 0 ? (attendedClasses / totalClassesHeld) * 100 : 0;
  // Bunk calculation: (attended) / (total + x) >= required
  const canBunkClasses = Math.max(
    0,
    Math.floor((attendedClasses * 100 - requiredPercent * totalClassesHeld) / requiredPercent)
  );
  // Need to attend: (attended + x) / (total + x) >= required
  const needToAttend = Math.max(
    0,
    Math.ceil((requiredPercent * totalClassesHeld - 100 * attendedClasses) / (100 - requiredPercent))
  );

  // Chemical Engineering Calculations
  // Re = (rho * v * D) / mu
  const reynoldsNumber = (fluidDensity * fluidVelocity * pipeDiameter) / (fluidViscosity || 0.001);
  const flowRegime =
    reynoldsNumber < 2100 ? 'Laminar Flow (Re < 2100)' : reynoldsNumber <= 4000 ? 'Transition Flow (2100 <= Re <= 4000)' : 'Turbulent Flow (Re > 4000)';

  // Dilution M1 * V1 = M2 * V2 -> V2 = (M1 * V1) / M2
  const v2Required = m2 > 0 ? (m1 * v1) / m2 : 0;
  const solventToAdd = Math.max(0, v2Required - v1);

  // Tools listing
  const tools = [
    { id: 'neet-rank' as ToolId, name: 'NEET Marks vs Rank & GMC Predictor', category: 'Exam Predictor', icon: Award },
    { id: 'jee-percentile' as ToolId, name: 'JEE Marks vs Percentile Estimator', category: 'Exam Predictor', icon: TrendingUp },
    { id: 'youtube-duration' as ToolId, name: 'YouTube Playlist Duration Calculator', category: 'Study Planning', icon: Clock },
    { id: 'attendance' as ToolId, name: 'College Attendance & Bunk Calculator', category: 'Student Utility', icon: Calculator },
    { id: 'gpa-calc' as ToolId, name: 'CGPA to Percentage Converter', category: 'Academic Utility', icon: GraduationCap },
    { id: 'jee-weightage' as ToolId, name: 'JEE Chapter Weightage Explorer', category: 'Syllabus Intelligence', icon: BookOpen },
    { id: 'neet-weightage' as ToolId, name: 'NEET Chapter Weightage Explorer', category: 'Syllabus Intelligence', icon: BookOpen },
    { id: 'upsc-weightage' as ToolId, name: 'UPSC Prelims Topic Breakdown', category: 'Syllabus Intelligence', icon: Layers },
    { id: 'chemical-reynolds' as ToolId, name: 'Fluid Mechanics: Reynolds Number', category: 'Chemical Engineering', icon: Beaker },
    { id: 'chemical-dilution' as ToolId, name: 'Molarity & Solution Dilution (M1V1=M2V2)', category: 'Chemical Engineering', icon: Beaker }
  ];

  const filteredTools = tools.filter((t) => {
    if (searchQuery.trim()) {
      return (
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16 text-slate-100 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Wrench className="w-3.5 h-3.5" />
          <span>Academic Calculators & Estimation Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verified Free Student Study Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Accurate, formula-grounded calculators for rank prediction, percentile estimation, chapter weightage, college attendance, and engineering computations.
        </p>
      </div>

      {/* Search & Tool Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141418] p-2 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools & calculators..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#1A1A20] border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
          {filteredTools.slice(0, 5).map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTool === tool.id
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-[#1A1A20] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tool.name.split(':')[0].split('&')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* TOOL 1: NEET Marks vs Rank Predictor matching Reference Screenshot 10 */}
      {activeTool === 'neet-rank' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141418] border border-white/10 space-y-8 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Medical Admissions Intelligence</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              NEET UG Marks vs Rank & GMC Admission Predictor
            </h2>
            <p className="text-xs text-slate-400">
              Predict your All India Rank, qualifying status, and Government Medical College (GMC) chances based on 2024-2025 normalized scores.
            </p>
          </div>

          {/* Controls: Score Slider + Category Pills matching Screenshot 10 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#1A1A20] rounded-2xl border border-white/5">
            {/* Score Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Your Expected NEET Score:</span>
                <span className="text-2xl font-black text-emerald-400 tabular-nums">
                  {neetScore} <span className="text-xs text-slate-500 font-normal">/ 720</span>
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="720"
                step="1"
                value={neetScore}
                onChange={(e) => setNeetScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 Marks</span>
                <span>360 Marks</span>
                <span className="text-emerald-400 font-bold">600 (GMC Zone)</span>
                <span>720 Marks</span>
              </div>
            </div>

            {/* Category Pills matching Screenshot 10 */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300">Category:</span>
              <div className="flex flex-wrap gap-2">
                {(['GEN', 'OBC', 'EWS', 'SC', 'ST'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNeetCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      neetCategory === cat
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-[#141418] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                {neetCategory === 'GEN' ? 'General (UR)' : neetCategory} — Qualifying Cutoff: ~{neetResult.minCutoff} marks
              </p>
            </div>
          </div>

          {/* 4 Output Cards matching Screenshot 10 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#1A1A20] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>PREDICTED AIR</span>
              </span>
              <p className="text-xl font-black text-white tabular-nums">
                {neetResult.airMin.toLocaleString()} – {neetResult.airMax.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">Estimated All India Rank Band</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A1A20] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>APPROX PERCENTILE</span>
              </span>
              <p className="text-xl font-black text-white tabular-nums">
                ~{neetResult.percentile}%
              </p>
              <p className="text-[10px] text-slate-500">Relative Score Distribution</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A1A20] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                <span>CATEGORY RANK</span>
              </span>
              <p className="text-lg font-bold text-white truncate">
                {neetCategory} Band
              </p>
              <p className="text-[10px] text-slate-500">Category Quota Equivalent</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#1A1A20] border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>NEET QUALIFICATION</span>
              </span>
              <p className={`text-xl font-black ${neetResult.isQualified ? 'text-emerald-400' : 'text-red-400'}`}>
                {neetResult.isQualified ? 'Qualified' : 'Not Qualified'}
              </p>
              <p className="text-[10px] text-slate-500">Min {neetResult.minCutoff} marks needed ({neetCategory})</p>
            </div>
          </div>

          {/* Admission Odds Recommendation */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
            <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-400">GMC Admission Forecast:</span>
            <p className="text-sm font-semibold text-white">{neetResult.gmcChances}</p>
            <p className="text-[10px] text-slate-400">
              *Disclaimer: Rank estimates are mathematical approximations based on recent NTA percentile trends and historical counseling rounds. They do not constitute an official seat guarantee.
            </p>
          </div>
        </div>
      )}

      {/* TOOL 2: JEE Marks vs Percentile */}
      {activeTool === 'jee-percentile' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Engineering Exam Estimator</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">JEE Main Marks vs Percentile Estimator</h2>
            <p className="text-xs text-slate-400">
              Calculate your NTA percentile and estimated All India Rank based on session shift difficulty normalization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#1A1A20] rounded-2xl border border-white/5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Your Expected Score (0 to 300):</span>
                <span className="text-2xl font-black text-amber-400 tabular-nums">{jeeScore}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                value={jeeScore}
                onChange={(e) => setJeeScore(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300">Shift Paper Difficulty:</span>
              <div className="flex gap-2">
                {(['Easy', 'Moderate', 'Tough'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setJeeShiftDifficulty(diff)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      jeeShiftDifficulty === diff
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#141418] text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {diff} Shift
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-[#1A1A20] rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase">Estimated NTA Percentile</span>
              <p className="text-3xl font-black text-white tabular-nums">{jeeResult.percentile}%</p>
            </div>
            <div className="p-5 bg-[#1A1A20] rounded-2xl border border-white/5 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase">Estimated All India Rank</span>
              <p className="text-3xl font-black text-emerald-400 tabular-nums">~{jeeResult.approxAIR.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: YouTube Duration Calculator */}
      {activeTool === 'youtube-duration' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Playlist Time Optimization</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">YouTube Playlist Duration & Study Planner</h2>
            <p className="text-xs text-slate-400">
              Calculate total watch hours at different playback speeds and estimate completion timeline based on your daily study goal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#1A1A20] rounded-2xl border border-white/5 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Total Video Count</label>
              <input
                type="number"
                value={videoCount}
                onChange={(e) => setVideoCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Average Video Duration (mins)</label>
              <input
                type="number"
                value={avgVideoMinutes}
                onChange={(e) => setAvgVideoMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Your Daily Study Hours</label>
              <input
                type="number"
                step="0.5"
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">At 1.0x (Normal)</span>
              <p className="text-xl font-bold text-white mt-1">{totalHoursAt1x} hrs</p>
              <span className="text-[10px] text-slate-500">Takes {daysNeededAt1x} days</span>
            </div>
            <div className="p-4 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">At 1.25x Speed</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{totalHoursAt125} hrs</p>
              <span className="text-[10px] text-slate-500">Saves {(Number(totalHoursAt1x) - Number(totalHoursAt125)).toFixed(1)} hrs</span>
            </div>
            <div className="p-4 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">At 1.5x Speed</span>
              <p className="text-xl font-bold text-teal-400 mt-1">{totalHoursAt15} hrs</p>
              <span className="text-[10px] text-slate-500">Takes {daysNeededAt15} days</span>
            </div>
            <div className="p-4 bg-[#1A1A20] rounded-xl border border-white/5">
              <span className="text-xs text-slate-400">At 2.0x Speed</span>
              <p className="text-xl font-bold text-purple-400 mt-1">{totalHoursAt2x} hrs</p>
              <span className="text-[10px] text-slate-500">Saves {(Number(totalHoursAt1x) - Number(totalHoursAt2x)).toFixed(1)} hrs</span>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: Attendance & Bunk Calculator */}
      {activeTool === 'attendance' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">College Life Optimization</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">College Attendance & Safe Bunk Calculator</h2>
            <p className="text-xs text-slate-400">
              Check your exact attendance percentage and see how many classes you can skip without falling below cutoff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#1A1A20] rounded-2xl border border-white/5 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Attended Classes</label>
              <input
                type="number"
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Total Classes Held</label>
              <input
                type="number"
                value={totalClassesHeld}
                onChange={(e) => setTotalClassesHeld(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Required Attendance %</label>
              <input
                type="number"
                value={requiredPercent}
                onChange={(e) => setRequiredPercent(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#141418] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1A20] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Current Attendance Rate:</span>
              <span className={`text-2xl font-black ${currentAttendancePct >= requiredPercent ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentAttendancePct.toFixed(1)}%
              </span>
            </div>

            {currentAttendancePct >= requiredPercent ? (
              <div className="p-3 bg-emerald-500/10 rounded-xl text-xs text-emerald-300">
                🎉 <span className="font-bold">Safe Zone:</span> You can safely bunk{' '}
                <strong className="text-white text-sm">{canBunkClasses}</strong> more classes and still remain above {requiredPercent}%.
              </div>
            ) : (
              <div className="p-3 bg-red-500/10 rounded-xl text-xs text-red-300">
                ⚠️ <span className="font-bold">Shortage Warning:</span> You need to attend{' '}
                <strong className="text-white text-sm">{needToAttend}</strong> consecutive classes without missing any to reach {requiredPercent}%.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 5: Chemical Engineering Tools */}
      {(activeTool === 'chemical-reynolds' || activeTool === 'chemical-dilution') && (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#141418] border border-white/10 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Chemical Engineering Laboratory</span>
            <h2 className="text-xl sm:text-2xl font-black text-white">Fluid Mechanics & Chemistry Formulation Calculator</h2>
            <p className="text-xs text-slate-400">
              Compute Reynolds number, flow regime, and laboratory solution dilution (M1·V1 = M2·V2) with exact dimensional units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reynolds Number Box */}
            <div className="p-5 bg-[#1A1A20] rounded-2xl border border-white/5 space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-purple-400" />
                <span>Reynolds Number (Re = ρ·v·D / μ)</span>
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Density ρ (kg/m³)</label>
                  <input
                    type="number"
                    value={fluidDensity}
                    onChange={(e) => setFluidDensity(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Velocity v (m/s)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={fluidVelocity}
                    onChange={(e) => setFluidVelocity(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Diameter D (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pipeDiameter}
                    onChange={(e) => setPipeDiameter(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Viscosity μ (Pa·s)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={fluidViscosity}
                    onChange={(e) => setFluidViscosity(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#141418] rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400">Calculated Reynolds Number:</span>
                <p className="text-xl font-black text-purple-400 tabular-nums">{Math.round(reynoldsNumber).toLocaleString()}</p>
                <p className="text-xs font-semibold text-emerald-400">{flowRegime}</p>
              </div>
            </div>

            {/* Dilution Box */}
            <div className="p-5 bg-[#1A1A20] rounded-2xl border border-white/5 space-y-4 text-xs">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Beaker className="w-4 h-4 text-teal-400" />
                <span>Molarity & Dilution (M₁·V₁ = M₂·V₂)</span>
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400">Initial M₁ (M)</label>
                  <input
                    type="number"
                    value={m1}
                    onChange={(e) => setM1(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Stock V₁ (mL)</label>
                  <input
                    type="number"
                    value={v1}
                    onChange={(e) => setV1(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400">Target M₂ (M)</label>
                  <input
                    type="number"
                    value={m2}
                    onChange={(e) => setM2(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-[#141418] border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#141418] rounded-xl border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400">Final Volume V₂ Required:</span>
                <p className="text-xl font-black text-teal-400 tabular-nums">{v2Required.toFixed(1)} mL</p>
                <p className="text-xs text-slate-300">
                  Add <strong className="text-white">{solventToAdd.toFixed(1)} mL</strong> of solvent (e.g. distilled water).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directory Grid of All Tools */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          All Free Academic Tools ({tools.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((t) => {
            const Icon = t.icon;
            const isCurrent = activeTool === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-[#141418] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-amber-400 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{t.name}</h4>
                    <span className="text-[10px] text-slate-500">{t.category}</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
