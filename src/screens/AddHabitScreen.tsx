// src/screens/AddHabitScreen.tsx
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { habitApi } from '../api/habitApi';
import { theme } from '../constants/theme';

export default function AddHabitScreen() {

    const [description, setDescription] = useState('');
    const [startDate, setStartDate]     = useState('');
    const [endDate, setEndDate]         = useState('');
    const [loading, setLoading]         = useState(false);

    const handleSubmit = async () => {
        if (!description || !startDate || !endDate) {
            Alert.alert('Champs manquants', 'Veuillez remplir tous les champs');
            return;
        }
        try {
            setLoading(true);
            await habitApi.create({ description, startDate, endDate });
            Alert.alert('🎉 Succès', 'Habitude créée avec succès !');
            setDescription('');
            setStartDate('');
            setEndDate('');
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de créer l\'habitude');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Nouvelle habitude</Text>
                        <Text style={styles.subtitle}>
                            Construis de bonnes habitudes, une à la fois ✨
                        </Text>
                    </View>

                    {/* Formulaire */}
                    <View style={styles.form}>

                        {/* Description */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>📝 Description</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Faire du sport 30 min"
                                placeholderTextColor={theme.colors.textLight}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                            />
                        </View>

                        {/* Dates côte à côte */}
                        <View style={styles.dateRow}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.label}>📅 Début</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={startDate}
                                    onChangeText={setStartDate}
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.label}>🏁 Fin</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={theme.colors.textLight}
                                    value={endDate}
                                    onChangeText={setEndDate}
                                />
                            </View>
                        </View>

                        {/* Conseils */}
                        <View style={styles.tipCard}>
                            <Text style={styles.tipTitle}>💡 Conseil</Text>
                            <Text style={styles.tipText}>
                                Une bonne habitude est spécifique, mesurable et réaliste.
                                Commence petit et augmente progressivement !
                            </Text>
                        </View>

                        {/* Bouton */}
                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? '⏳ Création...' : '🚀 Créer l\'habitude'}
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    form: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        fontSize: 15,
        color: theme.colors.text,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        ...theme.shadow,
    },
    dateRow: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
    },
    tipCard: {
        backgroundColor: theme.colors.primaryLight,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 4,
    },
    tipText: {
        fontSize: 13,
        color: theme.colors.text,
        lineHeight: 20,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        ...theme.shadow,
    },
    buttonDisabled: {
        backgroundColor: '#B0ABFF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
