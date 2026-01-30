import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ModelSelectorProps {
    selectedModel: string;
    mediaType: 'image' | 'video';
    onSelectModel: (model: string) => void;
    onSelectMediaType: (type: 'image' | 'video') => void;
}

const IMAGE_MODELS = [
    { id: 'nanobanana', name: 'NanoBanana', icon: '🍌' },
    { id: 'nanobanana-pro', name: 'NanoBanana Pro', icon: '👑' },
    { id: 'seedream4', name: 'Seedream 4', icon: '☁️' },
    { id: 'seedream4.5', name: 'Seedream 4.5', icon: '💎' },
];

const VIDEO_MODELS = [
    { id: 'kling-t2v', name: 'Kling 2.6', icon: '🎬' },
    { id: 'seedance-1.5-pro', name: 'Seedance Pro', icon: '💃' },
];

export function ModelSelector({
    selectedModel,
    mediaType,
    onSelectModel,
    onSelectMediaType,
}: ModelSelectorProps) {
    const models = mediaType === 'image' ? IMAGE_MODELS : VIDEO_MODELS;

    return (
        <View style={styles.container}>
            {/* Media Type Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, mediaType === 'image' && styles.toggleActive]}
                    onPress={() => onSelectMediaType('image')}
                >
                    <Ionicons
                        name="image"
                        size={16}
                        color={mediaType === 'image' ? '#fff' : colors.textSecondary}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.toggleText, mediaType === 'image' && styles.toggleTextActive]}>
                        Photo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, mediaType === 'video' && styles.toggleActive]}
                    onPress={() => onSelectMediaType('video')}
                >
                    <Ionicons
                        name="videocam"
                        size={16}
                        color={mediaType === 'video' ? '#fff' : colors.textSecondary}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.toggleText, mediaType === 'video' && styles.toggleTextActive]}>
                        Video
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Models Horizontal Scroll */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modelsScroll}
            >
                {models.map((model) => (
                    <TouchableOpacity
                        key={model.id}
                        style={[
                            styles.modelCard,
                            selectedModel === model.id && styles.modelCardActive,
                        ]}
                        onPress={() => onSelectModel(model.id)}
                    >
                        <View style={[
                            styles.iconContainer,
                            selectedModel === model.id && styles.iconContainerActive
                        ]}>
                            <Text style={styles.modelIcon}>{model.icon}</Text>
                        </View>
                        <Text
                            style={[
                                styles.modelName,
                                selectedModel === model.id && styles.modelNameActive,
                            ]}
                            numberOfLines={2}
                        >
                            {model.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface, // Should be surface (dark)
        padding: 4,
        borderRadius: borderRadius.lg,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 10, // Match TMA height roughly
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
    },
    toggleActive: {
        backgroundColor: colors.primaryDark, // Purple active state!
    },
    toggleText: {
        color: colors.textSecondary,
        fontSize: typography.body.fontSize,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#fff',
    },
    modelsScroll: {
        gap: spacing.sm,
        paddingRight: spacing.lg,
    },
    modelCard: {
        width: 100,
        height: 100,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xxl, // More rounded like TMA
        padding: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    modelCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.surface, // No colored bg, just border per TMA screen
        // But wait, mobile screenshot shows purple border. TMA screenshot shows GOLD border for Pro.
        // Let's stick to purple border for now as per theme.
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainerActive: {
        backgroundColor: colors.surfaceElevated,
    },
    modelIcon: {
        fontSize: 24,
    },
    modelName: {
        color: colors.textSecondary,
        fontSize: 11, // Smaller font
        fontWeight: '600',
        textAlign: 'center',
    },
    modelNameActive: {
        color: colors.text,
    },
});
