// src/navigation/AppNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../constants/theme';
import AddHabitScreen from '../screens/AddHabitScreen';
import DailyHabitsScreen from '../screens/DailyHabitsScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Tab = createBottomTabNavigator();

// ✅ Icône personnalisée
const TabIcon = ({
    emoji,
    label,
    focused,
}: {
    emoji: string;
    label: string;
    focused: boolean;
}) => (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        <Text style={styles.tabEmoji}>{emoji}</Text>
        <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
            {label}
        </Text>
    </View>
);

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarStyle: styles.tabBar,
                }}
            >
                <Tab.Screen
                    name="Aujourd'hui"
                    component={DailyHabitsScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon emoji="📋" label="Aujourd'hui" focused={focused} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Ajouter"
                    component={AddHabitScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon emoji="➕" label="Ajouter" focused={focused} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Progrès"
                    component={ProgressScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <TabIcon emoji="📊" label="Progrès" focused={focused} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: theme.colors.card,
        borderTopWidth: 0,
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        ...theme.shadow,
    },
    tabIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radius.full,
    },
    tabIconFocused: {
        backgroundColor: theme.colors.primaryLight,
    },
    tabEmoji: {
        fontSize: 20,
    },
    tabLabel: {
        fontSize: 10,
        color: theme.colors.textLight,
        marginTop: 2,
    },
    tabLabelFocused: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
});
