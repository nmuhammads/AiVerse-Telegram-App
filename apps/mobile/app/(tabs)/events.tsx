import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EventsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: 100 + insets.bottom }]}>
            <Text style={styles.text}>События (В разработке)</Text>
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
        color: colors.text,
        fontSize: 16,
    }
});
