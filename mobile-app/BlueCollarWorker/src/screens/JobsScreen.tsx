import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { JobsStackParamList } from '../navigation';
import { jobService } from '../services/api';
import { Job } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '../theme';
import Animated, { FadeIn } from 'react-native-reanimated';

// Import our custom components
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import Button from '../components/Button';
import FilterSheet from '../components/FilterSheet';

type JobsScreenNavigationProp = StackNavigationProp<JobsStackParamList, 'Jobs'>;

const CATEGORIES = [
  'All',
  'Driver',
  'Construction',
  'Security',
  'Cleaning',
  'Factory',
  'Retail',
  'Hospitality',
  'Other'
];

const LOCATIONS = ['mumbai', 'delhi', 'bangalore', 'hyderabad', 'chennai'];
const JOB_TYPES = ['Full Time', 'Part Time', 'Gig'];
const SHIFTS = ['day', 'night', 'flexible'];

const JobsScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    shift: 'all',
  });
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  
  const navigation = useNavigation<JobsScreenNavigationProp>();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getAllJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  useEffect(() => {
    filterJobs();
  }, [searchQuery, selectedCategory, filters, sortBy, jobs]);

  const filterJobs = () => {
    let filtered = [...jobs];

    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }

    // Apply advanced filters
    if (filters.type !== 'all') {
      filtered = filtered.filter(job => job.type.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.location !== 'all') {
      filtered = filtered.filter(job => job.location.toLowerCase() === filters.location.toLowerCase());
    }

    if (filters.shift !== 'all') {
      filtered = filtered.filter(job => job.shift?.toLowerCase() === filters.shift.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortBy === 'recent' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    });

    setFilteredJobs(filtered);
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleJobPress = (jobId: number) => {
    navigation.navigate('JobDetails', { jobId });
  };

  const handleApplyFilters = (newFilters: Record<string, string>) => {
    setFilters(newFilters as typeof filters);
    setFilterSheetVisible(false);
  };

  const toggleSortOrder = () => {
    setSortBy(sortBy === 'recent' ? 'oldest' : 'recent');
  };

  const filterGroups = [
    {
      id: 'type',
      title: 'Job Type',
      options: [
        { id: 'all', label: 'All Types', icon: 'briefcase-outline' },
        ...JOB_TYPES.map(type => ({
          id: type.toLowerCase(),
          label: type,
          icon: type === 'Full Time' ? 'calendar-clock' : type === 'Part Time' ? 'calendar-check' : 'calendar-sync',
        })),
      ],
    },
    {
      id: 'location',
      title: 'Location',
      options: [
        { id: 'all', label: 'All Locations', icon: 'map-marker-radius' },
        ...LOCATIONS.map(location => ({
          id: location.toLowerCase(),
          label: location.charAt(0).toUpperCase() + location.slice(1),
          icon: 'map-marker',
        })),
      ],
    },
    {
      id: 'shift',
      title: 'Shift',
      options: [
        { id: 'all', label: 'All Shifts', icon: 'clock-outline' },
        ...SHIFTS.map(shift => ({
          id: shift.toLowerCase(),
          label: shift.charAt(0).toUpperCase() + shift.slice(1),
          icon: shift === 'day' ? 'weather-sunny' : shift === 'night' ? 'weather-night' : 'sync',
        })),
      ],
    },
  ];

  const renderJobItem = ({ item, index }: { item: Job; index: number }) => (
    <JobCard job={item} onPress={handleJobPress} index={index} />
  );

  const renderEmptyList = () => (
    <Animated.View 
      entering={FadeIn.delay(300)}
      style={styles.emptyContainer}
    >
      <MaterialCommunityIcons name="file-search-outline" size={64} color={colors.secondaryLight} />
      <Text style={styles.emptyText}>No jobs found</Text>
      <Text style={styles.emptySubtext}>Try a different search or filter</Text>
      <Button 
        title="Clear Filters" 
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('All');
          setFilters({ type: 'all', location: 'all', shift: 'all' });
        }}
        variant="outline"
        size="md"
        icon={<MaterialCommunityIcons name="filter-remove" size={18} color={colors.primary} />}
      />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search jobs..."
          />
          
          <View style={styles.actionButtons}>
            <Button 
              title=""
              onPress={toggleSortOrder}
              variant="outline"
              size="md"
              icon={
                <MaterialCommunityIcons 
                  name={sortBy === 'recent' ? 'sort-calendar-descending' : 'sort-calendar-ascending'} 
                  size={20} 
                  color={colors.primary} 
                />
              }
            />
            
            <Button 
              title=""
              onPress={() => setFilterSheetVisible(true)}
              variant="outline"
              size="md"
              icon={<MaterialCommunityIcons name="filter-variant" size={20} color={colors.primary} />}
            />
          </View>
        </View>
        
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryPress}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            title="Retry" 
            onPress={fetchJobs} 
            variant="primary"
            size="md"
            icon={<MaterialCommunityIcons name="refresh" size={18} color="white" />}
          />
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.jobsList, filteredJobs.length === 0 && styles.emptyList]}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      <FilterSheet 
        visible={filterSheetVisible}
        onDismiss={() => setFilterSheetVisible(false)}
        filterGroups={filterGroups}
        selectedFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
    ...shadows.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  jobsList: {
    padding: spacing.md,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: spacing.md,
  },
  emptySubtext: {
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default JobsScreen;
