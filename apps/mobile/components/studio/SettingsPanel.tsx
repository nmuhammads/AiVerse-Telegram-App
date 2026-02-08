import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface SettingsPanelProps {
    aspectRatio: string;
    onSelectAspectRatio: (ratio: string) => void;
    imageCount: number;
    onSelectImageCount: (count: number) => void;
}

const ASPECT_RATIOS = [
    { id: '1:1', label: '1:1', icon: 'square' },
    { id: '16:9', label: '16:9', icon: 'landscape' },
    { id: '9:16', label: '9:16', icon: 'portrait' },
    { id: '4:3', label: '4:3', icon: 'landscape' },
    { id: '3:4', label: '3:4', icon: 'portrait' },
];

const IMAGE_COUNTS = [1, 2, 4];

export function SettingsPanel({
    aspectRatio,
    onSelectAspectRatio,
    imageCount,
    onSelectImageCount,
}: SettingsPanelProps) {
    return (
        <View style={styles.container}>
            {/* Aspect Ratio */}
            <View style={styles.section}>
                <Text style={styles.label}>Aspect Ratio</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                    {ASPECT_RATIOS.map((ratio) => (
                        <TouchableOpacity
                            key={ratio.id}
                            style={[
                                styles.ratioButton,
                                aspectRatio === ratio.id && styles.ratioButtonActive,
                            ]}
                            onPress={() => onSelectAspectRatio(ratio.id)}
                        >
                            <Text
                                style={[
                                    styles.ratioText,
                                    aspectRatio === ratio.id && styles.ratioTextActive,
                                ]}
                            >
                                {ratio.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Image Count */}
            <View style={styles.section}>
                <Text style={styles.label}>Number of Images</Text>
                <View style={styles.row}>
                    {IMAGE_COUNTS.map((count) => (
                        <TouchableOpacity
                            key={count}
                            style={[
                                styles.countButton,
                                imageCount === count && styles.countButtonActive,
                            ]}
                            onPress={() => onSelectImageCount(count)}
                        >
                            <Text
                                style={[
                                    styles.countText,
                                    imageCount === count && styles.countTextActive,
                                ]}
                            >
                                {count}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.lg,
    },
    section: {
        gap: spacing.sm,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.label.fontSize,
        fontWeight: '600',
        marginLeft: spacing.sm,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    ratioButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    ratioButtonActive: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
    },
    ratioText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall.fontSize,
    },
    ratioTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    countButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    countButtonActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    countText: {
        color: colors.textSecondary,
        fontSize: typography.body.fontSize,
    },
    countTextActive: {
        color: colors.text,
        fontWeight: '600',
    },
});
