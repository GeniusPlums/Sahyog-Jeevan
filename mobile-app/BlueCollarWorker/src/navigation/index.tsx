import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../hooks/useAuth';
import { ActivityIndicator, View, Text, Button, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// Import screens
import {
  LoginScreen,
  RegisterScreen,
  JobsScreen,
  JobDetailsScreen,
  ApplicationsScreen,
  ProfileScreen,
  JobApplicationScreen
} from '../screens';

// Define navigation types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type JobsStackParamList = {
  Jobs: undefined;
  JobDetails: { jobId: number };
  JobApplication: { jobId: number };
};

export type ApplicationsStackParamList = {
  Applications: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const JobsStack = createStackNavigator<JobsStackParamList>();
const ApplicationsStack = createStackNavigator<ApplicationsStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const MainTab = createBottomTabNavigator();

// Auth navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Jobs stack navigator
const JobsStackNavigator = () => (
  <JobsStack.Navigator>
    <JobsStack.Screen name="Jobs" component={JobsScreen} />
    <JobsStack.Screen name="JobDetails" component={JobDetailsScreen} />
    <JobsStack.Screen name="JobApplication" component={JobApplicationScreen} />
  </JobsStack.Navigator>
);

// Applications stack navigator
const ApplicationsStackNavigator = () => (
  <ApplicationsStack.Navigator>
    <ApplicationsStack.Screen name="Applications" component={ApplicationsScreen} />
  </ApplicationsStack.Navigator>
);

// Profile stack navigator
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

// Main tab navigator
const MainNavigator = () => (
  <MainTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'JobsStack') {
          return <Feather name="briefcase" size={size} color={color} />;
        } else if (route.name === 'ApplicationsStack') {
          return <Feather name="file-text" size={size} color={color} />;
        } else if (route.name === 'ProfileStack') {
          return <Feather name="user" size={size} color={color} />;
        }
        return null;
      },
    })}
  >
    <MainTab.Screen 
      name="JobsStack" 
      component={JobsStackNavigator} 
      options={{ headerShown: false, title: 'Jobs' }} 
    />
    <MainTab.Screen 
      name="ApplicationsStack" 
      component={ApplicationsStackNavigator} 
      options={{ headerShown: false, title: 'Applications' }} 
    />
    <MainTab.Screen 
      name="ProfileStack" 
      component={ProfileStackNavigator} 
      options={{ headerShown: false, title: 'Profile' }} 
    />
  </MainTab.Navigator>
);

// Root navigator
const Navigation = () => {
  const { user, isLoading, retryConnection, useOfflineMode } = useAuth();

  if (isLoading) {
    return (
      <NavigationContainer>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Connecting to server...</Text>
          
          <View style={styles.retryContainer}>
            <Text style={styles.errorText}>
              Server connection is taking too long.
            </Text>
            <View style={styles.buttonContainer}>
              <Button 
                title="Retry Connection" 
                onPress={retryConnection} 
                color="#2196F3"
              />
            </View>
            
            <Text style={styles.orText}>OR</Text>
            
            <View style={styles.buttonContainer}>
              <Button 
                title="Use Offline Mode" 
                onPress={useOfflineMode} 
                color="#FF9800"
              />
            </View>
            
            <Text style={styles.helpText}>
              Offline mode provides limited functionality but lets you explore the app.
            </Text>
          </View>
        </View>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  retryContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#555',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 5,
  },
  orText: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  helpText: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 12,
    color: '#777',
  }
});

export default Navigation;
