import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ImageUploaderProps {
    images: string[];
    onAddImage: (uri: string) => void;
    onRemoveImage: (index: number) => void;
    maxImages?: number;
}

export function ImageUploader({
    images,
    onAddImage,
    onRemoveImage,
    maxImages = 4,
}: ImageUploaderProps) {
    const pickImage = async () => {
        if (images.length >= maxImages) {
            Alert.alert('Limit Reached', `You can upload up to ${maxImages} images.`);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            onAddImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Reference Images ({images.length}/{maxImages})</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Upload Button */}
                {images.length < maxImages && (
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Ionicons name="add" size={24} color={colors.textSecondary} />
                        <Text style={styles.uploadText}>Add</Text>
                    </TouchableOpacity>
                )}

                {/* Images List */}
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => onRemoveImage(index)}
                        >
                            <Ionicons name="close" size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.sm,
    },
    label: {
        color: colors.textSecondary,
        fontSize: typography.label.fontSize,
        fontWeight: '600',
        marginLeft: spacing.sm,
    },
    scroll: {
        gap: spacing.md,
        paddingRight: spacing.lg,
    },
    uploadButton: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    uploadText: {
        color: colors.textSecondary,
        fontSize: typography.labelSmall.fontSize,
    },
    imageWrapper: {
        position: 'relative',
        width: 80,
        height: 80,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: borderRadius.lg,
    },
    removeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.error,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.surface,
    },
});
