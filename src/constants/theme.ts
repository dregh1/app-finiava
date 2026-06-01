/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// src/constants/theme.ts
export const theme = {
    colors: {
        primary:        '#6C63FF',
        primaryLight:   '#F0EEFF',
        primaryDark:    '#4B44CC',
        secondary:      '#FF6B35',
        success:        '#4CAF50',
        warning:        '#FFC107',
        background:     '#F8F9FA',
        card:           '#FFFFFF',
        text:           '#2D2D2D',
        textLight:      '#9E9E9E',
        border:         '#E0E0E0',
    },
    spacing: {
        xs:  4,
        sm:  8,
        md:  16,
        lg:  24,
        xl:  32,
    },
    radius: {
        sm:  8,
        md:  12,
        lg:  16,
        xl:  24,
        full: 999,
    },
    shadow: {
        shadowColor:   '#6C63FF',
        shadowOffset:  { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius:  8,
        elevation:     5,
    },
};


export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
