/**
 * AiVerse Mobile App - Design System Theme
 * Matches Telegram Mini App visual style
 */

export const colors = {
    // Backgrounds
    background: '#000000',
    surface: '#1a1a1d',
    surfaceLight: '#2a2a2d',
    surfaceElevated: '#242428',

    // Accent
    primary: '#a855f7',
    primaryLight: '#c084fc',
    primaryDark: '#7c3aed',

    // Text
    text: '#ffffff',
    textSecondary: '#888888',
    textMuted: '#666666',
    textDisabled: '#444444',

    // Status
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',

    // Borders
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.05)',

    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Gradient colors (for animations)
    gradient: {
        red: '#ff0000',
        yellow: '#ffff00',
        green: '#00ff00',
        cyan: '#00ffff',
        blue: '#0000ff',
        magenta: '#ff00ff',
    },
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
} as const;

export const typography = {
    // Headers
    h1: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        lineHeight: 34,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        lineHeight: 30,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 26,
    },
    // Body
    body: {
        fontSize: 16,
        fontWeight: 'normal' as const,
        lineHeight: 22,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: 'normal' as const,
        lineHeight: 20,
    },
    // Labels
    label: {
        fontSize: 12,
        fontWeight: '500' as const,
        lineHeight: 16,
    },
    labelSmall: {
        fontSize: 10,
        fontWeight: '500' as const,
        lineHeight: 14,
    },
    button: {
        fontSize: 16,
        fontWeight: '700' as const,
        lineHeight: 24,
    },
} as const;

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
} as const;

// Glassmorphism styles
export const glass = {
    panel: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    panelDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
} as const;

// Animation durations
export const animation = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

export const theme = {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
    glass,
    animation,
} as const;

export type Theme = typeof theme;
export default theme;
