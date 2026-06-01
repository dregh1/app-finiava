// src/screens/DailyHabitsScreen.tsx
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { habitApi } from '../api/habitApi';
import { theme } from '../constants/theme';
import { Habit } from '../types/habit';

export default function DailyHabitsScreen() {

    const [habits, setHabits]         = useState<Habit[]>([]);
    const [loading, setLoading]       = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    const loadHabits = useCallback(async () => {
        try {
            const data = await habitApi.getAll();
            setHabits(data);
        } catch (error) {
            console.error('Erreur chargement habitudes', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { loadHabits(); }, [loadHabits]);

    const isCompletedToday = (habit: Habit): boolean =>
        habit.completions.includes(today);

    const handleToggle = async (habit: Habit) => {
        if (isCompletedToday(habit)) return;
        try {
            await habitApi.complete(habit.id, today);
            await loadHabits();
        } catch (error) {
            console.error('Erreur completion', error);
        }
    };

    const completedCount = habits.filter(isCompletedToday).length;
    const progressRate   = habits.length > 0
        ? completedCount / habits.length
        : 0;

    // ✅ Emoji selon la progression
    const getMoodEmoji = () => {
        if (progressRate === 0)   return '😴';
        if (progressRate < 0.5)   return '💪';
        if (progressRate < 1)     return '🔥';
        return '🏆';
    };

    const renderHabit = ({ item }: { item: Habit }) => {
        const completed = isCompletedToday(item);
        return (
            <TouchableOpacity
                style={[styles.habitItem, completed && styles.habitCompleted]}
                onPress={() => handleToggle(item)}
                activeOpacity={0.8}
            >
                {/* Checkbox */}
                <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
                    {completed && <Text style={styles.checkmark}>✓</Text>}
                </View>

                {/* Info */}
                <View style={styles.habitInfo}>
                    <Text style={[
                        styles.habitDescription,
                        completed && styles.habitDescriptionDone,
                    ]}>
                        {item.description}
                    </Text>
                    <Text style={styles.habitDate}>
                        📅 Jusqu'au {item.endDate}
                    </Text>
                </View>

                {/* Streak */}
                <View style={styles.streakBadge}>
                    <Text style={styles.streakText}>🔥</Text>
                    <Text style={styles.streakCount}>{item.completions.length}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Bonjour</Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                        })}
                    </Text>
                </View>
                <Text style={styles.moodEmoji}>{getMoodEmoji()}</Text>
            </View>

            {/* Carte de progression */}
            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Progression du jour</Text>
                    <Text style={styles.progressCount}>
                        {completedCount}/{habits.length}
                    </Text>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[
                        styles.progressFill,
                        { width: `${progressRate * 100}%` },
                    ]} />
                </View>
                <Text style={styles.progressPercent}>
                    {Math.round(progressRate * 100)}% complété
                </Text>
            </View>

            {/* Liste */}
            <Text style={styles.sectionTitle}>Mes habitudes</Text>
            <FlatList
                data={habits}
                keyExtractor={(item) => item.id}
                renderItem={renderHabit}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); loadHabits(); }}
                        colors={[theme.colors.primary]}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🎯</Text>
                        <Text style={styles.emptyTitle}>Aucune habitude</Text>
                        <Text style={styles.emptySubtitle}>
                            Ajoute ta première habitude !
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: theme.colors.textLight,
        fontSize: 14,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    date: {
        fontSize: 14,
        color: theme.colors.textLight,
        textTransform: 'capitalize',
        marginTop: 2,
    },
    moodEmoji: {
        fontSize: 40,
    },
    progressCard: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        ...theme.shadow,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    progressTitle: {
        color: '#FFFFFF',
        fontSize: 14,
        opacity: 0.9,
    },
    progressCount: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    progressTrack: {
        height: 10,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: theme.radius.full,
        marginBottom: theme.spacing.sm,
    },
    progressFill: {
        height: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: theme.radius.full,
    },
    progressPercent: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.8,
        textAlign: 'right',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        paddingHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    listContent: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    habitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        ...theme.shadow,
    },
    habitCompleted: {
        backgroundColor: theme.colors.primaryLight,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    checkbox: {
        width: 30,
        height: 30,
        borderRadius: theme.radius.sm,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    checkboxChecked: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    checkmark: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    habitInfo: {
        flex: 1,
    },
    habitDescription: {
        fontSize: 15,
        color: theme.colors.text,
        fontWeight: '500',
    },
    habitDescriptionDone: {
        textDecorationLine: 'line-through',
        color: theme.colors.textLight,
    },
    habitDate: {
        fontSize: 12,
        color: theme.colors.textLight,
        marginTop: 4,
    },
    streakBadge: {
        alignItems: 'center',
        backgroundColor: '#FFF3EE',
        borderRadius: theme.radius.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
    },
    streakText: {
        fontSize: 14,
    },
    streakCount: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.secondary,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
        gap: 8,
    },
    emptyEmoji: {
        fontSize: 50,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    emptySubtitle: {
        fontSize: 14,
        color: theme.colors.textLight,
    },
});
