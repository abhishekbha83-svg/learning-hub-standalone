import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Save,
  Moon,
  Sun,
  Clock,
  BookOpen
} from 'lucide-react';
import { learningHubService } from '../../services/learningHubService';
import { LearningHubUserSettings } from '../../types/learningHub';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<LearningHubUserSettings>(() =>
    learningHubService.getUserSettings()
  );
  const [importStatus, setImportStatus] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    learningHubService.saveUserSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportBackup = () => {
    const json = learningHubService.exportDataBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StudyWithAbhi_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = learningHubService.importDataBackupJSON(content);
      if (res.success) {
        setImportStatus('Backup restored successfully! Refreshing...');
        setTimeout(() => window.location.reload(), 1200);
      } else {
        setImportStatus(`Restore failed: ${res.error || 'Invalid file format'}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141418] border border-white/15 max-w-xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-black text-white tracking-tight">Learning Hub Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Target Examination</label>
              <input
                type="text"
                value={settings.targetExamName}
                onChange={(e) => setSettings({ ...settings, targetExamName: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Target Exam Date</label>
              <input
                type="date"
                value={settings.targetExamDate}
                onChange={(e) => setSettings({ ...settings, targetExamDate: e.target.value })}
                className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Default Playback Speed</label>
              <select
                value={settings.defaultPlaybackSpeed}
                onChange={(e) => setSettings({ ...settings, defaultPlaybackSpeed: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
              >
                <option value={1}>1.0x (Normal)</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={1.75}>1.75x</option>
                <option value={2}>2.0x</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Daily Study Goal (Minutes)</label>
              <input
                type="number"
                value={settings.dailyStudyGoalMinutes}
                onChange={(e) => setSettings({ ...settings, dailyStudyGoalMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.autoplayNext}
                onChange={(e) => setSettings({ ...settings, autoplayNext: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>Autoplay next lecture when current finishes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={settings.focusModeByDefault}
                onChange={(e) => setSettings({ ...settings, focusModeByDefault: e.target.checked })}
                className="rounded accent-emerald-500"
              />
              <span>Launch Course Player in distraction-free Focus Mode by default</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved && <span className="text-emerald-400 font-bold">Preferences saved!</span>}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold cursor-pointer transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>

        {/* Data Backup & Restore Section */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Account Backup & Data Portability
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Export a full JSON backup of your enrolled courses, timestamped notes, planner tasks, syllabus progress, and flashcards.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 bg-[#1A1A20] hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export JSON Backup</span>
            </button>

            <label className="px-4 py-2 bg-[#1A1A20] hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span>Restore Backup</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs text-emerald-400 p-2 bg-emerald-500/10 rounded-lg">
              {importStatus}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
