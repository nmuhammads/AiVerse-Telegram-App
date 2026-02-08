import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ProfileStatsProps {
    generationsCount: number;
    followersCount: number;
    points: number;
}

export function ProfileStats({ generationsCount, followersCount, points }: ProfileStatsProps) {
    const stats = [
        { label: 'Generations', value: generationsCount },
        { label: 'Followers', value: followersCount },
        { label: 'Points', value: points },
    ];

    return (
        <View style={styles.container}>
            {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                    <Text style={styles.value}>{stat.value}</Text>
                    <Text style={styles.label}>{stat.label}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    statItem: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    value: {
        color: colors.text,
        fontSize: typography.h3.fontSize,
        fontWeight: '700',
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.label.fontSize,
        marginTop: 4,
    },
});
