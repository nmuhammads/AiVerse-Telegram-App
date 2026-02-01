import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface ImageUploaderProps {
    images: string[];
    onAddImage: (uri: string) => void;
    onRemoveImage: (index: number) => void;
    maxImages?: number;
    generationMode: 'text' | 'image';
    mediaType: 'image' | 'video';
}

export function ImageUploader({
    images,
    onAddImage,
    onRemoveImage,
    maxImages = 4,
    generationMode,
    mediaType,
}: ImageUploaderProps) {

    // Logic: Hide if Text mode
    if (generationMode === 'text') {
        return null;
    }

    const pickImage = async () => {
        if (images.length >= maxImages) {
            Alert.alert('Limit Reached', `You can upload up to ${maxImages} images.`);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, // Maybe false for bulk? Web allows editing usually? Let's keep true for now.
            quality: 0.8,
        });

        if (!result.canceled) {
            onAddImage(result.assets[0].uri);
        }
    };

    // Render Empty State (No images uploaded) matches Web: "Add references...", Icon centered, Select Photo button.
    if (images.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.dashedBox}>
                    <View style={styles.emptyContent}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="image" size={20} color="#a1a1aa" />
                        </View>
                        <Text style={styles.emptyText}>Add reference images (Max {maxImages})</Text>
                    </View>

                    <TouchableOpacity style={styles.selectButton} onPress={pickImage} activeOpacity={0.8}>
                        <Ionicons name="image-outline" size={16} color={colors.textSecondary} />
                        <Text style={styles.selectButtonText}>Select Photo</Text>
                    </TouchableOpacity>

                    <Text style={styles.hintText}>Copy an image and paste here is not supported on mobile yet</Text>
                </View>
            </View>
        );
    }

    // Render Filled State: Grid of images
    return (
        <View style={styles.container}>
            <View style={styles.dashedBox}>
                <View style={styles.gridContainer}>
                    {images.map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => onRemoveImage(index)}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={10} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Add More Button if limit not reached */}
                    {images.length < maxImages && (
                        <TouchableOpacity style={styles.addMoreButton} onPress={pickImage}>
                            <Ionicons name="add" size={20} color={colors.textSecondary} />
                            <Text style={styles.addMoreText}>Add</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: spacing.sm,
    },
    dashedBox: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: 'dashed',
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        backgroundColor: 'rgba(24, 24, 27, 0.2)', // zinc-900/20
        gap: spacing.md,
    },
    // Empty State
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#27272a', // zinc-800
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyText: {
        color: '#d4d4d8', // zinc-300
        fontSize: 12,
        fontWeight: '500',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: borderRadius.xl,
        paddingVertical: 10,
        gap: 8,
    },
    selectButtonText: {
        color: '#a1a1aa', // zinc-400
        fontSize: 12,
        fontWeight: '500',
    },
    hintText: {
        textAlign: 'center',
        color: '#52525b', // zinc-600
        fontSize: 10,
    },

    // Filled State Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imageWrapper: {
        width: '23%', // 4 columns approx
        aspectRatio: 1,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#27272a',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addMoreButton: {
        width: '23%',
        aspectRatio: 1,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    addMoreText: {
        color: '#a1a1aa',
        fontSize: 10,
    }
});
