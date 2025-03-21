import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../theme';
import Animated, { FadeIn } from 'react-native-reanimated';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search jobs...',
  onSubmit,
  onClear,
}) => {
  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textMuted} />
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        {value.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => {
              onChangeText('');
              if (onClear) onClear();
            }}
          >
            <MaterialCommunityIcons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: typography.fontSizes.md,
    color: colors.text,
  },
  clearButton: {
    padding: spacing.xs,
  },
});

export default SearchBar;
