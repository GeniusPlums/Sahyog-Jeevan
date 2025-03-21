import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Surface, Badge, useTheme } from 'react-native-paper';
import { Job } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../theme';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type JobCardProps = {
  job: Job;
  onPress: (jobId: number) => void;
  index?: number;
};

const JobCard: React.FC<JobCardProps> = ({ job, onPress, index = 0 }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.container, animatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onPress(job.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}
      >
        <Surface style={styles.card}>
          <View style={styles.cardContent}>
            <View style={styles.headerSection}>
              {job.companyLogo ? (
                <View style={styles.logoContainer}>
                  <Image 
                    source={{ uri: job.companyLogo }} 
                    style={styles.logo} 
                    resizeMode="cover"
                  />
                </View>
              ) : (
                <View style={styles.logoPlaceholder}>
                  <MaterialCommunityIcons name="office-building" size={24} color={colors.primary} />
                </View>
              )}
              
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
                <Badge style={[styles.statusBadge, job.status === 'open' ? styles.openBadge : styles.closedBadge]}>
                  {job.status || 'Open'}
                </Badge>
              </View>
            </View>

            <View style={styles.metaSection}>
              <View style={styles.metaItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="office-building" size={16} color={colors.primary} />
                </View>
                <Text style={styles.metaText}>{job.companyName || 'Company'}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="map-marker" size={16} color={colors.primary} />
                </View>
                <Text style={styles.metaText} numberOfLines={1}>{job.location}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={colors.primary} />
                </View>
                <Text style={styles.metaText}>{job.type}</Text>
              </View>
              
              <View style={styles.metaItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name="currency-inr" size={16} color={colors.primary} />
                </View>
                <Text style={styles.metaText}>₹{job.salary}/month</Text>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text numberOfLines={2} style={styles.description}>
                {job.description}
              </Text>
            </View>

            <View style={styles.footer}>
              {job.applied ? (
                <View style={styles.appliedContainer}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.success} />
                  <Text style={styles.appliedText}>Applied</Text>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={() => onPress(job.id)}
                >
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  touchable: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.card,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardContent: {
    padding: spacing.md,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    backgroundColor: colors.primaryLight,
    marginRight: spacing.md,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
  },
  openBadge: {
    backgroundColor: colors.primary,
  },
  closedBadge: {
    backgroundColor: colors.secondary,
  },
  metaSection: {
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  metaText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
  },
  descriptionContainer: {
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  appliedText: {
    fontSize: typography.fontSizes.sm,
    color: colors.success,
    fontWeight: '500' as const,
    marginLeft: spacing.xs,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '500' as const,
    fontSize: typography.fontSizes.sm,
  },
});

export default JobCard;
