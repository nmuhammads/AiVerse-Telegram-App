import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../theme';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({
    width = '100%',
    height = 20,
    borderRadius: radius = borderRadius.md,
    style,
}: SkeletonProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [animatedValue]);

    const opacity = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width as any,
                    height: height as any,
                    borderRadius: radius,
                    opacity,
                },
                style,
            ]}
        />
    );
}

// Skeleton for feed cards
export function FeedCardSkeleton() {
    return (
        <View style={styles.feedCard}>
            <Skeleton height={200} borderRadius={borderRadius.lg} />
            <View style={styles.feedCardContent}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="40%" height={12} style={{ marginTop: 8 }} />
            </View>
        </View>
    );
}

// Skeleton grid for feed
export function FeedSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <View style={styles.grid}>
            {Array.from({ length: count }).map((_, i) => (
                <FeedCardSkeleton key={i} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: colors.surfaceLight,
    },
    feedCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: 16,
        overflow: 'hidden',
    },
    feedCardContent: {
        padding: 16,
    },
    grid: {
        gap: 16,
    },
});
