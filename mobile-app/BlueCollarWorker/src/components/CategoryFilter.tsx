import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category, index) => {
          const isSelected = category === selectedCategory;
          const icon = getCategoryIcon(category);
          
          return (
            <Animated.View
              key={category}
              entering={FadeInRight.delay(index * 50)}
              exiting={FadeOutLeft}
            >
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  isSelected ? styles.selectedCategory : styles.unselectedCategory,
                ]}
                onPress={() => onSelectCategory(category)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name={icon as any} 
                  size={16} 
                  color={isSelected ? 'white' : colors.primary} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    isSelected ? styles.selectedCategoryText : styles.unselectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const getCategoryIcon = (category: string): string => {
  const categoryIcons: Record<string, string> = {
    'All': 'view-grid',
    'Driver': 'car',
    'Construction': 'hammer',
    'Security': 'shield-account',
    'Cleaning': 'broom',
    'Factory': 'factory',
    'Retail': 'store',
    'Hospitality': 'food-fork-drink',
    'Other': 'dots-horizontal',
  };
  
  return categoryIcons[category] || 'briefcase-outline';
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unselectedCategory: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  categoryText: {
    marginLeft: spacing.xs,
    fontSize: typography.fontSizes.sm,
    fontWeight: '500' as const,
  },
  selectedCategoryText: {
    color: 'white',
  },
  unselectedCategoryText: {
    color: colors.text,
  },
});

export default CategoryFilter;
