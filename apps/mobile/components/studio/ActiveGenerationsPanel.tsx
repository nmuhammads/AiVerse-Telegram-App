// import { useActiveGenerationsStore, ActiveGeneration } from '@aiverse/shared/stores/activeGenerationsStore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';


export interface ActiveGeneration {
    id: string
    prompt: string
    model: string
    status: 'processing' | 'completed' | 'error'
    startedAt: number
    imageUrl?: string
    imageUrls?: string[]
    videoUrl?: string
    error?: string
    mediaType: 'image' | 'video'
    imageCount: number
}

// MOCK STORE for UI Dev
const useActiveGenerationsStore = () => {
    // Return dummy data/actions
    return {
        generations: [] as ActiveGeneration[],
        removeGeneration: (id: string) => { },
        clearCompleted: () => { }
    }
}

interface ActiveGenerationsPanelProps {
    onViewResult: (gen: ActiveGeneration) => void;
}

const MODEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
    'nanobanana': 'happy',
    'nanobanana-pro': 'flash',
    'seedream4': 'color-palette',
    'seedream4-5': 'brush',
    'gpt-image-1.5': 'logo-android',
    'seedance-1.5-pro': 'musical-notes',
    'kling-t2v': 'videocam',
    'kling-i2v': 'images',
    'kling-mc': 'walk',
};

function formatElapsed(startedAt: number): string {
    const seconds = Math.floor((Date.now() - startedAt) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
}

function GenerationCard({ generation, onViewResult, onRemove }: {
    generation: ActiveGeneration;
    onViewResult: (gen: ActiveGeneration) => void;
    onRemove: (id: string) => void;
}) {
    const [elapsed, setElapsed] = useState(formatElapsed(generation.startedAt));

    useEffect(() => {
        if (generation.status !== 'processing') return;
        const interval = setInterval(() => {
            setElapsed(formatElapsed(generation.startedAt));
        }, 1000);
        return () => clearInterval(interval);
    }, [generation.status, generation.startedAt]);

    const iconName = MODEL_ICONS[generation.model] || 'image';

    return (
        <TouchableOpacity
            style={[
                styles.card,
                generation.status === 'completed' && styles.cardCompleted,
                generation.status === 'error' && styles.cardError,
            ]}
            onPress={() => {
                if (generation.status === 'completed') onViewResult(generation);
            }}
        >
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={16} color="#fff" />
                </View>
                <View style={styles.cardContent}>
                    <Text style={styles.promptText} numberOfLines={1}>
                        {generation.prompt || 'No prompt'}
                    </Text>
                    <View style={styles.statusRow}>
                        {generation.status === 'processing' && (
                            <>
                                <ActivityIndicator size="small" color={colors.primary} />
                                <Text style={styles.statusText}>{elapsed}</Text>
                            </>
                        )}
                        {generation.status === 'completed' && (
                            <>
                                <Ionicons name="checkmark-circle" size={12} color={colors.success} />
                                <Text style={[styles.statusText, { color: colors.success }]}>Done</Text>
                            </>
                        )}
                        {generation.status === 'error' && (
                            <>
                                <Ionicons name="alert-circle" size={12} color={colors.error} />
                                <Text style={[styles.statusText, { color: colors.error }]}>Error</Text>
                            </>
                        )}
                    </View>
                </View>

                {generation.status !== 'processing' && (
                    <TouchableOpacity onPress={() => onRemove(generation.id)} style={styles.closeBtn}>
                        <Ionicons name="close" size={14} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Preview for completed */}
            {generation.status === 'completed' && (generation.imageUrl || generation.videoUrl) && (
                <View style={styles.networkPreview}>
                    {/* Placeholder for video thumbnail if needed, or just image */}
                    <Image
                        source={{ uri: generation.imageUrl }}
                        style={styles.previewImage}
                        resizeMode="cover"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
}

export function ActiveGenerationsPanel({ onViewResult }: ActiveGenerationsPanelProps) {
    const { generations, removeGeneration, clearCompleted } = useActiveGenerationsStore();

    if (generations.length === 0) return null;

    const activeCount = generations.filter(g => g.status === 'processing').length;
    const completedCount = generations.filter(g => g.status !== 'processing').length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>ACTIVE GENERATIONS</Text>
                    {activeCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{activeCount}</Text>
                        </View>
                    )}
                </View>
                {completedCount > 0 && (
                    <TouchableOpacity onPress={clearCompleted}>
                        <Text style={styles.clearText}>Clear Completed</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
                {generations.map(gen => (
                    <GenerationCard
                        key={gen.id}
                        generation={gen}
                        onViewResult={onViewResult}
                        onRemove={removeGeneration}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.xs,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    title: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.textSecondary,
    },
    badge: {
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
    },
    clearText: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    list: {
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    card: {
        width: 180,
        backgroundColor: 'rgba(39, 39, 42, 0.5)', // zinc-800/50
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    cardCompleted: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // emerald-500/10
        borderColor: 'rgba(16, 185, 129, 0.3)',
    },
    cardError: {
        backgroundColor: 'rgba(244, 63, 94, 0.1)', // rose-500/10
        borderColor: 'rgba(244, 63, 94, 0.3)',
    },
    cardHeader: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    promptText: {
        fontSize: 12,
        color: colors.text,
        fontWeight: '500',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    statusText: {
        fontSize: 10,
        color: colors.textSecondary,
    },
    closeBtn: {
        padding: 2,
    },
    networkPreview: {
        marginTop: spacing.xs,
        height: 64,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
});
