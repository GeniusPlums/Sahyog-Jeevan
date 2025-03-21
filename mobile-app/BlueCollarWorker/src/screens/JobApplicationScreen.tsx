import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { JobsStackParamList } from '../navigation';
import { jobService } from '../services/api';
import { Job } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../theme';
import Button from '../components/Button';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

type JobApplicationScreenRouteProp = RouteProp<JobsStackParamList, 'JobApplication'>;
type JobApplicationScreenNavigationProp = StackNavigationProp<JobsStackParamList, 'JobApplication'>;

type Props = {
  route: JobApplicationScreenRouteProp;
  navigation: JobApplicationScreenNavigationProp;
};

const JobApplicationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');

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

  const handleSubmit = async () => {
    // Basic validation
    if (!name.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      // Call API to submit application
      await jobService.applyForJob({
        jobId,
        name,
        phone,
        email,
        experience,
        message
      });
      
      // Show success message
      Alert.alert(
        'Application Submitted',
        'Your job application has been submitted successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('Jobs')
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeIn.duration(500)}
          style={styles.header}
        >
          <Text style={styles.title}>Apply for Job</Text>
          <Text style={styles.subtitle}>{job.title} at {job.companyName}</Text>
        </Animated.View>

        {/* Application Form */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.formContainer}
        >
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput
            label="Full Name *"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="account" />}
          />
          
          <TextInput
            label="Phone Number *"
            value={phone}
            onChangeText={setPhone}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="phone" />}
          />
          
          <TextInput
            label="Email Address *"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="email" />}
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.formContainer}
        >
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <TextInput
            label="Years of Experience"
            value={experience}
            onChangeText={setExperience}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="briefcase" />}
          />
          
          <TextInput
            label="Cover Message"
            value={message}
            onChangeText={setMessage}
            mode="outlined"
            style={styles.textArea}
            multiline
            numberOfLines={4}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="text-box" />}
          />
        </Animated.View>

        {/* Submit Button */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.buttonContainer}
        >
          <Button 
            title="Submit Application" 
            onPress={handleSubmit} 
            variant="primary"
            size="lg"
            fullWidth
            loading={submitting}
            disabled={submitting}
            icon={<MaterialCommunityIcons name="send" size={18} color="white" />}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: 'bold' as const,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSizes.md,
    color: colors.textMuted,
  },
  formContainer: {
    marginBottom: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: '600' as const,
    color: colors.text,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
    backgroundColor: colors.inputBackground,
  },
  textArea: {
    marginBottom: spacing.md,
    backgroundColor: colors.inputBackground,
    minHeight: 100,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});

export default JobApplicationScreen;
