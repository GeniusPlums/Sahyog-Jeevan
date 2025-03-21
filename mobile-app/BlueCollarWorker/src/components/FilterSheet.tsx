import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme';
import Button from './Button';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

type FilterOption = {
  id: string;
  label: string;
  icon?: string;
};

type FilterGroup = {
  id: string;
  title: string;
  options: FilterOption[];
};

type FilterSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string>;
  onApplyFilters: (filters: Record<string, string>) => void;
};

const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onDismiss,
  filterGroups,
  selectedFilters,
  onApplyFilters,
}) => {
  const [tempFilters, setTempFilters] = useState<Record<string, string>>(selectedFilters);

  const handleSelectOption = (groupId: string, optionId: string) => {
    setTempFilters(prev => ({
      ...prev,
      [groupId]: optionId,
    }));
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    onDismiss();
  };

  const handleReset = () => {
    const resetFilters: Record<string, string> = {};
    filterGroups.forEach(group => {
      resetFilters[group.id] = 'all';
    });
    setTempFilters(resetFilters);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <Animated.View 
          entering={SlideInUp.springify()}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {filterGroups.map((group, groupIndex) => (
              <Animated.View 
                key={group.id}
                entering={FadeIn.delay(groupIndex * 100)}
                style={styles.filterGroup}
              >
                <Text style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.optionsGrid}>
                  {group.options.map((option) => {
                    const isSelected = tempFilters[group.id] === option.id;
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionButton,
                          isSelected ? styles.selectedOption : styles.unselectedOption,
                        ]}
                        onPress={() => handleSelectOption(group.id, option.id)}
                      >
                        {option.icon && (
                          <MaterialCommunityIcons
                            name={option.icon as any}
                            size={18}
                            color={isSelected ? 'white' : colors.primary}
                            style={styles.optionIcon}
                          />
                        )}
                        <Text 
                          style={[
                            styles.optionLabel,
                            isSelected ? styles.selectedOptionText : styles.unselectedOptionText,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Animated.View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Button 
              title="Reset"
              onPress={handleReset}
              variant="outline"
              size="md"
            />
            <Button 
              title="Apply Filters"
              onPress={handleApply}
              variant="primary"
              size="md"
            />
          </View>
        </Animated.View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: 'bold' as const,
    color: colors.text,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.lg,
  },
  filterGroup: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    minWidth: '45%',
  },
  selectedOption: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unselectedOption: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  optionIcon: {
    marginRight: spacing.xs,
  },
  optionLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '500' as const,
  },
  selectedOptionText: {
    color: 'white',
  },
  unselectedOptionText: {
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
});

export default FilterSheet;
