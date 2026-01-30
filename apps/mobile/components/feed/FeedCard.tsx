import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

export interface FeedItem {
    id: string;
    image_url: string;
    prompt?: string;
    model?: string;
    likes_count: number;
    is_liked?: boolean;
    author?: {
        id: number;
        username?: string;
        avatar_url?: string;
    };
    created_at?: string;
}

interface FeedCardProps {
    item: FeedItem;
    variant?: 'standard' | 'compact';
    onPress: () => void;
    onLike: () => void;
    onRemix?: () => void;
}

export function FeedCard({
    item,
    variant = 'standard',
    onPress,
    onLike,
    onRemix,
}: FeedCardProps) {
    const isCompact = variant === 'compact';
    const [imageError, setImageError] = useState(false);

    return (
        <TouchableOpacity
            style={[styles.container, isCompact && styles.containerCompact]}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Image */}
            <View style={[styles.imageContainer, isCompact && styles.imageContainerCompact]}>
                {item.image_url && !imageError ? (
                    <Image
                        source={{ uri: item.image_url }}
                        style={styles.image}
                        resizeMode="cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderEmoji}>🖼️</Text>
                    </View>
                )}

                {/* Model Badge */}
                {item.model && (
                    <View style={styles.modelBadge}>
                        <Text style={styles.modelText}>{item.model}</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            {!isCompact && (
                <View style={styles.content}>
                    {/* Author Row */}
                    <View style={styles.authorRow}>
                        <View style={styles.authorAvatar}>
                            {item.author?.avatar_url ? (
                                <Image
                                    source={{ uri: item.author.avatar_url }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Text style={styles.avatarEmoji}>👤</Text>
                            )}
                        </View>
                        <Text style={styles.authorName} numberOfLines={1}>
                            {item.author?.username || 'Anonymous'}
                        </Text>
                    </View>

                    {/* Prompt */}
                    {item.prompt && (
                        <Text style={styles.prompt} numberOfLines={2}>
                            {item.prompt}
                        </Text>
                    )}

                    {/* Actions */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
                            <Ionicons
                                name={item.is_liked ? 'heart' : 'heart-outline'}
                                size={20}
                                color={item.is_liked ? '#ef4444' : colors.textSecondary}
                            />
                            <Text style={styles.actionText}>{item.likes_count}</Text>
                        </TouchableOpacity>

                        {onRemix && (
                            <TouchableOpacity style={styles.actionButton} onPress={onRemix}>
                                <Ionicons name="repeat" size={20} color={colors.textSecondary} />
                                <Text style={styles.actionText}>Remix</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Compact overlay */}
            {isCompact && (
                <View style={styles.compactOverlay}>
                    <View style={styles.compactLikes}>
                        <Ionicons
                            name={item.is_liked ? 'heart' : 'heart-outline'}
                            size={14}
                            color={item.is_liked ? '#ef4444' : colors.text}
                        />
                        <Text style={styles.compactLikesText}>{item.likes_count}</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        ...shadows.small,
    },
    containerCompact: {
        marginBottom: spacing.sm,
    },
    imageContainer: {
        aspectRatio: 1,
        backgroundColor: colors.surfaceLight,
    },
    imageContainerCompact: {
        aspectRatio: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderEmoji: {
        fontSize: 48,
    },
    modelBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: borderRadius.sm,
    },
    modelText: {
        color: colors.text,
        fontSize: typography.labelSmall.fontSize,
        fontWeight: '600',
    },
    content: {
        padding: spacing.lg,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    authorAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    avatarImage: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    avatarEmoji: {
        fontSize: 14,
    },
    authorName: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall.fontSize,
        flex: 1,
    },
    prompt: {
        color: colors.text,
        fontSize: typography.bodySmall.fontSize,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    actionText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall.fontSize,
    },
    compactOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    compactLikes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    compactLikesText: {
        color: colors.text,
        fontSize: typography.labelSmall.fontSize,
    },
});
