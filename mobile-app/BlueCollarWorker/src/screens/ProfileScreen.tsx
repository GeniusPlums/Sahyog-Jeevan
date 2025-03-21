import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, TextInput, Button, Avatar, Divider } from 'react-native-paper';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/api';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    location: '',
    contact: '',
    skills: '',
    experience: '',
    education: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (user) {
        const data = await profileService.getProfile(user.id);
        if (data) {
          setProfile({
            name: data.name || '',
            location: data.location || '',
            contact: data.contact || '',
            skills: data.skills || '',
            experience: data.experience || '',
            education: data.education || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If profile doesn't exist yet, that's okay - we'll create one when they save
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.contact) {
      Alert.alert('Error', 'Name and contact information are required');
      return;
    }

    try {
      setSaving(true);
      await profileService.createProfile(profile);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout() }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <Avatar.Text 
              size={80} 
              label={profile.name ? profile.name.substring(0, 2).toUpperCase() : user?.username?.substring(0, 2).toUpperCase() || 'U'} 
            />
            <Title style={styles.username}>{user?.username}</Title>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.form}>
            <TextInput
              label="Full Name"
              value={profile.name}
              onChangeText={(text) => setProfile({...profile, name: text})}
              style={styles.input}
              disabled={loading}
            />
            
            <TextInput
              label="Location"
              value={profile.location}
              onChangeText={(text) => setProfile({...profile, location: text})}
              style={styles.input}
              disabled={loading}
            />
            
            <TextInput
              label="Contact Number"
              value={profile.contact}
              onChangeText={(text) => setProfile({...profile, contact: text})}
              style={styles.input}
              keyboardType="phone-pad"
              disabled={loading}
            />
            
            <TextInput
              label="Skills"
              value={profile.skills}
              onChangeText={(text) => setProfile({...profile, skills: text})}
              style={styles.input}
              placeholder="e.g. Driving, Construction, Electrical work"
              disabled={loading}
            />
            
            <TextInput
              label="Work Experience"
              value={profile.experience}
              onChangeText={(text) => setProfile({...profile, experience: text})}
              style={styles.input}
              multiline
              numberOfLines={3}
              disabled={loading}
            />
            
            <TextInput
              label="Education"
              value={profile.education}
              onChangeText={(text) => setProfile({...profile, education: text})}
              style={styles.input}
              disabled={loading}
            />
            
            <Button 
              mode="contained" 
              onPress={handleSaveProfile} 
              style={styles.saveButton}
              loading={saving}
              disabled={loading || saving}
            >
              Save Profile
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      <Button 
        mode="outlined" 
        onPress={handleLogout} 
        style={styles.logoutButton}
        icon="logout"
      >
        Logout
      </Button>
      
      <Text style={styles.versionText}>Blue Collar Worker v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  username: {
    marginTop: 8,
    fontSize: 18,
  },
  divider: {
    marginVertical: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    marginTop: 8,
  },
  logoutButton: {
    marginBottom: 24,
  },
  versionText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 24,
  },
});

export default ProfileScreen;
