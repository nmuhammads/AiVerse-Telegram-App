import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius } from '../../theme';
import { MobileHeader } from '../../components/studio/MobileHeader';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <MobileHeader />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textMuted,
                    tabBarStyle: {
                        backgroundColor: colors.surface,
                        borderTopWidth: 0,
                        height: 60 + insets.bottom,
                        paddingBottom: insets.bottom + 8,
                        paddingTop: 8,
                        // Glassmorphism effect
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 8, // Higher elevation to sit on top
                        zIndex: 50,   // High z-index
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    },
                    tabBarLabelStyle: {
                        fontSize: 11,
                        fontWeight: '600',
                    },
                    tabBarIconStyle: {
                        marginBottom: -2,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Feed',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="studio"
                    options={{
                        title: 'Studio',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'sparkles' : 'sparkles-outline'}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </View>
    );
}
