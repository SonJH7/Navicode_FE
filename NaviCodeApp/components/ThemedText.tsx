import { Text, type TextProps } from 'react-native';
import { useTheme } from '@emotion/react';

import { useThemeColor } from '@/hooks/useThemeColor';
import type { AppTheme } from '@/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme() as AppTheme;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const variantStyle = (() => {
    switch (type) {
      case 'title':
        return theme.typography.title1Bold;
      case 'defaultSemiBold':
        return theme.typography.body1Bold;
      case 'subtitle':
        return theme.typography.subtitle1Bold;
      case 'link':
        return [theme.typography.body1Regular, { color: theme.colors.link }];
      default:
        return theme.typography.body1Regular;
    }
  })();

  return <Text style={[{ color }, variantStyle, style]} {...rest} />;
}
