import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '../theme';

export default function MultiGenerationScreen() {
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Multi-Generation', headerTintColor: '#fff', headerStyle: { backgroundColor: colors.background } }} />
            <Text style={styles.text}>Multi-Generation Feature Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 18,
    }
});
