import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function MobileHeader() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                {/* Left: Close & Avatar */}
                <View style={styles.leftSection}>
                    <TouchableOpacity style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                        <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>

                    <View style={styles.profileSection}>
                        <Text style={styles.username}>Morty</Text>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/100?img=11' }} // Placeholder
                                style={styles.avatar}
                            />
                        </View>
                    </View>
                </View>

                {/* Right: Actions */}
                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, styles.iconButtonActive]}>
                        <Ionicons name="happy" size={20} color={colors.primaryLight} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="settings-sharp" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
                        <Ionicons name="chevron-down" size={12} color={colors.textSecondary} style={{ marginLeft: 2 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
        zIndex: 50,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        height: 56, // Standard Telegram header height
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    closeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    closeText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    username: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    avatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: colors.surfaceLight,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    iconButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
    },
    iconButtonActive: {
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
    },
});
