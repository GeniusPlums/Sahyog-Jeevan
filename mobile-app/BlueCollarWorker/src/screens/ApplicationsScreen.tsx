import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { applicationService } from '../services/api';
import { Application } from '../types';

const ApplicationsScreen = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationService.getWorkerApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'pending':
      default:
        return '#FFC107';
    }
  };

  const renderApplicationItem = ({ item }: { item: Application }) => (
    <Card style={styles.applicationCard}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.job?.title || 'Job Title'}</Title>
          <Chip 
            mode="flat" 
            style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Chip>
        </View>
        
        <Paragraph style={styles.companyName}>
          {item.job?.companyName || 'Company'}
        </Paragraph>
        
        <View style={styles.detailsRow}>
          <Chip icon="map-marker" style={styles.detailChip}>
            {item.job?.location || 'Location'}
          </Chip>
          <Chip icon="calendar" style={styles.detailChip}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Chip>
        </View>
        
        {item.job?.type && (
          <Chip icon="briefcase" style={styles.jobTypeChip}>
            {item.job.type}
          </Chip>
        )}
      </Card.Content>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading your applications...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchApplications} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {applications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't applied to any jobs yet.</Text>
          <Text style={styles.emptySubtext}>When you apply for jobs, they will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderApplicationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.applicationsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  applicationCard: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    height: 28,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailChip: {
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  jobTypeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
  },
  applicationsList: {
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ApplicationsScreen;
