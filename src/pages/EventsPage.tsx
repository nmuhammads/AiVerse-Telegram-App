import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, ChevronRight } from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'

export default function EventsPage() {
    const navigate = useNavigate()
    const { impact } = useHaptics()

    return (
        <div className="min-h-dvh bg-black safe-bottom-tabbar pt-[calc(env(safe-area-inset-top)+80px)]">
            <div className="mx-auto max-w-3xl px-4 py-4 space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { impact('light'); navigate(-1) }}
                        className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-white active:scale-95 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                        События
                    </h1>
                </div>

                {/* Events List */}
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
                </div>

            </div>
        </div>
    )
}
