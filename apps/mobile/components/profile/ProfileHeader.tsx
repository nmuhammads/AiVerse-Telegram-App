import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface User {
    id: number;
    username: string;
    first_name?: string;
    avatar_url?: string;
    is_premium?: boolean;
}

interface ProfileHeaderProps {
    user: User;
    onEditProfile?: () => void;
    onSettings?: () => void;
}

export function ProfileHeader({ user, onEditProfile, onSettings }: ProfileHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.avatarContainer}>
                    {user.avatar_url ? (
                        <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarEmoji}>👤</Text>
                        </View>
                    )}
                    {user.is_premium && (
                        <View style={styles.premiumBadge}>
                            <Ionicons name="star" size={12} color="#fff" />
                        </View>
                    )}
                </View>

                <View style={styles.info}>
                    <Text style={styles.name}>{user.first_name || user.username}</Text>
                    <Text style={styles.username}>@{user.username}</Text>
                </View>

                <View style={styles.actions}>
                    {onSettings && (
                        <TouchableOpacity style={styles.actionButton} onPress={onSettings}>
                            <Ionicons name="settings-outline" size={20} color={colors.text} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surface,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    avatarEmoji: {
        fontSize: 32,
    },
    premiumBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#a855f7',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.background,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    name: {
        color: colors.text,
        fontSize: typography.h3.fontSize,
        fontWeight: '700',
    },
    username: {
        color: colors.textSecondary,
        fontSize: typography.body.fontSize,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    editButtonText: {
        color: colors.text,
        fontWeight: '600',
        fontSize: typography.body.fontSize,
    },
});
