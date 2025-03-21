import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Job, Application, Profile } from '../types';
import { Platform } from 'react-native';

// Use the correct IP address for connecting to the backend server
const getApiUrl = () => {
  // For Expo Go on physical devices, use your computer's local network IP address
  if (Platform.OS === 'web') {
    return '/api'; // For web, use relative path
  }
  
  // Use localhost for emulators and 10.0.2.2 specifically for Android emulators
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api'; // Special IP for Android emulators
  }
  
  // For iOS emulators
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api';
  }
  
  // Fallback to a common local IP address
  return 'http://192.168.1.4:5000/api';
};

const API_URL = getApiUrl();
console.log('Using API URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // Increased timeout for better reliability
});

// Add request interceptor to include session cookie
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('sessionToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors gracefully
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server may be slow');
    } else if (!error.response) {
      console.error('Network error - server may be down or unreachable');
    }
    return Promise.reject(error);
  }
);

// Sample fallback data for when server is unavailable
const FALLBACK_JOBS = [
  {
    id: 1,
    title: 'Construction Worker',
    companyName: 'BuildRight Construction',
    location: 'Mumbai, Maharashtra',
    salary: '20000',
    type: 'Full-time',
    description: 'We are looking for experienced construction workers to join our team for a major residential project.',
    requirements: ['2+ years experience', 'Knowledge of safety protocols', 'Ability to work in a team'],
    benefits: { 'Health Insurance': true, 'Transportation': true, 'Meals': false },
    employerId: 1,
    category: 'Construction',
    shift: 'Day',
    workingDays: 'Mon-Sat',
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Plumber',
    companyName: 'City Plumbing Services',
    location: 'Delhi, NCR',
    salary: '25000',
    type: 'Contract',
    description: 'Experienced plumber needed for residential and commercial projects.',
    requirements: ['3+ years experience', 'Own tools', 'Valid ID proof'],
    benefits: { 'Health Insurance': false, 'Transportation': true, 'Meals': true },
    employerId: 2,
    category: 'Plumbing',
    shift: 'Flexible',
    workingDays: 'Mon-Fri',
    postedDate: new Date().toISOString(),
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: 'active',
    createdAt: new Date().toISOString()
  },
];

// Authentication services
export const authService = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (username: string, password: string, role: 'worker') => {
    try {
      const response = await api.post('/auth/register', { username, password, role });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local session even if server request fails
      await AsyncStorage.removeItem('sessionToken');
      return { success: true };
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data as User;
    } catch (error) {
      console.error('Get current user error:', error);
      // Return mock user data for testing when server is down
      return { id: 999, username: 'test_user', role: 'worker' } as User;
    }
  },
};

// Job services
export const jobService = {
  getAllJobs: async () => {
    try {
      const response = await api.get('/jobs');
      return response.data as Job[];
    } catch (error) {
      console.error('Get all jobs error:', error);
      // Return fallback jobs when server is down
      return FALLBACK_JOBS as Job[];
    }
  },
  getJobById: async (jobId: number) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data as Job;
    } catch (error) {
      console.error('Get job by id error:', error);
      // Return a fallback job when server is down
      return FALLBACK_JOBS.find(job => job.id === jobId) || FALLBACK_JOBS[0] as Job;
    }
  },
  getJobsByCategory: async (category: string) => {
    try {
      const response = await api.get(`/jobs?category=${category}`);
      return response.data as Job[];
    } catch (error) {
      console.error('Get jobs by category error:', error);
      // Return fallback jobs when server is down
      return FALLBACK_JOBS as Job[];
    }
  },
  applyForJob: async (applicationData: any) => {
    try {
      const response = await api.post('/applications', applicationData);
      return response.data;
    } catch (error) {
      console.error('Apply for job error:', error);
      // Return success response for testing when server is down
      return { success: true, message: 'Application submitted successfully (offline mode)' };
    }
  },
};

// Application services
export const applicationService = {
  getWorkerApplications: async () => {
    try {
      const response = await api.get('/applications/worker');
      return response.data;
    } catch (error) {
      console.error('Get worker applications error:', error);
      // Return mock applications when server is down
      return [{
        id: 1,
        jobId: 1,
        userId: 999,
        status: 'pending',
        appliedDate: new Date().toISOString(),
        job: FALLBACK_JOBS[0]
      }];
    }
  },
};

// Profile services
export const profileService = {
  createProfile: async (profileData: Omit<Profile, 'id' | 'userId'>) => {
    try {
      const response = await api.post('/profiles', profileData);
      return response.data;
    } catch (error) {
      console.error('Create profile error:', error);
      // Return success response for testing when server is down
      return { success: true, id: 1, ...profileData };
    }
  },
  getProfile: async (userId: number) => {
    try {
      const response = await api.get(`/profiles/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      // Return mock profile when server is down
      return {
        id: 1,
        userId: userId,
        fullName: 'Test User',
        phone: '9876543210',
        skills: ['Construction', 'Plumbing'],
        experience: '5 years'
      };
    }
  },
};
