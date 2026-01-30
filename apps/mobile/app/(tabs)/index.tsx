import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';

// Placeholder data
const PLACEHOLDER_DATA = Array.from({ length: 10 }, (_, i) => ({
    id: String(i + 1),
    title: `Generation #${i + 1}`,
    model: ['NanoBanana', 'SeeDream 4', 'GPT Image'][i % 3],
    likes: Math.floor(Math.random() * 100),
}));

export default function FeedScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    }, []);

    const renderItem = ({ item }: { item: typeof PLACEHOLDER_DATA[0] }) => (
        <View style={styles.card}>
            <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>🖼️</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardModel}>{item.model}</Text>
                <Text style={styles.cardLikes}>❤️ {item.likes}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={PLACEHOLDER_DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#a855f7"
                    />
                }
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>🎨 AiVerse Feed</Text>
                        <Text style={styles.headerSubtitle}>Discover AI-generated art</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    list: {
        padding: 16,
    },
    header: {
        marginBottom: 20,
        paddingTop: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        height: 200,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 48,
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    cardModel: {
        fontSize: 12,
        color: '#a855f7',
        marginBottom: 8,
    },
    cardLikes: {
        fontSize: 14,
        color: '#888',
    },
});
