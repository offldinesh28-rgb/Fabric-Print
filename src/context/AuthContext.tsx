import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password?: string) => { user: User; isAdmin: boolean };
  register: (name: string, phone: string, email: string, password?: string) => User;
  logout: () => void;
  toggleAdminMode: () => void;
  saveAddress: (address: Omit<Address, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('texprint_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged in as Aditi
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('texprint_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('texprint_user');
    }
  }, [currentUser]);

  const login = (email: string, _password?: string) => {
    let userToSet: User;
    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@fabricprint.in') {
      userToSet = INITIAL_USERS[1];
    } else {
      const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        userToSet = found;
      } else {
        userToSet = {
          id: `usr-${Date.now()}`,
          name: email.split('@')[0],
          email,
          role: 'user',
          addresses: [],
          createdAt: new Date().toISOString()
        };
      }
    }
    setCurrentUser(userToSet);
    return { user: userToSet, isAdmin: userToSet.role === 'admin' };
  };

  const register = (name: string, phone: string, email: string, _password?: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'user',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleAdminMode = () => {
    if (currentUser?.role === 'admin') {
      setCurrentUser(INITIAL_USERS[0]); // Switch to user
    } else {
      setCurrentUser(INITIAL_USERS[1]); // Switch to admin
    }
  };

  const saveAddress = (addressData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddress: Address = {
      ...addressData,
      id: `addr-${Date.now()}`
    };
    const updatedUser: User = {
      ...currentUser,
      addresses: [...currentUser.addresses, newAddress]
    };
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        login,
        register,
        logout,
        toggleAdminMode,
        saveAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
