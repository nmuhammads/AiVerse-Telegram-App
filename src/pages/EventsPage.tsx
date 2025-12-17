import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, ChevronRight, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useHaptics } from '@/hooks/useHaptics';
import { Skeleton } from '@/components/ui/skeleton';

interface Contest {
    id: number;
    title: string;
    description: string;
    image_url: string;
    status: 'active' | 'completed' | 'upcoming';
    end_date: string;
    organizer_name: string;
}

type TabType = 'contests' | 'events';
type ContestFilter = 'active' | 'completed' | 'upcoming';

export default function EventsPage() {
    const navigate = useNavigate();
    const { impact } = useHaptics();
    const { platform, tg } = useTelegram();

    // Main tab state
    const [activeTab, setActiveTab] = useState<TabType>('contests');

    // Contests state
    const [contests, setContests] = useState<Contest[]>([]);
    const [contestsLoading, setContestsLoading] = useState(true);
    const [contestFilter, setContestFilter] = useState<ContestFilter>('active');

    useEffect(() => {
        if (platform === 'ios' || platform === 'android') {
            tg.BackButton.hide();
        }
    }, [platform, tg]);

    // Custom padding for different platforms
    const getPaddingTop = () => {
        if (platform === 'ios') return 'calc(env(safe-area-inset-top) + 10px)';
        if (platform === 'android') return 'calc(env(safe-area-inset-top) + 20px)';
        return '20px';
    };

    // Fetch contests when tab or filter changes
    useEffect(() => {
        if (activeTab === 'contests') {
            fetchContests();
        }
    }, [activeTab, contestFilter]);

    const fetchContests = async () => {
        setContestsLoading(true);
        try {
            const res = await fetch(`/api/contests?status=${contestFilter}`);
            const data = await res.json();
            if (data.items) {
                setContests(data.items);
            }
        } catch (error) {
            console.error('Failed to fetch contests', error);
        } finally {
            setContestsLoading(false);
        }
    };

    const handleContestClick = (id: number) => {
        impact('light');
        navigate(`/contests/${id}`);
    };

    const handleTabChange = (tab: TabType) => {
        impact('light');
        setActiveTab(tab);
    };

    return (
        <div className="min-h-screen bg-black pb-24 px-4" style={{ paddingTop: getPaddingTop() }}>
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <h1 className="text-2xl font-bold text-white">События</h1>

                {/* Main Tab Switcher */}
                <div className="flex p-1 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-white/10">
                    <button
                        onClick={() => handleTabChange('contests')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'contests'
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Trophy size={16} />
                        Конкурсы
                    </button>
                    <button
                        onClick={() => handleTabChange('events')}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'events'
                            ? 'bg-zinc-800 text-white shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        <Clock size={16} />
                        События
                    </button>
                </div>
            </div>

            {/* Contests Tab Content */}
            {activeTab === 'contests' && (
                <>
                    {/* Contest Filter */}
                    <div className="flex p-1 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-white/5 mb-4">
                        {[
                            { id: 'active', label: 'Активные' },
                            { id: 'upcoming', label: 'Скоро' },
                            { id: 'completed', label: 'Прошедшие' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setContestFilter(tab.id as ContestFilter)}
                                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${contestFilter === tab.id
                                    ? 'bg-zinc-700/80 text-white shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contests List */}
                    {contestsLoading ? (
                        <div className="space-y-4">
                            {/* Contest Card Skeletons */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="relative bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5">
                                    {/* Image skeleton */}
                                    <div className="h-40 w-full relative">
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]"
                                            style={{ animation: 'shimmer 1.5s ease-in-out infinite' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            {/* Organizer skeleton */}
                                            <div className="h-3 w-24 bg-zinc-700/50 rounded mb-2" />
                                            {/* Title skeleton */}
                                            <div className="h-5 w-3/4 bg-zinc-700/50 rounded" />
                                        </div>
                                    </div>
                                    {/* Info skeleton */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-4 w-4 bg-zinc-700/50 rounded" />
                                            <div className="h-3 w-24 bg-zinc-700/50 rounded" />
                                        </div>
                                        <div className="h-4 w-4 bg-zinc-700/50 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : contests.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">
                            {contestFilter === 'active' ? 'Нет активных конкурсов' :
                                contestFilter === 'upcoming' ? 'Нет предстоящих конкурсов' :
                                    'Нет завершенных конкурсов'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contests.map((contest) => (
                                <div
                                    key={contest.id}
                                    onClick={() => handleContestClick(contest.id)}
                                    className="group relative bg-[#1c1c1e] rounded-2xl overflow-hidden border border-white/5 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    {/* Image */}
                                    <div className="h-40 w-full relative">
                                        <img
                                            src={contest.image_url || '/placeholder-contest.jpg'}
                                            alt={contest.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                            <div>
                                                <div className="text-xs text-indigo-400 font-medium mb-1 flex items-center gap-1">
                                                    <Trophy size={12} />
                                                    {contest.organizer_name}
                                                </div>
                                                <h3 className="text-lg font-bold text-white leading-tight">{contest.title}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                <span>
                                                    {contestFilter === 'active' ? 'До ' :
                                                        contestFilter === 'upcoming' ? 'Начало ' :
                                                            'Завершен '}
                                                    {new Date(contest.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Events Tab Content */}
            {activeTab === 'events' && (
                <div className="space-y-4">
                    {/* Wheel of Fortune Card */}
                    <div
                        onClick={() => { impact('medium'); navigate('/spin') }}
                        className="relative group cursor-pointer overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 shadow-2xl active:scale-[0.98] transition-all"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-indigo-600/20 opacity-50 group-hover:opacity-100 transition-opacity" />

                        <div className="relative p-6 flex items-center justify-between z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">Колесо Фортуны</h3>
                                    <p className="text-xs text-zinc-400 font-medium">Испытай удачу и выиграй призы!</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for more events */}
                    <div className="text-center py-8 text-zinc-500 text-sm">
                        Скоро появятся новые события!
                    </div>
                </div>
            )}
        </div>
    );
}
