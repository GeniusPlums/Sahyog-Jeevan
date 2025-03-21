import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { JobsStackParamList } from '../navigation';
import { jobService } from '../services/api';
import { Job } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../theme';
import Button from '../components/Button';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type JobDetailsScreenRouteProp = RouteProp<JobsStackParamList, 'JobDetails'>;
type JobDetailsScreenNavigationProp = StackNavigationProp<JobsStackParamList, 'JobDetails'>;

type Props = {
  route: JobDetailsScreenRouteProp;
  navigation: JobDetailsScreenNavigationProp;
};

const JobDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobById(jobId);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (job) {
      navigation.navigate('JobApplication', { jobId: job.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !job) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error} />
        <Text style={styles.errorText}>{error || 'Job not found'}</Text>
        <Button 
          title="Go Back" 
          onPress={() => navigation.goBack()} 
          variant="primary"
          size="md"
          icon={<MaterialCommunityIcons name="arrow-left" size={18} color="white" />}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section with Company Logo */}
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.headerSection}
        >
          {job.companyLogo ? (
            <Image 
              source={{ uri: job.companyLogo }} 
              style={styles.companyLogo} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <MaterialCommunityIcons name="office-building" size={40} color={colors.primary} />
            </View>
          )}
          
          <View style={styles.headerContent}>
            <Text style={styles.companyName}>{job.companyName || 'Company'}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, job.status === 'open' ? styles.openStatus : styles.closedStatus]}>
                <Text style={styles.statusText}>{job.status || 'Open'}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Job Title and Basic Info */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.titleSection}
        >
          <Text style={styles.jobTitle}>{job.title}</Text>
          
          <View style={styles.metaInfoContainer}>
            <View style={styles.metaInfoItem}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="map-marker" size={18} color={colors.primary} />
              </View>
              <Text style={styles.metaInfoText}>{job.location}</Text>
            </View>
            
            <View style={styles.metaInfoItem}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="briefcase-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.metaInfoText}>{job.type}</Text>
            </View>
            
            <View style={styles.metaInfoItem}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="currency-inr" size={18} color={colors.primary} />
              </View>
              <Text style={styles.metaInfoText}>₹{job.salary}/month</Text>
            </View>
            
            {job.shift && (
              <View style={styles.metaInfoItem}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name={job.shift.toLowerCase() === 'day' ? 'weather-sunny' : 'weather-night'} 
                    size={18} 
                    color={colors.primary} 
                  />
                </View>
                <Text style={styles.metaInfoText}>{job.shift} Shift</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Job Description */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.sectionContainer}
        >
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </Animated.View>

        {/* Job Requirements */}
        {job.requirements && (
          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.sectionContainer}
          >
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Text style={styles.descriptionText}>{job.requirements}</Text>
          </Animated.View>
        )}

        {/* Additional Information */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.sectionContainer}
        >
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{job.category || 'General'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>{job.experience || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoValue}>{job.education || 'Not specified'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Posted On</Text>
              <Text style={styles.infoValue}>
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Apply Button */}
      <Animated.View 
        entering={FadeInDown.delay(500).duration(500)}
        style={styles.applyButtonContainer}
      >
        {job.applied ? (
          <View style={styles.appliedContainer}>
            <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
            <Text style={styles.appliedText}>Already Applied</Text>
          </View>
        ) : (
          <Button 
            title="Apply Now" 
            onPress={handleApply} 
            variant="primary"
            size="lg"
            fullWidth
            icon={<MaterialCommunityIcons name="send" size={18} color="white" />}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg, // Extra padding for the apply button
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  companyLogo: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  logoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  companyName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  openStatus: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  closedStatus: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: '500',
    color: colors.success,
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  jobTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  metaInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  metaInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  metaInfoText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
  },
  sectionContainer: {
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: typography.fontSizes.md,
    lineHeight: 22,
    color: colors.textMuted,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  infoItem: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  infoLabel: {
    fontSize: typography.fontSizes.sm,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
  },
  applyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.lg,
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  appliedText: {
    marginLeft: spacing.sm,
    fontSize: typography.fontSizes.md,
    fontWeight: '500',
    color: colors.success,
  },
});

export default JobDetailsScreen;
