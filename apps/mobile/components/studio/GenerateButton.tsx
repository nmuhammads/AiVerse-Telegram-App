import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface GenerateButtonProps {
    onPress: () => void;
    isDisabled?: boolean;
    cost?: number;
    isGenerating?: boolean;
}

export function GenerateButton({
    onPress,
    isDisabled = false,
    cost = 1,
    isGenerating = false,
}: GenerateButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            disabled={isDisabled || isGenerating}
            onPress={onPress}
        >
            <View style={styles.content}>
                {isGenerating ? (
                    <Text style={styles.text}>Generating...</Text>
                ) : (
                    <>
                        <Ionicons name="sparkles" size={20} color="#fff" />
                        <Text style={styles.text}>Generate</Text>
                        <View style={styles.costBadge}>
                            <Text style={styles.costText}>{cost} ⚡</Text>
                        </View>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    text: {
        color: '#fff',
        fontSize: typography.button.fontSize,
        fontWeight: '700',
    },
    costBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.full,
    },
    costText: {
        color: '#fff',
        fontSize: typography.labelSmall.fontSize,
        fontWeight: '600',
    },
});
