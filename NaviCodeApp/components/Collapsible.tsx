import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@emotion/react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import type { AppTheme } from '@/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export function Collapsible({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const appTheme = useTheme() as AppTheme;
  const styles = useStyles(appTheme);

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={
            colorScheme === 'light'
              ? appTheme.colors.iconLight
              : appTheme.colors.iconDark
          }
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

function useStyles(theme: AppTheme) {
  return StyleSheet.create({
    heading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.spacing2,
    },
    content: {
      marginTop: theme.spacing.spacing2,
      marginLeft: theme.spacing.spacing6,
    },
  });
}
