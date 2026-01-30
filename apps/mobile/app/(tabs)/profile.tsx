import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function ProfileScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>👤</Text>
                    </View>
                    <View style={styles.proBadge}>
                        <Text style={styles.proBadgeText}>PRO</Text>
                    </View>
                </View>
                <Text style={styles.name}>Guest User</Text>
                <Text style={styles.username}>@guest</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Generations</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Likes</Text>
                </View>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Token Balance</Text>
                <View style={styles.balanceRow}>
                    <Text style={styles.balanceValue}>6</Text>
                    <Text style={styles.balanceUnit}>tokens</Text>
                </View>
                <TouchableOpacity style={styles.topUpButton}>
                    <Text style={styles.topUpButtonText}>+ Top Up</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Generations</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🎨</Text>
                    <Text style={styles.emptyText}>No generations yet</Text>
                    <Text style={styles.emptyHint}>Create your first masterpiece in Studio!</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                {['Language', 'Notifications', 'About', 'Support'].map((item) => (
                    <TouchableOpacity key={item} style={styles.settingItem}>
                        <Text style={styles.settingText}>{item}</Text>
                        <Text style={styles.settingArrow}>›</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.version}>AiVerse v1.0.0</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        paddingTop: 16,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2a2a2a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 36,
    },
    proBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: '#a855f7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    proBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    username: {
        fontSize: 14,
        color: '#888',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#888',
    },
    balanceCard: {
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.3)',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#a855f7',
        marginBottom: 8,
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    balanceValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginRight: 8,
    },
    balanceUnit: {
        fontSize: 16,
        color: '#888',
    },
    topUpButton: {
        backgroundColor: '#a855f7',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    topUpButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    emptyState: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 4,
    },
    emptyHint: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
    },
    settingItem: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    settingText: {
        color: '#fff',
        fontSize: 16,
    },
    settingArrow: {
        color: '#666',
        fontSize: 20,
    },
    version: {
        textAlign: 'center',
        color: '#444',
        fontSize: 12,
        marginTop: 20,
    },
});
