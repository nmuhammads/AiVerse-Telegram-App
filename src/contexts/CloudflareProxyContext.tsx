/**
 * Cloudflare Proxy Context
 * Automatically detects if user has issues accessing Cloudflare R2
 * and provides proxied URLs when needed
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface CloudflareProxyContextType {
    needsProxy: boolean
    isChecking: boolean
    getImageUrl: (originalUrl: string) => string
    retryCheck: () => void
}

const CloudflareProxyContext = createContext<CloudflareProxyContextType>({
    needsProxy: false,
    isChecking: true,
    getImageUrl: (url) => url,
    retryCheck: () => { },
})

// Storage key for caching the check result
const STORAGE_KEY = 'aiverse_cf_proxy_needed'
const STORAGE_TIMESTAMP_KEY = 'aiverse_cf_proxy_checked_at'
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

export function CloudflareProxyProvider({ children }: { children: React.ReactNode }) {
    const [needsProxy, setNeedsProxy] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    const checkCloudflareAccess = useCallback(async () => {
        setIsChecking(true)

        try {
            // Check cache first
            const cachedResult = sessionStorage.getItem(STORAGE_KEY)
            const cachedTimestamp = sessionStorage.getItem(STORAGE_TIMESTAMP_KEY)

            if (cachedResult !== null && cachedTimestamp) {
                const timestamp = parseInt(cachedTimestamp, 10)
                if (Date.now() - timestamp < CACHE_DURATION_MS) {
                    const needsProxyValue = cachedResult === 'true'
                    console.log('[CloudflareProxy] Using cached result:', needsProxyValue ? 'proxy needed' : 'direct access OK')
                    setNeedsProxy(needsProxyValue)
                    setIsChecking(false)
                    return
                }
            }

            // Get test image URL from first available generation
            const testUrls = await getTestImageUrls()

            if (testUrls.length === 0) {
                console.log('[CloudflareProxy] No test URLs available, assuming direct access')
                setNeedsProxy(false)
                setIsChecking(false)
                return
            }

            // Try to load test image directly
            const canAccessDirectly = await testImageLoad(testUrls[0], 5000)

            if (canAccessDirectly) {
                console.log('[CloudflareProxy] Direct access to Cloudflare OK')
                setNeedsProxy(false)
                sessionStorage.setItem(STORAGE_KEY, 'false')
            } else {
                console.log('[CloudflareProxy] Direct access failed, enabling proxy')
                setNeedsProxy(true)
                sessionStorage.setItem(STORAGE_KEY, 'true')
            }

            sessionStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())

        } catch (error) {
            console.error('[CloudflareProxy] Check error:', error)
            // On error, assume direct access is OK
            setNeedsProxy(false)
        } finally {
            setIsChecking(false)
        }
    }, [])

    useEffect(() => {
        checkCloudflareAccess()
    }, [checkCloudflareAccess])

    // Get proxied URL if needed
    const getImageUrl = useCallback((originalUrl: string): string => {
        if (!originalUrl) return originalUrl

        // Already proxied URL - return as is
        if (originalUrl.startsWith('/api/proxy')) {
            return originalUrl
        }

        // Local URLs don't need proxying
        if (originalUrl.startsWith('/') || originalUrl.startsWith('data:')) {
            return originalUrl
        }

        // If proxy not needed, return original
        if (!needsProxy) {
            return originalUrl
        }

        // Return proxied URL
        return `/api/proxy/image?url=${encodeURIComponent(originalUrl)}`
    }, [needsProxy])

    return (
        <CloudflareProxyContext.Provider value={{
            needsProxy,
            isChecking,
            getImageUrl,
            retryCheck: checkCloudflareAccess
        }}>
            {children}
        </CloudflareProxyContext.Provider>
    )
}

export function useCloudflareProxy() {
    return useContext(CloudflareProxyContext)
}

/**
 * Get test image URLs from feed
 */
async function getTestImageUrls(): Promise<string[]> {
    try {
        const res = await fetch('/api/feed?limit=1')
        if (!res.ok) return []

        const data = await res.json()
        const items = data.data || data.feed || []

        if (items.length === 0) return []

        const urls: string[] = []
        const item = items[0]

        if (item.compressed_url) urls.push(item.compressed_url)
        if (item.image_url) urls.push(item.image_url)

        return urls.filter(Boolean)
    } catch {
        return []
    }
}

/**
 * Test if image can be loaded
 */
function testImageLoad(url: string, timeout: number): Promise<boolean> {
    return new Promise((resolve) => {
        const img = new Image()
        const timer = setTimeout(() => {
            img.onload = null
            img.onerror = null
            resolve(false)
        }, timeout)

        img.onload = () => {
            clearTimeout(timer)
            resolve(true)
        }

        img.onerror = () => {
            clearTimeout(timer)
            resolve(false)
        }

        img.src = url
    })
}
