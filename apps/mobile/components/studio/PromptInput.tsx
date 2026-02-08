import React, { useRef, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface PromptInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    isOptimizing?: boolean;
    onOptimize?: () => void;
    onDescribe?: () => void;
    onClear?: () => void;
}

export function PromptInput({
    value,
    onChangeText,
    placeholder = 'Describe your idea...',
    isOptimizing = false,
    onOptimize,
    onDescribe,
    onClear,
}: PromptInputProps) {
    const pulseAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0.6,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [pulseAnim]);

    return (
        <View style={styles.container}>
            {/* Wrapper for border effect */}
            <View style={styles.borderWrapper}>
                {/* Pulsing gradient border - sits behind */}
                <AnimatedLinearGradient
                    colors={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradientBorder, { opacity: pulseAnim }]}
                />

                {/* Solid inner background - sits on top, no animation */}
                <View style={styles.inputInner}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        placeholderTextColor={colors.textMuted}
                        multiline
                        textAlignVertical="top"
                        blurOnSubmit={false}
                    />
                    {value.length > 0 && onClear && (
                        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
                            <Ionicons name="close" size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actions}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.optimizeButton,
                        (!value.trim() || isOptimizing) && styles.actionButtonDisabled,
                    ]}
                    onPress={onOptimize}
                    disabled={!value.trim() || isOptimizing}
                >
                    <Ionicons
                        name={isOptimizing ? 'sync' : 'sparkles'}
                        size={16}
                        color={value.trim() && !isOptimizing ? colors.text : colors.textMuted}
                    />
                    <Text
                        style={[
                            styles.actionText,
                            (!value.trim() || isOptimizing) && styles.actionTextDisabled,
                        ]}
                    >
                        {isOptimizing ? 'Optimizing...' : 'Enhance Prompt'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.describeButton]}
                    onPress={onDescribe}
                >
                    <Ionicons name="image" size={16} color={colors.textSecondary} />
                    <Text style={styles.describeText}>Prompt from Photo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    borderWrapper: {
        position: 'relative',
        borderRadius: 18,
        padding: 2,
    },
    gradientBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 18,
    },
    inputInner: {
        backgroundColor: '#18181b',
        borderRadius: 16,
        minHeight: 120,
    },
    input: {
        minHeight: 120,
        padding: spacing.lg,
        color: colors.text,
        fontSize: typography.body.fontSize,
        lineHeight: 22,
    },
    clearButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        width: 28,
        height: 28,
        backgroundColor: colors.surfaceLight,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        height: 40,
        borderRadius: borderRadius.lg,
    },
    optimizeButton: {
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    describeButton: {
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },
    actionText: {
        color: colors.text,
        fontSize: typography.bodySmall.fontSize,
        fontWeight: '600',
    },
    actionTextDisabled: {
        color: colors.textMuted,
    },
    describeText: {
        color: colors.textSecondary,
        fontSize: typography.bodySmall.fontSize,
        fontWeight: '600',
    },
});
