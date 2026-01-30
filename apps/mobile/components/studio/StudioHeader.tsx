import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface StudioHeaderProps {
    studioMode: 'studio' | 'chat';
    balance: number | null;
    onSetStudioMode: (mode: 'studio' | 'chat') => void;
    onOpenEditor: () => void;
    onOpenPayment: () => void;
}

export function StudioHeader({
    studioMode,
    balance,
    onSetStudioMode,
    onOpenEditor,
    onOpenPayment,
}: StudioHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Mode Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity onPress={() => onSetStudioMode('studio')}>
                    <Text style={[
                        styles.toggleText,
                        studioMode === 'studio' ? styles.toggleTextActive : styles.toggleTextInactive
                    ]}>
                        Studio
                    </Text>
                </TouchableOpacity>
                <Text style={styles.divider}>|</Text>
                <TouchableOpacity onPress={() => onSetStudioMode('chat')}>
                    <Text style={[
                        styles.toggleText,
                        studioMode === 'chat' ? styles.toggleTextActive : styles.toggleTextInactive
                    ]}>
                        Chat
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actionsContainer}>
                {/* Editor Button */}
                <TouchableOpacity style={styles.editorButton} onPress={onOpenEditor}>
                    <Ionicons name="pencil" size={14} color="#22d3ee" />
                    <Text style={styles.editorText}>Editor</Text>
                </TouchableOpacity>

                {/* Balance Button */}
                <TouchableOpacity style={styles.balanceButton} onPress={onOpenPayment}>
                    <Ionicons name="flash" size={14} color="#eab308" />
                    <Text style={styles.balanceText}>
                        {balance !== null ? balance : '...'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    toggleText: {
        fontSize: typography.h3.fontSize,
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: '#fff',
    },
    toggleTextInactive: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: typography.body.fontSize,
    },
    divider: {
        color: colors.textSecondary,
        fontSize: 20,
        fontWeight: '300',
        marginHorizontal: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    editorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(8, 145, 178, 0.2)', // cyan-600/20
        borderWidth: 1,
        borderColor: 'rgba(6, 182, 212, 0.3)', // cyan-500/30
    },
    editorText: {
        color: '#67e8f9', // cyan-300
        fontSize: 12,
        fontWeight: '700',
    },
    balanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        backgroundColor: '#18181b', // zinc-900
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    balanceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
});
