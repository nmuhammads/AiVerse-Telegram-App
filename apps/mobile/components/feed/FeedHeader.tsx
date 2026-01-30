import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface FeedHeaderProps {
    sort: 'new' | 'popular';
    feedFilter: 'all' | 'following';
    onSortChange: (sort: 'new' | 'popular') => void;
    onFeedFilterChange: (filter: 'all' | 'following') => void;
    onSearchOpen: () => void;
}

export function FeedHeader({
    sort,
    feedFilter,
    onSortChange,
    onFeedFilterChange,
    onSearchOpen,
}: FeedHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {/* Sort Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, sort === 'new' && styles.tabActive]}
                        onPress={() => onSortChange('new')}
                    >
                        <Text style={[styles.tabText, sort === 'new' && styles.tabTextActive]}>
                            ✨ New
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, sort === 'popular' && styles.tabActive]}
                        onPress={() => onSortChange('popular')}
                    >
                        <Text style={[styles.tabText, sort === 'popular' && styles.tabTextActive]}>
                            🔥 Popular
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Search Button */}
                <TouchableOpacity style={styles.searchButton} onPress={onSearchOpen}>
                    <Ionicons name="search" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Feed Filter */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterChip, feedFilter === 'all' && styles.filterChipActive]}
                    onPress={() => onFeedFilterChange('all')}
                >
                    <Text style={[styles.filterText, feedFilter === 'all' && styles.filterTextActive]}>
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, feedFilter === 'following' && styles.filterChipActive]}
                    onPress={() => onFeedFilterChange('following')}
                >
                    <Text style={[styles.filterText, feedFilter === 'following' && styles.filterTextActive]}>
                        Following
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: 4,
    },
    tab: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall.fontSize,
        fontWeight: '600',
    },
    tabTextActive: {
        color: colors.text,
    },
    searchButton: {
        width: 44,
        height: 44,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterRow: {
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
