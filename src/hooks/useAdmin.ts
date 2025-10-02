import { useState, useEffect } from 'react';
import { laravelApi } from '@/integrations/laravel/client';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('laravel_token');
      if (token) {
        try {
          const response = await laravelApi.getCurrentUser();
          if (response && response.id) {
            setUser(response);
            setIsAdmin(response.role === 'admin');
          } else {
            localStorage.removeItem('laravel_token');
            setUser(null);
            setIsAdmin(false);
          }
        } catch (error) {
          localStorage.removeItem('laravel_token');
          setUser(null);
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  return { isAdmin, user, loading };
};
