import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

// Types from shared (or defined locally if build fails)
type VideoDuration = '4' | '8' | '12';
type KlingDuration = '5' | '10';
type KlingMCQuality = '720p' | '1080p';
type CharacterOrientation = 'image' | 'video';

interface VideoSettingsProps {
    mediaType: 'image' | 'video';
    selectedModel: string;

    // Seedance props
    videoDuration: VideoDuration;
    videoResolution: string;
    fixedLens: boolean;
    generateAudio: boolean;

    // Kling props
    klingDuration: KlingDuration;
    klingSound: boolean;
    klingMCQuality: KlingMCQuality;
    characterOrientation: CharacterOrientation;
    uploadedImages: string[];
    uploadedVideoUrl: string | null;
    videoDurationSeconds: number;
    isUploadingVideo: boolean;
    prompt: string;

    // Setters
    onSetVideoDuration: (value: VideoDuration) => void;
    onSetVideoResolution: (value: string) => void;
    onSetFixedLens: (value: boolean) => void;
    onSetGenerateAudio: (value: boolean) => void;
    onSetKlingDuration: (value: KlingDuration) => void;
    onSetKlingSound: (value: boolean) => void;
    onSetKlingMCQuality: (value: KlingMCQuality) => void;
    onSetCharacterOrientation: (value: CharacterOrientation) => void;
    onSetUploadedImages: (images: string[]) => void;
    onSetUploadedVideoUrl: (value: string | null) => void;
    onSetIsUploadingVideo: (value: boolean) => void;
    onSetPrompt: (value: string) => void;
}

export function VideoSettings({
    mediaType,
    selectedModel,
    videoDuration,
    videoResolution,
    fixedLens,
    generateAudio,
    klingDuration,
    klingSound,
    klingMCQuality,
    characterOrientation,
    uploadedImages,
    uploadedVideoUrl,
    videoDurationSeconds,
    isUploadingVideo,
    prompt,
    onSetVideoDuration,
    onSetVideoResolution,
    onSetFixedLens,
    onSetGenerateAudio,
    onSetKlingDuration,
    onSetKlingSound,
    onSetKlingMCQuality,
    onSetCharacterOrientation,
    onSetUploadedImages,
    onSetUploadedVideoUrl,
    onSetIsUploadingVideo,
    onSetPrompt,
}: VideoSettingsProps) {

    if (mediaType !== 'video') return null;

    // Seedance 1.5 Pro Settings
    if (selectedModel === 'seedance-1.5-pro') {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {/* Duration */}
                    <View style={styles.column}>
                        <Text style={styles.label}>DURATION</Text>
                        <View style={styles.buttonGroup}>
                            {(['4', '8', '12'] as VideoDuration[]).map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    style={[styles.segmentBtn, videoDuration === d && styles.segmentBtnActive]}
                                    onPress={() => onSetVideoDuration(d)}
                                >
                                    <Text style={[styles.segmentText, videoDuration === d && styles.segmentTextActive]}>
                                        {d}s
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Resolution */}
                    <View style={styles.column}>
                        <Text style={styles.label}>RESOLUTION</Text>
                        <View style={styles.buttonGroup}>
                            {['480p', '720p'].map((res) => (
                                <TouchableOpacity
                                    key={res}
                                    style={[styles.segmentBtn, videoResolution === res && styles.segmentBtnActive]}
                                    onPress={() => onSetVideoResolution(res)}
                                >
                                    <Text style={[styles.segmentText, videoResolution === res && styles.segmentTextActive]}>
                                        {res}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    {/* Camera */}
                    <View style={styles.column}>
                        <Text style={styles.label}>CAMERA</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.segmentBtn, fixedLens && styles.segmentBtnActive]}
                                onPress={() => onSetFixedLens(true)}
                            >
                                <Ionicons name="lock-closed" size={12} color={fixedLens ? '#fff' : colors.textSecondary} />
                                <Text style={[styles.segmentText, fixedLens && styles.segmentTextActive]}>Static</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segmentBtn, !fixedLens && styles.segmentBtnActive]}
                                onPress={() => onSetFixedLens(false)}
                            >
                                <Ionicons name="lock-open" size={12} color={!fixedLens ? '#fff' : colors.textSecondary} />
                                <Text style={[styles.segmentText, !fixedLens && styles.segmentTextActive]}>Dynamic</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Audio */}
                    <View style={styles.column}>
                        <Text style={styles.label}>AUDIO</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.segmentBtn, !generateAudio && styles.segmentBtnActive]}
                                onPress={() => onSetGenerateAudio(false)}
                            >
                                <Ionicons name="volume-mute" size={12} color={!generateAudio ? '#fff' : colors.textSecondary} />
                                <Text style={[styles.segmentText, !generateAudio && styles.segmentTextActive]}>Off</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segmentBtn, generateAudio && styles.segmentBtnActive]}
                                onPress={() => onSetGenerateAudio(true)}
                            >
                                <Ionicons name="volume-high" size={12} color={generateAudio ? '#fff' : colors.textSecondary} />
                                <Text style={[styles.segmentText, generateAudio && styles.segmentTextActive]}>On</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Text style={styles.hint}>
                    {fixedLens ? 'Camera stays still' : 'Camera moves dynamically'}
                </Text>
            </View>
        );
    }

    // Kling Settings
    if (selectedModel === 'kling-t2v' || selectedModel === 'kling-i2v') {
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {/* Duration */}
                    <View style={styles.column}>
                        <Text style={styles.label}>DURATION</Text>
                        <View style={styles.buttonGroup}>
                            {(['5', '10'] as KlingDuration[]).map((d) => (
                                <TouchableOpacity
                                    key={d}
                                    style={[styles.segmentBtn, klingDuration === d && styles.segmentBtnActive]}
                                    onPress={() => onSetKlingDuration(d)}
                                >
                                    <Text style={[styles.segmentText, klingDuration === d && styles.segmentTextActive]}>
                                        {d}s
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Sound */}
                    <View style={styles.column}>
                        <Text style={styles.label}>SOUND</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.segmentBtn, !klingSound && styles.segmentBtnActive]}
                                onPress={() => onSetKlingSound(false)}
                            >
                                <Ionicons name="volume-mute" size={12} color={!klingSound ? '#fff' : colors.textSecondary} />
                                <Text style={[styles.segmentText, !klingSound && styles.segmentTextActive]}>Off</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segmentBtn, klingSound && styles.segmentBtnActive]}
                                onPress={() => onSetKlingSound(true)}
                            >
                                <Ionicons name="volume-high" size={12} color={klingSound ? '#fff' : colors.textSecondary} />
                                <Text style={[styles.segmentText, klingSound && styles.segmentTextActive]}>On</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    // TODO: Implement Kling MC (Motion Control) fully if needed

    return null;
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
        marginTop: spacing.sm,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    column: {
        flex: 1,
        gap: spacing.xs,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        paddingLeft: 4,
    },
    buttonGroup: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: 2,
        gap: 2,
        borderWidth: 1,
        borderColor: colors.border,
    },
    segmentBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.md,
        flexDirection: 'row',
        gap: 4,
    },
    segmentBtnActive: {
        backgroundColor: colors.surfaceLight,
    },
    segmentText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    segmentTextActive: {
        color: colors.text,
    },
    hint: {
        fontSize: 10,
        color: colors.textSecondary,
        paddingLeft: 4,
    },
});
