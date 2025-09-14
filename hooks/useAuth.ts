import { useEffect, useState } from 'react';
import { auth } from '@/firebase-config';
import { onAuthStateChanged, User, reload } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          await reload(currentUser);
        }
        setUser(currentUser);
      } catch (err) {
        console.error("Auth listener error:", err);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};