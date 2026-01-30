import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

const MODELS = [
    { id: 'nanobanana', name: 'NanoBanana', tokens: 3 },
    { id: 'nanobanana-pro', name: 'NanoBanana Pro', tokens: 15 },
    { id: 'seedream4', name: 'SeeDream 4', tokens: 4 },
    { id: 'seedream4-5', name: 'SeeDream 4.5', tokens: 7 },
    { id: 'gpt-image', name: 'GPT Image 1.5', tokens: 5 },
];

export default function StudioScreen() {
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState('seedream4');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>✨ Studio</Text>
                <Text style={styles.headerSubtitle}>Create AI-generated images</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prompt</Text>
                <TextInput
                    style={styles.promptInput}
                    placeholder="Describe your image..."
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={4}
                    value={prompt}
                    onChangeText={setPrompt}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Model</Text>
                <View style={styles.modelGrid}>
                    {MODELS.map((model) => (
                        <TouchableOpacity
                            key={model.id}
                            style={[
                                styles.modelCard,
                                selectedModel === model.id && styles.modelCardSelected,
                            ]}
                            onPress={() => setSelectedModel(model.id)}
                        >
                            <Text style={styles.modelName}>{model.name}</Text>
                            <Text style={styles.modelTokens}>{model.tokens} tokens</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Reference Images</Text>
                <TouchableOpacity style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>📷 Add Images (optional)</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.generateButton, !prompt && styles.generateButtonDisabled]}
                disabled={!prompt}
            >
                <Text style={styles.generateButtonText}>🚀 Generate</Text>
            </TouchableOpacity>

            <Text style={styles.hint}>
                Coming soon: Full generation functionality
            </Text>
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
        marginBottom: 24,
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
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    promptInput: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    modelGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modelCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        minWidth: '30%',
        flexGrow: 1,
    },
    modelCardSelected: {
        borderColor: '#a855f7',
    },
    modelName: {
        color: '#fff',
        fontWeight: '600',
        marginBottom: 4,
        fontSize: 13,
    },
    modelTokens: {
        color: '#888',
        fontSize: 11,
    },
    uploadButton: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    uploadButtonText: {
        color: '#888',
        fontSize: 16,
    },
    generateButton: {
        backgroundColor: '#a855f7',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    generateButtonDisabled: {
        backgroundColor: '#3a3a3a',
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    hint: {
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
        fontSize: 13,
    },
});
