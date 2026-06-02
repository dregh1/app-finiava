// src/components/DatePickerInput.tsx
import { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../constants/theme';

let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
    DateTimePicker = require('@react-native-community/datetimepicker').default;
}

type Props = {
    label: string;
    value: string;
    onChange: (date: string) => void;
    minimumDate?: Date;
};

export default function DatePickerInput({ label, value, onChange, minimumDate }: Props) {

    const [show, setShow] = useState(false);

    const dateValue = value ? new Date(value) : new Date();

    const handleChange = (event: any, selected?: Date) => {
        setShow(Platform.OS === 'ios');
        if (event.type === 'dismissed') return;
        if (selected) {
            const formatted = selected.toLocaleDateString('fr-CA');
            onChange(formatted);
        }
    };

    // ✅ Version WEB
    if (Platform.OS === 'web') {
        return (
            <View style={styles.inputGroup}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.webInputWrapper}>
                    <TextInput
                        style={styles.webInput}
                        value={value}
                        onChangeText={onChange}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.colors.textLight}
                        // @ts-ignore — propriétés web uniquement
                        type="date"
                        min={
                            minimumDate
                                ? minimumDate.toLocaleDateString('fr-CA')
                                : undefined
                        }
                    />
                </View>
            </View>
        );
    }

    // ✅ Version iOS / Android
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={styles.mobileInput}
                onPress={() => setShow(true)}
                activeOpacity={0.7}
            >
                <Text style={value ? styles.dateText : styles.placeholder}>
                    {value || 'YYYY-MM-DD'}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>

            {show && DateTimePicker && (
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    minimumDate={minimumDate}
                    locale="fr-FR"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },

    // ── Web ──────────────────────────────────────────
    webInputWrapper: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.md,
        ...theme.shadow,
    },
    // ✅ Retiré outlineStyle et cursor du StyleSheet
    webInput: {
        fontSize: 15,
        color: theme.colors.text,
    },

    // ── Mobile ───────────────────────────────────────
    mobileInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        height: 50,
        ...theme.shadow,
    },
    dateText: {
        fontSize: 15,
        color: theme.colors.text,
    },
    placeholder: {
        fontSize: 15,
        color: theme.colors.textLight,
    },
    calendarIcon: {
        fontSize: 18,
    },
});

// ✅ Styles web injectés séparément via un <style> global
// À ajouter dans ton index.html ou App.tsx si le outline bleu gêne :
// input[type="date"] { outline: none; cursor: pointer; border: none; }
