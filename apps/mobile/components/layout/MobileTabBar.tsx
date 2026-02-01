import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Clock, Settings2, Star, User, MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Studio star component for the animation effect (simplified for mobile initially)
const StarSVG = ({ style }: { style: any }) => (
    <View style={[styles.star, style]} />
);

export function MobileTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    // Assuming studioMode is handled similarly or defaulting for now. 
    // You might need to import a store if it's shared or pass it down.
    const studioMode: string = 'default';

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
            <View style={styles.contentContainer}>
                <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
                    <View style={styles.tabRow}>
                        {state.routes.map((route, index) => {
                            const { options } = descriptors[route.key];
                            const label =
                                options.tabBarLabel !== undefined
                                    ? options.tabBarLabel
                                    : options.title !== undefined
                                        ? options.title
                                        : route.name;

                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!isFocused && !event.defaultPrevented) {
                                    navigation.navigate(route.name, route.params);
                                }
                            };

                            const isStudio = route.name === 'studio';

                            // Mapping icons based on route name matching the web logic
                            // 'index' -> Home
                            // 'events' -> Events
                            // 'studio' -> Studio
                            // 'top' -> Top
                            // 'profile' -> Profile

                            let IconComponent = Home;
                            if (route.name === 'index') IconComponent = Home;
                            else if (route.name === 'events') IconComponent = Clock;
                            else if (route.name === 'studio') IconComponent = studioMode === 'chat' ? MessageCircle : Settings2;
                            else if (route.name === 'top') IconComponent = Star;
                            else if (route.name === 'profile') IconComponent = User;

                            const iconColor = isFocused ? '#FFFFFF' : '#A1A1AA'; // zinc-200 vs zinc-400 equivalent

                            if (isStudio && isFocused) {
                                return (
                                    <TouchableOpacity
                                        key={route.key}
                                        onPress={onPress}
                                        style={[styles.tabBtn, styles.studioBtnActive]}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#7C3AED', '#4F46E5']} // violet-600 to indigo-600
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.studioGradient}
                                        >
                                            <IconComponent size={24} color="#FFFFFF" strokeWidth={2} />
                                            {/* Badge logic can be added here if needed */}
                                            <Text style={[styles.label, { color: '#FFFFFF' }]}>
                                                {label as string}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )
                            }

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    onPress={onPress}
                                    style={[styles.tabBtn, isFocused && styles.tabBtnActive]}
                                    activeOpacity={0.7}
                                >
                                    <IconComponent size={24} color={iconColor} strokeWidth={2} />
                                    {/* Badge logic can be added here */}
                                    <Text style={[styles.label, { color: iconColor }]}>
                                        {label as string}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </BlurView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 50,
    },
    contentContainer: {
        width: '92%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    blurContainer: {
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    },
    tabRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 4,
        borderRadius: 999,
    },
    tabBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.15)', // white/15 roughly
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
    },
    studioBtnActive: {
        // Container for the gradient
        paddingVertical: 0, // Reset padding because gradient handles it
    },
    studioGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 999,
        gap: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    star: {
        // Placeholder for star animation styles if needed
    }
});
