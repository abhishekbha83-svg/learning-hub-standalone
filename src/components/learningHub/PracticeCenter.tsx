import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Download,
  Plus,
  RotateCw,
  Check,
  X,
  Layers,
  Clock,
  BookOpen,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Flashcard } from '../../types/learningHub';
import { learningHubService } from '../../services/learningHubService';

type SubTab = 'flashcards' | 'timed-tests';

export const PracticeCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('flashcards');

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    learningHubService.getFlashcards()
  );
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [newFront, setNewFront] = useState<string>('');
  const [newBack, setNewBack] = useState<string>('');
  const [newSubject, setNewSubject] = useState<string>('Physics');

  // AI Flashcards Generation State
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiTopic, setAiTopic] = useState<string>('Rotational Motion & Moment of Inertia');
  const [aiSubject, setAiSubject] = useState<string>('Physics');
  const [aiCount, setAiCount] = useState<number>(5);
  const [isGeneratingAiCards, setIsGeneratingAiCards] = useState<boolean>(false);
  const [aiCardsError, setAiCardsError] = useState<string | null>(null);
  const [generatedPreviewCards, setGeneratedPreviewCards] = useState<Array<{ frontQuestion: string; backAnswer: string; subject: string }>>([]);
  const [selectedCardIndices, setSelectedCardIndices] = useState<Set<number>>(new Set());

  const activeCard = flashcards[currentCardIndex] || flashcards[0];

  const handleReview = (remembered: boolean) => {
    if (!activeCard) return;
    learningHubService.reviewFlashcard(activeCard.id, remembered);
    setFlashcards(learningHubService.getFlashcards());
    setIsFlipped(false);
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleGenerateAiCards = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim() || isGeneratingAiCards) return;

    setIsGeneratingAiCards(true);
    setAiCardsError(null);
    setGeneratedPreviewCards([]);
    setSelectedCardIndices(new Set());

    try {
      const examTag = learningHubService.getUserSettings().targetExamName || 'JEE Main';
      const res = await fetch('/api/learning-hub/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          count: aiCount,
          subject: aiSubject,
          examTag
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.flashcards)) {
        throw new Error(data.error || 'Failed to generate flashcards from AI provider.');
      }
      setGeneratedPreviewCards(data.flashcards);
      setSelectedCardIndices(new Set(data.flashcards.map((_: any, idx: number) => idx)));
    } catch (err: any) {
      setAiCardsError(err.message || 'AI Flashcard generation failed. Please retry.');
    } finally {
      setIsGeneratingAiCards(false);
    }
  };

  const handleSaveSelectedAiCards = () => {
    if (generatedPreviewCards.length === 0) return;
    const cardsToAdd = generatedPreviewCards.filter((_, idx) => selectedCardIndices.has(idx));
    if (cardsToAdd.length === 0) {
      setAiCardsError('Please select at least one card to add.');
      return;
    }

    cardsToAdd.forEach((c) => {
      learningHubService.saveFlashcard({
        frontQuestion: c.frontQuestion,
        backAnswer: c.backAnswer,
        subject: c.subject || aiSubject,
        boxLevel: 1,
        status: 'new'
      });
    });

    setFlashcards(learningHubService.getFlashcards());
    setShowAiModal(false);
    setGeneratedPreviewCards([]);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    learningHubService.saveFlashcard({
      frontQuestion: newFront.trim(),
      backAnswer: newBack.trim(),
      subject: newSubject,
      boxLevel: 1,
      status: 'new'
    });

    setFlashcards(learningHubService.getFlashcards());
    setNewFront('');
    setNewBack('');
    setShowAddCardModal(false);
  };

  const handleExportAnkiTSV = () => {
    if (flashcards.length === 0) return;
    let tsv = '';
    flashcards.forEach((c) => {
      tsv += `${c.frontQuestion.replace(/\t|\n/g, ' ')}\t${c.backAnswer.replace(/\t|\n/g, ' ')}\n`;
    });
    const blob = new Blob([tsv], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ABHYVEXA_Flashcards.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Active Recall & Spaced Repetition Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Practice & Flashcards Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Leitner spaced repetition cards, flip-to-test recall, and Anki-compatible TSV export.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="p-1 bg-[#141418] rounded-2xl border border-white/10 flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'flashcards'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Spaced Flashcards ({flashcards.length})</span>
          </button>
        </div>
      </div>

      {/* Flashcards Sub-Tab */}
      {activeSubTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAiModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-white text-xs font-bold border border-purple-500/30 transition-all flex items-center gap-1 cursor-pointer"
                title="Generate active recall cards with OpenRouter AI"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generate</span>
              </button>

              <button
                onClick={() => setShowAddCardModal(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500 text-teal-300 hover:text-white text-xs font-bold border border-teal-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Card</span>
              </button>

              <button
                onClick={handleExportAnkiTSV}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
                title="Export Anki-compatible TSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Anki TSV</span>
              </button>
            </div>
          </div>

          {activeCard ? (
            <div className="space-y-4">
              {/* Interactive Flip Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[260px] p-8 rounded-3xl bg-gradient-to-br from-[#1A1A20] to-[#141418] border border-white/15 hover:border-teal-500/40 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between w-full text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <span className="px-2 py-0.5 rounded bg-white/5">{activeCard.subject}</span>
                  <span>Box {activeCard.boxLevel} · Leitner Interval</span>
                </div>

                <div className="my-auto py-6 space-y-3 max-w-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                    {isFlipped ? 'SOLUTION / ANSWER' : 'QUESTION (Click to flip)'}
                  </span>
                  <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                    {isFlipped ? activeCard.backAnswer : activeCard.frontQuestion}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <RotateCw className="w-3 h-3" />
                  <span>Click card to reveal {isFlipped ? 'question' : 'answer'}</span>
                </div>
              </div>

              {/* Review Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReview(false)}
                  className="py-3 rounded-2xl bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Need Revision (Reset Box 1)</span>
                </button>

                <button
                  onClick={() => handleReview(true)}
                  className="py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Mastered (Promote to Box {Math.min(activeCard.boxLevel + 1, 5)})</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 p-8 rounded-2xl bg-[#141418] border border-dashed border-white/10">
              <p className="text-xs">No flashcards found. Create your first card!</p>
            </div>
          )}
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddCard}
            className="bg-[#141418] border border-white/15 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-base text-white">Create Flashcard</h3>
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Physics / Chemistry / Biology / Coding"
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Front (Question or Formula Prompt)</label>
                <textarea
                  rows={3}
                  required
                  value={newFront}
                  onChange={(e) => setNewFront(e.target.value)}
                  placeholder="e.g. State Bernoulli's equation for steady fluid flow..."
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Back (Answer or Derivation)</label>
                <textarea
                  rows={3}
                  required
                  value={newBack}
                  onChange={(e) => setNewBack(e.target.value)}
                  placeholder="e.g. P + 0.5*rho*v^2 + rho*g*h = constant"
                  className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddCardModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-xs font-bold transition-all"
              >
                Save Flashcard
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Generate Cards Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-white/15 max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-base text-white">AI Active Recall Cards</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAiModal(false);
                  setGeneratedPreviewCards([]);
                  setAiCardsError(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {aiCardsError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiCardsError}</span>
              </div>
            )}

            {generatedPreviewCards.length === 0 ? (
              <form onSubmit={handleGenerateAiCards} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Subject</label>
                  <select
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Coding">Computer Science / Coding</option>
                    <option value="General Studies">General Studies</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Topic / Chapter Focus</label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Electromagnetic Induction, Chemical Equilibrium, Binary Trees"
                    className="w-full px-3 py-2 bg-[#1A1A20] border border-white/10 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Number of Flashcards</label>
                  <div className="flex gap-2">
                    {[3, 5, 8].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setAiCount(cnt)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
                          aiCount === cnt
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cnt} Cards
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingAiCards}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-600/20"
                  >
                    {isGeneratingAiCards ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Flashcards</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Review {generatedPreviewCards.length} AI-Generated Cards:</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCardIndices.size === generatedPreviewCards.length) {
                        setSelectedCardIndices(new Set());
                      } else {
                        setSelectedCardIndices(new Set(generatedPreviewCards.map((_, i) => i)));
                      }
                    }}
                    className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    {selectedCardIndices.size === generatedPreviewCards.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {generatedPreviewCards.map((card, idx) => {
                    const isSelected = selectedCardIndices.has(idx);
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          const next = new Set(selectedCardIndices);
                          if (next.has(idx)) next.delete(idx);
                          else next.add(idx);
                          setSelectedCardIndices(next);
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                          isSelected
                            ? 'bg-purple-500/10 border-purple-500/40 text-white'
                            : 'bg-white/5 border-white/10 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-[11px]">
                          <span className="text-purple-300">Q: {card.frontQuestion}</span>
                          <span className="text-xs">{isSelected ? '✓' : '○'}</span>
                        </div>
                        <div className="text-slate-300 text-[11px] pl-3 border-l-2 border-purple-500/30">
                          A: {card.backAnswer}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-between gap-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setGeneratedPreviewCards([])}
                    className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    ← Back / Retry
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSelectedAiCards}
                    className="px-5 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                  >
                    Add {selectedCardIndices.size} Selected to Deck
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
