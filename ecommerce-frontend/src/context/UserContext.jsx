import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase';

const db = getFirestore();

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        // Create default user data if it doesn't exist
        const defaultUserData = {
          name: '',
          email: '',
          address: {
            street: '',
            city: '',
            state: '',
            zip: '',
          },
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, defaultUserData);
        setUser(defaultUserData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, userData);
      setUser(prev => ({ ...prev, ...userData }));
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  };

  useEffect(() => {
    // Initialize user data when component mounts
    // This would typically be called when user logs in
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, getUserData, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
