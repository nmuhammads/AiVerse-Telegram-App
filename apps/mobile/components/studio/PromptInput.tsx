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
    const rotateAnim = useRef(new Animated.Value(0)).current;

    // Animated border rotation
    useEffect(() => {
        const animation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 4000,
                useNativeDriver: true,
            })
        );
        animation.start();
        return () => animation.stop();
    }, [rotateAnim]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* Prompt Input with animated border */}
            <View style={styles.inputWrapper}>
                {/* Animated gradient border */}
                {/* Animated gradient border - 'Snake' effect simulation */}
                {/* Animated gradient border - 'Snake' effect simulation */}
                {/* Fallback to solid color because native module might be missing */}
                {/* Animated gradient border - 'Snake' effect simulation */}
                <AnimatedLinearGradient
                    // Simulate conic-gradient using linear gradient with hard stops for "head" and "tail"
                    colors={['transparent', 'transparent', colors.primary, colors.gradient.magenta, colors.gradient.cyan]}
                    locations={[0, 0.6, 0.65, 0.85, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.animatedBorder,
                        { transform: [{ rotate: rotation }] },
                    ]}
                />
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
    inputWrapper: {
        position: 'relative',
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    animatedBorder: {
        position: 'absolute',
        top: '-150%',
        left: '-150%',
        width: '400%',
        height: '400%',
        // Centers the rotation origin
    },
    inputInner: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        margin: 2,
        position: 'relative',
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
