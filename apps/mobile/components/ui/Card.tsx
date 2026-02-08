import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: ViewStyle;
}

export function Card({
    children,
    variant = 'default',
    padding = 'md',
    style,
}: CardProps) {
    return (
        <View
            style={[
                styles.base,
                styles[variant],
                padding !== 'none' && styles[`padding_${padding}`],
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    // Variants
    default: {
        backgroundColor: colors.surface,
    },
    elevated: {
        backgroundColor: colors.surfaceElevated,
        ...shadows.medium,
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    // Padding
    padding_sm: {
        padding: spacing.sm,
    },
    padding_md: {
        padding: spacing.lg,
    },
    padding_lg: {
        padding: spacing.xl,
    },
});
