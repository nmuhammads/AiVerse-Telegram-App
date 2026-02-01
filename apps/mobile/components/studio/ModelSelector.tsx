import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Need MaterialCommunityIcons for some specific icons maybe
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ModelSelectorProps {
    selectedModel: string;
    mediaType: 'image' | 'video';
    onSelectModel: (model: string) => void;
    onSelectMediaType: (type: 'image' | 'video') => void;
}

const IMAGE_MODELS = [
    { id: 'nanobanana', name: 'NanoBanana', icon: require('../../assets/models/nanobanana.png') },
    { id: 'nanobanana-pro', name: 'NanoBanana Pro', icon: require('../../assets/models/nanobanana-pro.png') },
    { id: 'seedream4', name: 'Seedream 4', icon: require('../../assets/models/seedream.png') },
    { id: 'seedream4-5', name: 'Seedream 4.5', icon: require('../../assets/models/seedream-4-5.png') },
    { id: 'gpt-image-1.5', name: 'GPT Image', icon: require('../../assets/models/gpt-image.png') },
    { id: 'qwen-image', name: 'Qwen Image', icon: require('../../assets/models/qwen.png') },
];

const VIDEO_MODELS = [
    { id: 'seedance-1.5-pro', name: 'Seedance Pro', icon: require('../../assets/models/seedream.png'), desc: 'Music Videos' },
    { id: 'kling-t2v', name: 'Kling 2.6', icon: require('../../assets/models/kling.png'), desc: 'Realistic Video' },
];

export function ModelSelector({
    selectedModel,
    mediaType,
    onSelectModel,
    onSelectMediaType,
}: ModelSelectorProps) {

    const isKling = ['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel);

    return (
        <View style={styles.container}>
            {/* Media Type Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, mediaType === 'image' && styles.toggleActiveImage]}
                    onPress={() => onSelectMediaType('image')}
                    activeOpacity={0.8}
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
                    style={[styles.toggleButton, mediaType === 'video' && styles.toggleActiveVideo]}
                    onPress={() => onSelectMediaType('video')}
                    activeOpacity={0.8}
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

            {/* Models Grid */}
            {mediaType === 'image' ? (
                <View style={styles.gridContainer}>
                    {IMAGE_MODELS.map((model) => (
                        <TouchableOpacity
                            key={model.id}
                            style={[
                                styles.modelCard,
                                selectedModel === model.id && styles.modelCardActive,
                            ]}
                            onPress={() => onSelectModel(model.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                selectedModel === model.id && styles.iconContainerActive
                            ]}>
                                <Image source={model.icon} style={styles.modelIcon} resizeMode="cover" />
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
                </View>
            ) : (
                <View style={styles.videoGridContainer}>
                    {VIDEO_MODELS.map((model) => (
                        <TouchableOpacity
                            key={model.id}
                            style={[
                                styles.videoModelCard,
                                selectedModel === model.id && styles.videoModelCardActive,
                                selectedModel === model.id && { borderColor: model.id === 'seedance-1.5-pro' ? '#f97316' : '#06b6d4' } // Orange or Blueish
                            ]}
                            onPress={() => onSelectModel(model.id)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.videoIconContainer}>
                                <Image source={model.icon} style={styles.modelIcon} resizeMode="cover" />
                            </View>
                            <View style={styles.videoInfo}>
                                <Text style={[styles.videoModelName, selectedModel === model.id && { color: '#fff' }]}>
                                    {model.name}
                                </Text>
                                <Text style={styles.videoModelDesc}>
                                    {model.desc}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 4,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
    },
    toggleActiveImage: {
        backgroundColor: '#7c3aed', // violet-600
    },
    toggleActiveVideo: {
        backgroundColor: '#f97316', // orange-500
    },
    toggleText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#fff',
    },

    // Image Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modelCard: {
        width: '23%', // approx 4 cols (100% / 4 - gap)
        aspectRatio: 0.85,
        backgroundColor: 'rgba(24, 24, 27, 0.4)', // zinc-900/40
        borderRadius: borderRadius.xl,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    modelCardActive: {
        backgroundColor: '#27272a', // zinc-800
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.surfaceLight,
    },
    iconContainerActive: {
        transform: [{ scale: 1.1 }],
    },
    modelIcon: {
        width: '100%',
        height: '100%',
    },
    modelName: {
        color: colors.textSecondary,
        fontSize: 10,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 12,
    },
    modelNameActive: {
        color: '#fff',
    },

    // Video Grid
    videoGridContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    videoModelCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: borderRadius.xl,
        backgroundColor: 'rgba(24, 24, 27, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 12,
    },
    videoModelCardActive: {
        backgroundColor: 'rgba(24, 24, 27, 0.8)',
    },
    videoIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        overflow: 'hidden',
    },
    videoInfo: {
        flex: 1,
    },
    videoModelName: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    videoModelDesc: {
        color: colors.textSecondary,
        fontSize: 12,
    },

    // Generation Mode Selector
    genModeSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)', // Match toggle container
        padding: 4,
        borderRadius: borderRadius.lg,
        height: 44, // Slightly smaller than before
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    genModeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
    },
    genModeActive: {
        backgroundColor: '#27272a', // zinc-800
    },
    genModeText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 13,
    },
    genModeTextActive: {
        color: '#fff',
    },
});
