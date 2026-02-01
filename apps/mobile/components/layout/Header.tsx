import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function Header() {
    const insets = useSafeAreaInsets();

    // TODO: Connect to real user store
    const user = {
        displayName: 'Morty',
        avatarUrl: 'https://i.pravatar.cc/100?img=11'
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                {/* Left: User Info */}
                <View style={styles.leftSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: user.avatarUrl }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.username}>{user.displayName}</Text>
                </View>

                {/* Right: Actions */}
                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.iconButton, styles.aiChatButton]}>
                        <Ionicons name="happy-outline" size={22} color={colors.primaryLight} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
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
        borderBottomColor: 'rgba(255,255,255,0.05)',
        zIndex: 50,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        height: 60,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    username: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: colors.surfaceLight,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.full,
    },
    aiChatButton: {
        backgroundColor: 'rgba(139, 92, 246, 0.15)', // violet-600/15
    },
});
