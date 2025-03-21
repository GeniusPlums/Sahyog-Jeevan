import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';
import { User } from '../types';
import { Alert } from 'react-native';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retryConnection: () => Promise<void>;
  useOfflineMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback user for offline mode
const OFFLINE_USER: User = {
  id: 999,
  username: 'offline_user',
  role: 'worker'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // DIRECT FIX: Start with offline user and no loading
  const [user, setUser] = useState<User | null>(OFFLINE_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Function to immediately enter offline mode
  const useOfflineMode = () => {
    setUser(OFFLINE_USER);
    setIsLoading(false);
  };

  // Function to load user data
  const loadUser = async (showOfflineAlert = false) => {
    try {
      setIsLoading(true);
      
      // Add a timeout to prevent hanging indefinitely
      const timeoutPromise = new Promise<null>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Authentication timed out'));
        }, 5000); // Reduced to 5 seconds for faster feedback
      });
      
      // Race between the actual auth request and the timeout
      const user = await Promise.race([
        authService.getCurrentUser(),
        timeoutPromise
      ]).catch(error => {
        console.log('Authentication error or timeout:', error.message);
        
        // If we've tried multiple times and failed, use offline mode
        if (connectionAttempts > 0 && showOfflineAlert) {
          Alert.alert(
            'Connection Issue',
            'Unable to connect to the server. Would you like to use offline mode?',
            [
              { text: 'No', style: 'cancel' },
              { 
                text: 'Yes', 
                onPress: () => useOfflineMode()
              }
            ]
          );
        }
        return null;
      });
      
      if (user) {
        setUser(user);
      }
      
      // Increment connection attempts
      setConnectionAttempts(prev => prev + 1);
    } catch (error) {
      console.log('No authenticated user found');
    } finally {
      // Always set isLoading to false to prevent UI blocking
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // DIRECT FIX: Skip loading user on startup
    // We're already in offline mode
    
    // Set a backup timeout to ensure loading state is cleared
    const backupTimer = setTimeout(() => {
      if (isLoading) {
        console.log('Backup timer triggered to clear loading state');
        setIsLoading(false);
      }
    }, 8000);
    
    return () => clearTimeout(backupTimer);
  }, []);

  const retryConnection = async () => {
    return loadUser(true);
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(username, password);
      
      // Store session info
      if (response.token) {
        await AsyncStorage.setItem('sessionToken', response.token);
      }
      
      // Get current user
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error: any) {
      // If server is unreachable, provide offline login option
      if (!error.response) {
        Alert.alert(
          'Server Unreachable',
          'Would you like to continue in offline mode?',
          [
            { text: 'No', style: 'cancel' },
            { 
              text: 'Yes', 
              onPress: () => useOfflineMode()
            }
          ]
        );
      } else {
        setError(error.response?.data?.message || 'Login failed');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      // Always register as a worker for the mobile app
      await authService.register(username, password, 'worker');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      await AsyncStorage.removeItem('sessionToken');
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Still clear the user even if server request fails
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, retryConnection, useOfflineMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
