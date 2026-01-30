import React from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface SearchBarProps {
    query: string;
    onQueryChange: (text: string) => void;
    onClose: () => void;
    placeholder?: string;
}

export function SearchBar({
    query,
    onQueryChange,
    onClose,
    placeholder = 'Search posts or users...',
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Ionicons name="search" size={18} color={colors.textMuted} />
                <TextInput
                    style={styles.input}
                    value={query}
                    onChangeText={onQueryChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textMuted}
                    autoFocus
                    returnKeyType="search"
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => onQueryChange('')}>
                        <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        height: 44,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        color: colors.text,
        fontSize: typography.body.fontSize,
    },
    cancelButton: {
        width: 44,
        height: 44,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
