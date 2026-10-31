import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, VolunteerProfile, Role } from '../types';
import * as api from '../api';

interface AuthContextType {
  user: User | null;
  profile: VolunteerProfile | null;
  isLoading: boolean;
  signIn: (identifier: string, pass: string) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (roles: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUserData = useCallback(async (showLoading: boolean = false) => {
    if (showLoading) setIsLoading(true);
    try {
      const currentUser = await api.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const prof = await api.getProfile(currentUser.id);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData(true);
  }, [loadUserData]);

  const signIn = async (identifier: string, pass: string): Promise<User> => {
    setIsLoading(true);
    try {
      const loggedIn = await api.signIn(identifier, pass);
      setUser(loggedIn);
      const prof = await api.getProfile(loggedIn.id);
      setProfile(prof);
      return loggedIn;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await api.signOut();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await loadUserData();
  };

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user) return false;
    const required = Array.isArray(roles) ? roles : [roles];
    return required.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signOut,
        refreshUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
