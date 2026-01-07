import React, { useState, useEffect } from 'react'

declare global {
    interface Window {
        __DEBUG_LOGS__: string[]
        logEvent: (msg: string) => void
    }
}

export const logEvent = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].slice(0, -1)
    const logMsg = `[${time}] ${msg}`
    console.log(logMsg)
    if (!window.__DEBUG_LOGS__) window.__DEBUG_LOGS__ = []
    window.__DEBUG_LOGS__.push(logMsg)
    // Trigger update if listener exists (simple implementation)
    const event = new CustomEvent('debug-log', { detail: logMsg })
    window.dispatchEvent(event)
}

// Initialize global logger if not already done
if (!window.logEvent) {
    window.logEvent = logEvent
    if (!window.__DEBUG_LOGS__) window.__DEBUG_LOGS__ = []
}

export function DebugLogger() {
    const [logs, setLogs] = useState<string[]>(window.__DEBUG_LOGS__ || [])
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Update initial logs
        setLogs([...(window.__DEBUG_LOGS__ || [])])

        const handleLog = () => {
            setLogs([...(window.__DEBUG_LOGS__ || [])])
        }
        window.addEventListener('debug-log', handleLog)
        return () => window.removeEventListener('debug-log', handleLog)
    }, [])

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-20 right-4 z-[9999] bg-red-500/50 text-white text-xs px-2 py-1 rounded"
            >
                Debug
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-[99999] pointer-events-none flex flex-col justify-end pb-24 px-2">
            <div className="bg-black/80 text-green-400 font-mono text-[10px] p-2 rounded border border-white/10 max-h-[50vh] overflow-y-auto pointer-events-auto">
                <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-1">
                    <span className="font-bold text-white">Debug Logs</span>
                    <button onClick={() => setIsVisible(false)} className="text-white/50 hover:text-white">Close</button>
                </div>
                {logs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap">{log}</div>
                ))}
            </div>
        </div>
    )
}
