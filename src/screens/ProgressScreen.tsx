// src/screens/ProgressScreen.tsx
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { habitApi } from '../api/habitApi';
import { theme } from '../constants/theme';
import { Habit } from '../types/habit';

export default function ProgressScreen() {

    const [habits, setHabits]   = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    const getLast7Days = (): string[] =>
        Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

    const getStatsForDay = (date: string) => ({
        completed: habits.filter(h => h.completions.includes(date)).length,
        total: habits.length,
    });

    const getWeeklyRate = (): number => {
        const days = getLast7Days();
        const totalPossible = habits.length * 7;
        if (totalPossible === 0) return 0;
        const totalCompleted = days.reduce((acc, day) =>
            acc + habits.filter(h => h.completions.includes(day)).length, 0
        );
        return Math.round((totalCompleted / totalPossible) * 100);
    };

    useEffect(() => {
        const loadStats = async () => {
            try {
                const end   = new Date().toISOString().split('T')[0];
                const start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
                    .toISOString().split('T')[0];
                const data = await habitApi.getStatsBetween(start, end);
                setHabits(data);
            } catch (error) {
                console.error('Erreur chargement stats', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    }

    const last7Days  = getLast7Days();
    const weeklyRate = getWeeklyRate();

    // ✅ Couleur selon le taux
    const getRateColor = (rate: number) => {
        if (rate >= 80) return theme.colors.success;
        if (rate >= 50) return theme.colors.warning;
        return theme.colors.secondary;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Mes Progrès</Text>
                    <Text style={styles.subtitle}>Semaine en cours 📈</Text>
                </View>

                {/* Carte taux global */}
                <View style={[styles.rateCard, { backgroundColor: getRateColor(weeklyRate) }]}>
                    <Text style={styles.rateEmoji}>
                        {weeklyRate >= 80 ? '🏆' : weeklyRate >= 50 ? '💪' : '🎯'}
                    </Text>
                    <Text style={styles.rateValue}>{weeklyRate}%</Text>
                    <Text style={styles.rateLabel}>de complétion cette semaine</Text>
                </View>

                {/* Stats rapides */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>📋</Text>
                        <Text style={styles.statValue}>{habits.length}</Text>
                        <Text style={styles.statLabel}>Habitudes</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>✅</Text>
                        <Text style={styles.statValue}>
                            {last7Days.reduce((acc, day) =>
                                acc + habits.filter(h => h.completions.includes(day)).length, 0
                            )}
                        </Text>
                        <Text style={styles.statLabel}>Complétées</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statEmoji}>🔥</Text>
                        <Text style={styles.statValue}>
                            {Math.max(...habits.map(h => h.completions.length), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Meilleur streak</Text>
                    </View>
                </View>

                {/* Graphique 7 jours */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📊 7 derniers jours</Text>
                    <View style={styles.chart}>
                        {last7Days.map((date) => {
                            const { completed, total } = getStatsForDay(date);
                            const rate    = total > 0 ? completed / total : 0;
                            const isToday = date === new Date().toISOString().split('T')[0];
                            const dayName = new Date(date).toLocaleDateString('fr-FR', {
                                weekday: 'short',
                            });
                            return (
                                <View key={date} style={styles.chartColumn}>
                                    <Text style={styles.barValue}>{completed}</Text>
                                    <View style={styles.barContainer}>
                                        <View style={[
                                            styles.bar,
                                            {
                                                height: `${Math.max(rate * 100, 5)}%`,
                                                backgroundColor: isToday
                                                    ? theme.colors.secondary
                                                    : theme.colors.primary,
                                            }
                                        ]} />
                                    </View>
                                    <Text style={[
                                        styles.barLabel,
                                        isToday && styles.barLabelToday,
                                    ]}>
                                        {dayName}
                                    </Text>
                                    {isToday && (
                                        <View style={styles.todayDot} />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* Détail par habitude */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🎯 Détail par habitude</Text>
                    {habits.length === 0 ? (
                        <Text style={styles.emptyText}>Aucune habitude enregistrée</Text>
                    ) : (
                        habits.map((habit) => {
                            const completedThisWeek = last7Days.filter(day =>
                                habit.completions.includes(day)
                            ).length;
                            const rate = Math.round((completedThisWeek / 7) * 100);
                            return (
                                <View key={habit.id} style={styles.habitStat}>
                                    <Text style={styles.habitStatName} numberOfLines={1}>
                                        {habit.description}
                                    </Text>
                                    <View style={styles.habitStatBar}>
                                        <View style={[
                                            styles.habitStatFill,
                                            {
                                                width: `${rate}%`,
                                                backgroundColor: getRateColor(rate),
                                            }
                                        ]} />
                                    </View>
                                    <Text style={[
                                        styles.habitStatRate,
                                        { color: getRateColor(rate) }
                                    ]}>
                                        {rate}%
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </View>

            </ScrollView>
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
    rateCard: {
        borderRadius: theme.radius.lg,
        padding: theme.spacing.xl,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
        ...theme.shadow,
    },
    rateEmoji: {
        fontSize: 40,
        marginBottom: theme.spacing.sm,
    },
    rateValue: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    rateLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 4,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        ...theme.shadow,
    },
    statEmoji: {
        fontSize: 22,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: 11,
        color: theme.colors.textLight,
        marginTop: 2,
        textAlign: 'center',
    },
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.lg,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadow,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 160,
    },
    chartColumn: {
        flex: 1,
        alignItems: 'center',
    },
    barContainer: {
        height: 100,
        width: 28,
        backgroundColor: theme.colors.primaryLight,
        borderRadius: theme.radius.sm,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    bar: {
        width: '100%',
        borderRadius: theme.radius.sm,
    },
    barValue: {
        fontSize: 11,
        color: theme.colors.textLight,
        marginBottom: 4,
        fontWeight: '600',
    },
    barLabel: {
        fontSize: 11,
        color: theme.colors.textLight,
        marginTop: 4,
        textTransform: 'capitalize',
    },
    barLabelToday: {
        color: theme.colors.secondary,
        fontWeight: 'bold',
    },
    todayDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.secondary,
        marginTop: 2,
    },
    habitStat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    habitStatName: {
        flex: 2,
        fontSize: 13,
        color: theme.colors.text,
    },
    habitStatBar: {
        flex: 3,
        height: 8,
        backgroundColor: theme.colors.primaryLight,
        borderRadius: theme.radius.full,
        marginHorizontal: theme.spacing.sm,
    },
    habitStatFill: {
        height: 8,
        borderRadius: theme.radius.full,
    },
    habitStatRate: {
        fontSize: 13,
        fontWeight: 'bold',
        width: 38,
        textAlign: 'right',
    },
    emptyText: {
        color: theme.colors.textLight,
        textAlign: 'center',
        fontSize: 14,
        paddingVertical: theme.spacing.md,
    },
});
