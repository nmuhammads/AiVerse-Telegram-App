import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ModelSelectorProps {
    selectedModel: string;
    mediaType: 'image' | 'video';
    generationMode: 'text' | 'image';
    klingVideoMode?: 't2v' | 'i2v' | 'motion-control';
    onSelectModel: (model: string) => void;
    onSelectMediaType: (type: 'image' | 'video') => void;
    onSelectGenerationMode: (mode: 'text' | 'image') => void;
    onSelectKlingVideoMode?: (mode: 't2v' | 'i2v' | 'motion-control') => void;
    onOpenMultiGeneration?: () => void;
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
    { id: 'seedance-1.5-pro', name: 'Seedance Pro', icon: require('../../assets/models/seedream.png'), desc: 'Music Videos', color: ['#f97316', '#ea580c'] as const },
    { id: 'kling-t2v', name: 'Kling 1.6', icon: require('../../assets/models/kling.png'), desc: 'Realistic Video', color: ['#8b5cf6', '#6d28d9'] as const },
];

export function ModelSelector({
    selectedModel,
    mediaType,
    generationMode,
    klingVideoMode,
    onSelectModel,
    onSelectMediaType,
    onSelectGenerationMode,
    onSelectKlingVideoMode,
    onOpenMultiGeneration
}: ModelSelectorProps) {

    return (
        <View style={styles.container}>
            {/* Media Type Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, mediaType === 'image' && styles.toggleActiveImage]}
                    onPress={() => onSelectMediaType('image')}
                    activeOpacity={0.8}
                >
                    {mediaType === 'image' ? (
                        <LinearGradient
                            colors={['#7c3aed', '#4f46e5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : null}
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
                    {mediaType === 'video' ? (
                        <LinearGradient
                            colors={['#ef4444', '#f97316']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : null}
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
                <>
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

                    {/* Multi-Generation Banner */}
                    <TouchableOpacity
                        style={styles.multiGenBanner}
                        onPress={onOpenMultiGeneration}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={['rgba(236, 72, 153, 0.1)', 'rgba(244, 63, 94, 0.1)']}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.multiGenContent}>
                            <View style={styles.multiGenIconWrapper}>
                                <LinearGradient
                                    colors={['#ec4899', '#e11d48']}
                                    style={StyleSheet.absoluteFill}
                                />
                                <Ionicons name="layers" size={20} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.multiGenTitle}>Multi-Generation</Text>
                                <Text style={styles.multiGenSubtitle}>Create up to 3 variants in different AI models</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.5)" />
                        </View>
                    </TouchableOpacity>

                    {/* Text/Image Mode Toggle for Image Media */}
                    <View style={styles.genModeSelector}>
                        <TouchableOpacity
                            style={[styles.genModeButton, generationMode === 'text' && styles.genModeActive]}
                            onPress={() => onSelectGenerationMode('text')}
                        >
                            <MaterialCommunityIcons
                                name="format-text"
                                size={16}
                                color={generationMode === 'text' ? '#fff' : colors.textSecondary}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.genModeText, generationMode === 'text' && styles.genModeTextActive]}>
                                Text to Image
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.genModeButton, generationMode === 'image' && styles.genModeActive]}
                            onPress={() => onSelectGenerationMode('image')}
                        >
                            <Ionicons
                                name="image"
                                size={16}
                                color={generationMode === 'image' ? '#fff' : colors.textSecondary}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.genModeText, generationMode === 'image' && styles.genModeTextActive]}>
                                Image to Image
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.videoGridContainer}>
                        {VIDEO_MODELS.map((model) => {
                            const isKlingModel = model.id === 'kling-t2v';
                            const isSelected = isKlingModel
                                ? ['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel)
                                : selectedModel === model.id;

                            return (
                                <TouchableOpacity
                                    key={model.id}
                                    style={[
                                        styles.videoModelCard,
                                        isSelected && styles.videoModelCardActive,
                                    ]}
                                    onPress={() => {
                                        if (isKlingModel) {
                                            const klingModel = klingVideoMode === 'motion-control' ? 'kling-mc' : klingVideoMode === 'i2v' ? 'kling-i2v' : 'kling-t2v';
                                            onSelectModel(klingModel);
                                        } else {
                                            onSelectModel(model.id);
                                        }
                                    }}
                                    activeOpacity={0.7}
                                >
                                    {isSelected && model.color && (
                                        <LinearGradient
                                            colors={model.color}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[StyleSheet.absoluteFill, { borderRadius: borderRadius.xl }]}
                                        />
                                    )}
                                    <View style={styles.videoIconContainer}>
                                        <Image source={model.icon} style={styles.modelIcon} resizeMode="cover" />
                                    </View>
                                    <View style={styles.videoInfo}>
                                        <Text style={[styles.videoModelName, isSelected && { color: '#fff' }]}>
                                            {model.name}
                                        </Text>
                                        <Text style={[styles.videoModelDesc, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>
                                            {model.desc}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Mode Toggles for Video */}
                    {selectedModel === 'seedance-1.5-pro' && (
                        <View style={styles.genModeSelector}>
                            <TouchableOpacity
                                style={[styles.genModeButton, generationMode === 'text' && styles.genModeActive]}
                                onPress={() => onSelectGenerationMode('text')}
                            >
                                <MaterialCommunityIcons name="format-text" size={16} color={generationMode === 'text' ? '#fff' : colors.textSecondary} style={{ marginRight: 6 }} />
                                <Text style={[styles.genModeText, generationMode === 'text' && styles.genModeTextActive]}>Text to Video</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genModeButton, generationMode === 'image' && styles.genModeActive]}
                                onPress={() => onSelectGenerationMode('image')}
                            >
                                <Ionicons name="image" size={16} color={generationMode === 'image' ? '#fff' : colors.textSecondary} style={{ marginRight: 6 }} />
                                <Text style={[styles.genModeText, generationMode === 'image' && styles.genModeTextActive]}>Image to Video</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel) && onSelectKlingVideoMode && (
                        <View style={styles.genModeSelector}>
                            <TouchableOpacity
                                style={[styles.genModeButton, klingVideoMode === 't2v' && styles.genModeActive]}
                                onPress={() => {
                                    onSelectKlingVideoMode('t2v');
                                    onSelectModel('kling-t2v');
                                    onSelectGenerationMode('text');
                                }}
                            >
                                <MaterialCommunityIcons name="format-text" size={14} color={klingVideoMode === 't2v' ? '#fff' : colors.textSecondary} style={{ marginRight: 4 }} />
                                <Text style={[styles.genModeText, klingVideoMode === 't2v' && styles.genModeTextActive, { fontSize: 12 }]}>T2V</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.genModeButton, klingVideoMode === 'i2v' && styles.genModeActive]}
                                onPress={() => {
                                    onSelectKlingVideoMode('i2v');
                                    onSelectModel('kling-i2v');
                                    onSelectGenerationMode('image');
                                }}
                            >
                                <Ionicons name="image" size={14} color={klingVideoMode === 'i2v' ? '#fff' : colors.textSecondary} style={{ marginRight: 4 }} />
                                <Text style={[styles.genModeText, klingVideoMode === 'i2v' && styles.genModeTextActive, { fontSize: 12 }]}>I2V</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.genModeButton, klingVideoMode === 'motion-control' && styles.genModeActive]}
                                onPress={() => {
                                    onSelectKlingVideoMode('motion-control');
                                    onSelectModel('kling-mc');
                                    onSelectGenerationMode('image');
                                }}
                            >
                                <Ionicons name="flash" size={14} color={klingVideoMode === 'motion-control' ? '#fff' : '#c084fc'} style={{ marginRight: 4 }} />
                                <Text style={[styles.genModeText, klingVideoMode === 'motion-control' && styles.genModeTextActive, { fontSize: 12, color: klingVideoMode === 'motion-control' ? '#fff' : '#c084fc' }]}>Motion</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
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
        height: 44,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    toggleActiveImage: {

    },
    toggleActiveVideo: {

    },
    toggleText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        zIndex: 1,
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
        width: '23%',
        aspectRatio: 0.85,
        backgroundColor: 'rgba(24, 24, 27, 0.4)',
        borderRadius: borderRadius.xl,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    modelCardActive: {
        backgroundColor: '#27272a',
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

    // MultiGen Banner
    multiGenBanner: {
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: 'rgba(236, 72, 153, 0.3)',
        overflow: 'hidden',
        height: 60,
    },
    multiGenContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
        height: '100%',
    },
    multiGenIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    multiGenTitle: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    multiGenSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 11,
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
        overflow: 'hidden',
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 4,
        borderRadius: borderRadius.lg,
        height: 44,
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
        backgroundColor: '#27272a',
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
