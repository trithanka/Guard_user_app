/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Color scheme
export const AppColors = {
  mainBackground: '#12122A', // Deep Black/Navy Blue
  primaryText: '#E0E7FF', // Glowing White/Silver
  accentGlow: '#33CCFF', // Electric Cyan/Blue
  inputBackground: '#1C1C35', // Slightly Lighter Dark Gray/Blue
  actionButton: '#00A3FF', // Bright Solid Blue
};

const tintColorLight = AppColors.actionButton;
const tintColorDark = AppColors.primaryText;

export const Colors = {
  light: {
    text: AppColors.primaryText,
    background: AppColors.mainBackground,
    tint: tintColorLight,
    icon: AppColors.primaryText,
    tabIconDefault: AppColors.primaryText,
    tabIconSelected: AppColors.accentGlow,
    inputBackground: AppColors.inputBackground,
    actionButton: AppColors.actionButton,
  },
  dark: {
    text: AppColors.primaryText,
    background: AppColors.mainBackground,
    tint: tintColorDark,
    icon: AppColors.primaryText,
    tabIconDefault: AppColors.primaryText,
    tabIconSelected: AppColors.accentGlow,
    inputBackground: AppColors.inputBackground,
    actionButton: AppColors.actionButton,
  },
};

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
