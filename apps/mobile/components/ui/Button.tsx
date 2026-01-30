import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            style={[
                styles.base,
                styles[variant],
                styles[`size_${size}`],
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? colors.text : colors.primary}
                />
            ) : (
                <>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            styles[`text_${variant}`],
                            styles[`textSize_${size}`],
                            icon && { marginLeft: spacing.sm },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
    },
    // Variants
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surface,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    // Sizes
    size_sm: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        minHeight: 36,
    },
    size_md: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        minHeight: 44,
    },
    size_lg: {
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        minHeight: 52,
    },
    // Disabled
    disabled: {
        opacity: 0.5,
    },
    // Text
    text: {
        fontWeight: '600',
    },
    text_primary: {
        color: colors.text,
    },
    text_secondary: {
        color: colors.text,
    },
    text_ghost: {
        color: colors.primary,
    },
    text_outline: {
        color: colors.primary,
    },
    // Text sizes
    textSize_sm: {
        fontSize: typography.bodySmall.fontSize,
    },
    textSize_md: {
        fontSize: typography.body.fontSize,
    },
    textSize_lg: {
        fontSize: typography.h3.fontSize,
    },
});
