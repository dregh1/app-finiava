// src/components/app-tabs.web.tsx
import {
  TabList,
  TabListProps,
  Tabs,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
} from 'expo-router/ui';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export default function AppTabs() {
    return (
        <Tabs>
            <TabSlot style={{ height: '100%' }} />
            <TabList asChild>
                <CustomTabList>
                    <TabTrigger name="home" href="/" asChild>
                        <TabButton emoji="📋">Aujourd'hui</TabButton>
                    </TabTrigger>
                    <TabTrigger name="add" href="/add" asChild>
                        <TabButton emoji="➕">Ajouter</TabButton>
                    </TabTrigger>
                    <TabTrigger name="progress" href="/progress" asChild>
                        <TabButton emoji="📊">Progrès</TabButton>
                    </TabTrigger>
                </CustomTabList>
            </TabList>
        </Tabs>
    );
}

export function TabButton({
    children,
    emoji,
    isFocused,
    ...props
}: TabTriggerSlotProps & { emoji: string }) {
    return (
        <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView
                type={isFocused ? 'backgroundSelected' : 'backgroundElement'}
                style={styles.tabButtonView}
            >
                <Text style={styles.emoji}>{emoji}</Text>
                <ThemedText
                    type="small"
                    themeColor={isFocused ? 'text' : 'textSecondary'}
                >
                    {children}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}

export function CustomTabList(props: TabListProps) {
    const scheme = useColorScheme();
    const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

    return (
        <View {...props} style={styles.tabListContainer}>
            <ThemedView type="backgroundElement" style={styles.innerContainer}>

                {/* 🌱 Nom de l'app */}
                <ThemedText type="smallBold" style={styles.brandText}>
                    🌱 HabitTracker
                </ThemedText>

                {/* Onglets */}
                {props.children}

            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    tabListContainer: {
        position: 'absolute',
        width: '100%',
        padding: Spacing.three,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    innerContainer: {
        paddingVertical: Spacing.two,
        paddingHorizontal: Spacing.five,
        borderRadius: Spacing.five,
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        gap: Spacing.two,
        maxWidth: MaxContentWidth,
    },
    brandText: {
        marginRight: 'auto',
    },
    pressed: {
        opacity: 0.7,
    },
    tabButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.one,
        paddingVertical: Spacing.one,
        paddingHorizontal: Spacing.three,
        borderRadius: Spacing.three,
    },
    emoji: {
        fontSize: 14,
    },
});
