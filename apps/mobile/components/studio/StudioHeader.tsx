import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface StudioSubHeaderProps {
    studioMode: 'studio' | 'chat';
    balance: number | null;
    onSetStudioMode: (mode: 'studio' | 'chat') => void;
    onOpenEditor: () => void;
    onOpenPayment: () => void;
}

export function StudioSubHeader({
    studioMode,
    balance,
    onSetStudioMode,
    onOpenEditor,
    onOpenPayment,
}: StudioSubHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Mode Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity onPress={() => onSetStudioMode('studio')} activeOpacity={0.7}>
                    <Text style={[
                        styles.toggleText,
                        studioMode === 'studio' ? styles.toggleTextActive : styles.toggleTextInactive
                    ]}>
                        Studio
                    </Text>
                </TouchableOpacity>
                <Text style={styles.divider}>|</Text>
                <TouchableOpacity onPress={() => onSetStudioMode('chat')} activeOpacity={0.7}>
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
                <TouchableOpacity style={styles.editorButton} onPress={onOpenEditor} activeOpacity={0.7}>
                    <Ionicons name="pencil" size={12} color="#22d3ee" />
                    <Text style={styles.editorText}>Editor</Text>
                </TouchableOpacity>

                {/* Balance Button */}
                <TouchableOpacity style={styles.balanceButton} onPress={onOpenPayment} activeOpacity={0.7}>
                    <Ionicons name="flash" size={12} color="#eab308" />
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
        paddingHorizontal: spacing.md,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing.xs,
    },
    toggleText: {
        fontSize: 24, // Matches Telegram H1 style roughly
        fontWeight: 'bold',
    },
    toggleTextActive: {
        color: '#fff',
    },
    toggleTextInactive: {
        color: colors.textSecondary,
        fontSize: 24, // Keep same size so they align well
        opacity: 0.5,
    },
    divider: {
        color: colors.textSecondary,
        fontSize: 24,
        fontWeight: '300',
        marginHorizontal: 4,
        opacity: 0.3,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    editorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(8, 145, 178, 0.15)', // cyan-600/15
        borderWidth: 1,
        borderColor: 'rgba(6, 182, 212, 0.2)', // cyan-500/20
    },
    editorText: {
        color: '#67e8f9', // cyan-300
        fontSize: 11,
        fontWeight: '700',
    },
    balanceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        backgroundColor: '#18181b', // zinc-900
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    balanceText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
});
