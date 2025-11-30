import React, { useState, useMemo } from 'react';
import { ArrowLeft, Info, ChevronRight, Share2, Download, ChevronDown, Volume2, BookText, PencilRuler, Wind, Zap, Headset, ChevronLeft, Play, Mic, X, CheckCircle2, BarChart3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConversationAnalysis, SkillDetails, PronunciationMistake, GrammarCorrection, VocabularyUpgrade, FluencyMetric } from '@/lib/types/roleplay';

interface ResultsBreakdownPageProps {
    userName: string;
    analysis: ConversationAnalysis;
    onNavigate: (destination: 'explore' | 'retake') => void;
    onBack: () => void;
    continueButtonText?: string;
}

type SkillKey = 'listening' | 'vocabulary' | 'grammar' | 'fluency' | 'clarity' | 'pronunciation';

interface SkillData {
    key: SkillKey;
    label: string;
    shortLabel: string;
    score: number;
    color: string;
    icon: React.ElementType;
    details: SkillDetails;
}

// --- SUB-COMPONENTS ---

const AudioComparisonCard: React.FC<{ word: string, phoneticUser: string, phoneticTarget: string, score: number }> = ({ word, phoneticUser, phoneticTarget, score }) => {
    const [isPlaying, setIsPlaying] = useState<'user' | 'target' | null>(null);

    const handlePlay = (type: 'user' | 'target') => {
        setIsPlaying(type);
        setTimeout(() => setIsPlaying(null), 1500); // Simulate playback
    };

    return (
        <div className="bg-bg-elevated rounded-xl p-4 mb-3 border border-gray-100">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="font-display text-lg text-navy font-bold">{word}</h4>
                    <div className="flex items-center gap-2 mt-1">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${score < 50 ? 'bg-error-light text-error-dark' : 'bg-warning-light text-warning-dark'}`}>
                            Score: {score}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* User Audio */}
                <button
                    onClick={() => handlePlay('user')}
                    className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${isPlaying === 'user' ? 'border-navy bg-navy/5' : 'border-gray-200 bg-white hover:border-navy/30'}`}
                >
                    <span className="text-xs text-text-secondary mb-1">You said</span>
                    <div className="flex items-center gap-2">
                        {isPlaying === 'user' ? <Volume2 className="w-4 h-4 text-navy animate-pulse" /> : <Play className="w-4 h-4 text-navy" />}
                        <span className="font-mono text-sm text-navy">{phoneticUser}</span>
                    </div>
                </button>

                {/* Target Audio */}
                <button
                    onClick={() => handlePlay('target')}
                    className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${isPlaying === 'target' ? 'border-teal bg-teal/5' : 'border-gray-200 bg-white hover:border-teal/30'}`}
                >
                    <span className="text-xs text-text-secondary mb-1">Correct</span>
                    <div className="flex items-center gap-2">
                        {isPlaying === 'target' ? <Volume2 className="w-4 h-4 text-teal animate-pulse" /> : <Play className="w-4 h-4 text-teal" />}
                        <span className="font-mono text-sm text-teal">{phoneticTarget}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

const GrammarDiffCard: React.FC<{ original: string, corrected: string, explanation: string }> = ({ original, corrected, explanation }) => (
    <div className="bg-bg-elevated rounded-xl p-4 mb-3 border border-gray-100">
        <div className="space-y-3">
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-error-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 text-error" />
                </div>
                <div>
                    <p className="text-xs text-text-secondary font-semibold uppercase">You said</p>
                    <p className="text-text-primary text-body-sm line-through decoration-error/50 decoration-2">{original}</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-success-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                </div>
                <div>
                     <p className="text-xs text-text-secondary font-semibold uppercase">Better</p>
                    <p className="text-text-primary text-body-sm" dangerouslySetInnerHTML={{ __html: corrected }} />
                </div>
            </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-navy font-medium flex items-center gap-1">
                <Info className="w-3 h-3" />
                {explanation}
            </p>
        </div>
    </div>
);

const VocabularyUpgradeCard: React.FC<{ original: string, alternatives: string[], context: string }> = ({ original, alternatives, context }) => (
    <div className="bg-bg-elevated rounded-xl p-4 mb-3 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
            <Sparkles className="w-16 h-16 text-gold" />
        </div>
        <p className="text-xs text-text-secondary mb-2 italic">"{context}"</p>
        <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-lg bg-white border border-gray-200 text-text-secondary line-through decoration-2 decoration-gray-400">{original}</span>
            <ArrowLeft className="w-4 h-4 text-text-tertiary rotate-180" />
            <span className="font-bold text-navy">Level Up</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {alternatives.map(alt => (
                <div key={alt} className="bg-white border border-gold/30 rounded-lg p-2 text-center shadow-sm">
                    <p className="text-sm font-semibold text-navy">{alt}</p>
                </div>
            ))}
        </div>
    </div>
);

const FluencyMetricCard: React.FC<{ label: string, value: string, status: 'good' | 'warning' | 'bad' }> = ({ label, value, status }) => {
    const colors = {
        good: 'bg-success-light text-success-dark border-success/20',
        warning: 'bg-warning-light text-warning-dark border-warning/20',
        bad: 'bg-error-light text-error-dark border-error/20'
    };

    return (
        <div className={`rounded-xl p-4 border ${colors[status]} flex flex-col items-center justify-center text-center`}>
            <p className="text-2xl font-bold mb-1">{value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
        </div>
    );
};

// --- RADAR CHART & PROGRESS (Existing but cleaner) ---
const RadarChart: React.FC<{ data: SkillData[] }> = ({ data }) => {
    const size = 300;
    const center = size / 2;
    const radius = 100;

    const getPoint = (index: number, value: number) => {
        const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
        const x = center + radius * (value / 100) * Math.cos(angle);
        const y = center + radius * (value / 100) * Math.sin(angle);
        return { x, y };
    };

    const pointsString = useMemo(() => data.map((d, i) => {
        const { x, y } = getPoint(i, d.score);
        return `${x},${y}`;
    }).join(' '), [data]);

    return (
        <div className="relative w-full flex justify-center py-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {[100, 75, 50, 25].map((p) => (
                    <polygon key={p} points={data.map((_, i) => {
                        const { x, y } = getPoint(i, p);
                        return `${x},${y}`;
                    }).join(' ')} fill={p === 100 ? "#F8F9FA" : "none"} stroke="#E5E7EB" strokeWidth="1" />
                ))}
                <polygon points={pointsString} fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="2" />
                {data.map((d, i) => {
                    const { x, y } = getPoint(i, 100);
                    const textPos = {
                        x: center + (radius + 25) * Math.cos((Math.PI * 2 * i) / data.length - Math.PI / 2),
                        y: center + (radius + 25) * Math.sin((Math.PI * 2 * i) / data.length - Math.PI / 2)
                    };
                    return (
                        <g key={i}>
                            <text x={textPos.x} y={textPos.y} textAnchor="middle" dy="0.3em" className="text-[10px] font-bold fill-navy uppercase">{d.shortLabel}</text>
                            <text x={textPos.x} y={textPos.y + 12} textAnchor="middle" className="text-[10px] fill-text-secondary">{d.score}%</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const ResultsBreakdownPage: React.FC<ResultsBreakdownPageProps> = ({ userName, analysis, onNavigate, onBack, continueButtonText = "Continue to Explore" }) => {
    const [view, setView] = useState<'summary' | 'list' | 'detail'>('summary');
    const [selectedSkillKey, setSelectedSkillKey] = useState<SkillKey | null>(null);

    // Transform analysis data into SkillData format
    const skillsData: SkillData[] = useMemo(() => [
        {
            key: 'pronunciation',
            label: 'Pronunciation',
            shortLabel: 'Pron',
            score: analysis.skills.pronunciation.score,
            color: '#FF6B6B',
            icon: Volume2,
            details: analysis.skills.pronunciation
        },
        {
            key: 'vocabulary',
            label: 'Vocabulary',
            shortLabel: 'Voca',
            score: analysis.skills.vocabulary.score,
            color: '#06B6D4',
            icon: BookText,
            details: analysis.skills.vocabulary
        },
        {
            key: 'grammar',
            label: 'Grammar',
            shortLabel: 'Gram',
            score: analysis.skills.grammar.score,
            color: '#F59E0B',
            icon: PencilRuler,
            details: analysis.skills.grammar
        },
        {
            key: 'fluency',
            label: 'Fluency',
            shortLabel: 'Flue',
            score: analysis.skills.fluency.score,
            color: '#10B981',
            icon: Wind,
            details: analysis.skills.fluency
        },
        {
            key: 'clarity',
            label: 'Clarity',
            shortLabel: 'Clar',
            score: analysis.skills.clarity.score,
            color: '#10B981',
            icon: Zap,
            details: analysis.skills.clarity
        },
        {
            key: 'listening',
            label: 'Listening',
            shortLabel: 'List',
            score: analysis.skills.listening.score,
            color: '#06B6D4',
            icon: Headset,
            details: analysis.skills.listening
        }
    ], [analysis]);

    const selectedSkill = useMemo(() =>
        skillsData.find(s => s.key === selectedSkillKey),
    [selectedSkillKey, skillsData]);

    const handleBackNav = () => {
        if (view === 'detail') {
            setView('list');
            setSelectedSkillKey(null);
        } else if (view === 'list') {
            setView('summary');
        } else {
            onBack();
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur-md z-20 p-4 flex items-center justify-between shadow-sm">
                <button onClick={handleBackNav} className="flex items-center gap-1 text-navy hover:bg-gray-100 p-2 -ml-2 rounded-lg transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                    <span className="text-sm font-semibold">
                        {view === 'summary' ? 'Back' : view === 'list' ? 'Summary' : 'Breakdown'}
                    </span>
                </button>
                <h1 className="font-display text-h3 text-navy absolute left-1/2 -translate-x-1/2">
                    {view === 'detail' && selectedSkill ? selectedSkill.label : 'Result'}
                </h1>
                <div className="w-10" /> {/* Spacer for alignment */}
            </header>

            <main className="pt-20 pb-8 px-4 max-w-lg mx-auto">

                {/* --- SUMMARY VIEW --- */}
                {view === 'summary' && (
                    <div className="bg-white rounded-3xl shadow-lg p-6 animate-fade-in-up">
                        <div className="text-center mb-2">
                            <span className="inline-block px-4 py-1 rounded-full bg-teal/10 text-teal font-bold text-sm mb-2">{analysis.cefrLevel}</span>
                            <h2 className="font-display text-3xl text-navy font-bold">{analysis.overallScore}<span className="text-lg text-text-tertiary font-normal">/100</span></h2>
                        </div>

                        <RadarChart data={skillsData} />

                        <div className="bg-navy/5 rounded-xl p-4 mb-6">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border-2 border-navy/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="w-5 h-5 text-gold" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-navy mb-1 uppercase">AI Coach's Insight</p>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {analysis.aiCoachInsight}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => setView('list')}
                                className="w-full bg-navy text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-navy/20 hover:bg-navy-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                View Detailed Breakdown <ChevronRight className="w-5 h-5" />
                            </button>

                            <Button
                                onClick={() => onNavigate('retake')}
                                variant="outline"
                                className="w-full border-2 border-navy text-navy hover:bg-navy/5 rounded-xl h-12 font-semibold"
                            >
                                Retake Scenario
                            </Button>

                            <Button
                                onClick={() => onNavigate('explore')}
                                className="w-full bg-coral text-white hover:bg-coral-hover rounded-xl h-12 font-semibold shadow-lg"
                            >
                                {continueButtonText}
                            </Button>
                        </div>
                    </div>
                )}

                {/* --- LIST VIEW --- */}
                {view === 'list' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <h2 className="font-display text-xl text-navy mb-4 px-2">Performance by Skill</h2>
                        {skillsData.map((skill) => (
                            <button
                                key={skill.key}
                                onClick={() => { setSelectedSkillKey(skill.key); setView('detail'); }}
                                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-navy/20 transition-all group text-left"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${skill.color}15` }}>
                                    <skill.icon className="w-6 h-6" style={{ color: skill.color }} />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-text-primary group-hover:text-navy transition-colors">{skill.label}</h3>
                                        <span className="font-bold text-navy">{skill.score}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${skill.score}%`, backgroundColor: skill.color }} />
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-navy" />
                            </button>
                        ))}
                    </div>
                )}

                {/* --- DETAIL DEEP DIVE VIEW --- */}
                {view === 'detail' && selectedSkill && (
                    <div className="animate-fade-in-up space-y-6">

                        {/* Score Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                    <path className="text-navy transition-all duration-1000 ease-out" strokeDasharray={`${selectedSkill.score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-navy">
                                    {selectedSkill.score}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-tertiary uppercase tracking-wider mb-1">Coach's Feedback</p>
                                <p className="text-text-primary text-sm leading-relaxed italic">"{selectedSkill.details.coachTip}"</p>
                            </div>
                        </div>

                        {/* Actionable Content Section */}
                        <div>
                            <h3 className="font-display text-lg text-navy mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-gold" />
                                Areas for Improvement
                            </h3>

                            {/* PRONUNCIATION SPECIFIC */}
                            {selectedSkill.key === 'pronunciation' && selectedSkill.details.pronunciationData && selectedSkill.details.pronunciationData.length > 0 && (
                                <div className="space-y-2">
                                    {selectedSkill.details.pronunciationData.map((item, idx) => (
                                        <AudioComparisonCard key={idx} {...item} />
                                    ))}
                                </div>
                            )}

                            {/* GRAMMAR SPECIFIC */}
                            {selectedSkill.key === 'grammar' && selectedSkill.details.grammarData && selectedSkill.details.grammarData.length > 0 && (
                                <div className="space-y-2">
                                    {selectedSkill.details.grammarData.map((item, idx) => (
                                        <GrammarDiffCard key={idx} {...item} />
                                    ))}
                                </div>
                            )}

                            {/* VOCABULARY SPECIFIC */}
                            {selectedSkill.key === 'vocabulary' && selectedSkill.details.vocabularyData && selectedSkill.details.vocabularyData.length > 0 && (
                                <div className="space-y-2">
                                    {selectedSkill.details.vocabularyData.map((item, idx) => (
                                        <VocabularyUpgradeCard key={idx} {...item} />
                                    ))}
                                </div>
                            )}

                            {/* FLUENCY SPECIFIC */}
                            {selectedSkill.key === 'fluency' && selectedSkill.details.fluencyData && selectedSkill.details.fluencyData.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedSkill.details.fluencyData.map((item, idx) => (
                                        <FluencyMetricCard key={idx} {...item} />
                                    ))}
                                </div>
                            )}

                            {/* GENERIC FALLBACK FOR OTHER SKILLS OR EMPTY DATA */}
                            {(!selectedSkill.details.pronunciationData || selectedSkill.details.pronunciationData.length === 0) &&
                             (!selectedSkill.details.grammarData || selectedSkill.details.grammarData.length === 0) &&
                             (!selectedSkill.details.vocabularyData || selectedSkill.details.vocabularyData.length === 0) &&
                             (!selectedSkill.details.fluencyData || selectedSkill.details.fluencyData.length === 0) && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="mb-4">
                                        <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-success" /> What you did well
                                        </h4>
                                        <p className="text-sm text-text-secondary pl-7">{selectedSkill.details.strength}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-warning" /> What to practice
                                        </h4>
                                        <p className="text-sm text-text-secondary pl-7">{selectedSkill.details.improvement}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="w-full bg-coral text-white py-4 rounded-xl font-semibold text-base shadow-lg shadow-coral/20 hover:bg-coral-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            onClick={() => onNavigate('retake')}
                        >
                            Practice {selectedSkill.label} Again
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ResultsBreakdownPage;
