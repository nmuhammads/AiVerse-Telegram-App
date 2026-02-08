import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../../theme';

interface ImageUploaderProps {
    images: string[];
    onAddImage: (uri: string) => void;
    onRemoveImage: (index: number) => void;
    maxImages?: number;
    generationMode: 'text' | 'image';
    mediaType: 'image' | 'video';
    selectedModel: string;
}

export function ImageUploader({
    images,
    onAddImage,
    onRemoveImage,
    maxImages = 4,
    generationMode,
    mediaType,
    selectedModel
}: ImageUploaderProps) {

    // Logic: Hide if Text mode
    if (generationMode === 'text') {
        return null;
    }

    const pickImage = async (customIndex?: number) => {
        try {
            // Permission check
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'We need access to your photos to upload images.');
                return;
            }

            // Validation for Video mode
            if (mediaType === 'video') {
                const isKling = ['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel);
                if (isKling && images.length >= 1 && customIndex === undefined) return;
                if (!isKling && images.length >= 2 && customIndex === undefined) return;
            } else {
                if (images.length >= maxImages) {
                    Alert.alert('Limit Reached', `You can upload up to ${maxImages} images.`);
                    return;
                }
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false, // Disabled to prevent crashes on some devices
                quality: 0.8,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                if (mediaType === 'video' && !['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel) && customIndex !== undefined) {
                    // If picking for a specific slot, we ideally want to replace.
                    // Since we only have onAddImage/onRemoveImage, we'll just add for now.
                    // A full implementation would need setImages prop.
                    onAddImage(uri);
                } else {
                    onAddImage(uri);
                }
            }
        } catch (error) {
            console.error('ImagePicker Error:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    // Check if Video Mode (Non-Kling) -> Start/End Frame
    if (mediaType === 'video' && !['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel)) {
        const startFrame = images[0];
        const endFrame = images[1];

        return (
            <View style={styles.container}>
                <View style={styles.videoGrid}>
                    {/* Start Frame */}
                    <View style={styles.frameSlotContainer}>
                        <Text style={styles.slotLabel}>Start Frame</Text>
                        {startFrame ? (
                            <View style={styles.frameSlotFilled}>
                                <Image source={{ uri: startFrame }} style={styles.image} resizeMode="cover" />
                                <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveImage(0)}>
                                    <Ionicons name="close" size={12} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.frameSlotEmpty} onPress={() => pickImage(0)}>
                                <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
                                <Text style={styles.slotText}>Select</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* End Frame */}
                    <View style={styles.frameSlotContainer}>
                        <Text style={styles.slotLabel}>End Frame</Text>
                        {endFrame ? (
                            <View style={styles.frameSlotFilled}>
                                <Image source={{ uri: endFrame }} style={styles.image} resizeMode="cover" />
                                <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveImage(1)}>
                                    <Ionicons name="close" size={12} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.frameSlotEmpty} onPress={() => pickImage(1)}>
                                <Ionicons name="image-outline" size={24} color={colors.textSecondary} />
                                <Text style={styles.slotText}>Select</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <Text style={styles.hintText}>Upload start and end frames for video transition</Text>
            </View>
        );
    }

    // Check if Kling Video Mode -> Single Reference Image
    if (mediaType === 'video' && ['kling-t2v', 'kling-i2v', 'kling-mc'].includes(selectedModel)) {
        return (
            <View style={styles.container}>
                <View style={styles.dashedBox}>
                    {images.length > 0 ? (
                        <View style={styles.imageWrapperLarge}>
                            <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />
                            <TouchableOpacity style={styles.removeButton} onPress={() => onRemoveImage(0)}>
                                <Ionicons name="close" size={14} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.emptyContent}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="image" size={20} color="#a1a1aa" />
                            </View>
                            <Text style={styles.emptyText}>Upload Reference Image</Text>
                            <TouchableOpacity style={styles.selectButton} onPress={() => pickImage()}>
                                <Text style={styles.selectButtonText}>Select Photo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    // Default Image Mode (Grid)
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

                    <TouchableOpacity style={styles.selectButton} onPress={() => pickImage()} activeOpacity={0.8}>
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
                        <TouchableOpacity style={styles.addMoreButton} onPress={() => pickImage()}>
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
        minHeight: 160,
        justifyContent: 'center',
    },
    emptyContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#27272a',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyText: {
        color: '#d4d4d8',
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
        paddingHorizontal: 20,
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
        marginTop: 4,
    },

    // Filled State Grid
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imageWrapper: {
        width: '23%',
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
    },

    // Video Specific
    videoGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    frameSlotContainer: {
        flex: 1,
        gap: 8,
    },
    slotLabel: {
        color: '#71717a',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    frameSlotEmpty: {
        aspectRatio: 4 / 3,
        backgroundColor: 'rgba(24, 24, 27, 0.4)',
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    frameSlotFilled: {
        aspectRatio: 4 / 3,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    slotText: {
        color: '#a1a1aa',
        fontSize: 12,
    },
    imageWrapperLarge: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        position: 'relative',
    }
});
