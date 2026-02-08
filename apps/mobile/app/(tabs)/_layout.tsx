import { Tabs } from 'expo-router';
import { MobileTabBar } from '../../components/layout/MobileTabBar';
import { Header } from '../../components/layout/Header';
import { View } from 'react-native';
import { colors } from '../../theme';

export default function TabLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Header />
            <Tabs
                tabBar={props => <MobileTabBar {...props} />}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Главная',
                    }}
                />
                <Tabs.Screen
                    name="events"
                    options={{
                        title: 'События',
                    }}
                />
                <Tabs.Screen
                    name="studio"
                    options={{
                        title: 'Студия',
                    }}
                />
                <Tabs.Screen
                    name="top"
                    options={{
                        title: 'Топ',
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Профиль',
                    }}
                />
            </Tabs>
        </View>
    );
}
