import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

const MODEL_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'nanobanana', label: 'NanoBanana' },
    { value: 'seedream', label: 'SeeDream' },
    { value: 'gpt', label: 'GPT Image' },
    { value: 'flux', label: 'Flux' },
];

interface FeedFiltersProps {
    viewMode: 'standard' | 'compact';
    modelFilter: string;
    onViewModeChange: (mode: 'standard' | 'compact') => void;
    onModelFilterChange: (model: string) => void;
}

export function FeedFilters({
    viewMode,
    modelFilter,
    onViewModeChange,
    onModelFilterChange,
}: FeedFiltersProps) {
    return (
        <View style={styles.container}>
            {/* View Mode Toggle */}
            <View style={styles.viewModeContainer}>
                <TouchableOpacity
                    style={[styles.viewModeButton, viewMode === 'standard' && styles.viewModeActive]}
                    onPress={() => onViewModeChange('standard')}
                >
                    <Ionicons
                        name="grid-outline"
                        size={18}
                        color={viewMode === 'standard' ? colors.text : colors.textSecondary}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.viewModeButton, viewMode === 'compact' && styles.viewModeActive]}
                    onPress={() => onViewModeChange('compact')}
                >
                    <Ionicons
                        name="apps-outline"
                        size={18}
                        color={viewMode === 'compact' ? colors.text : colors.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Model Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersScroll}
            >
                {MODEL_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.filterChip,
                            modelFilter === option.value && styles.filterChipActive,
                        ]}
                        onPress={() => onModelFilterChange(option.value)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                modelFilter === option.value && styles.filterTextActive,
                            ]}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        gap: spacing.md,
    },
    viewModeContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: 4,
    },
    viewModeButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.sm,
    },
    viewModeActive: {
        backgroundColor: colors.surfaceLight,
    },
    filtersScroll: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    filterChip: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.full,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
    },
    filterText: {
        color: colors.textSecondary,
        fontSize: typography.label.fontSize,
        fontWeight: '500',
    },
    filterTextActive: {
        color: colors.text,
    },
});
