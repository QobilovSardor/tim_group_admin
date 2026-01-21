import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SECURITY_CONFIG } from '@/config/constants';
import { toast } from 'sonner';

export const useIdleTimer = () => {
  const { logout, isAuthenticated } = useAuth();
  const timerRef = useRef<any>(null);
  const warningTimerRef = useRef<any>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);

    if (isAuthenticated) {
      // Set warning timer (30 seconds before logout)
      warningTimerRef.current = setTimeout(() => {
        toast.warning('Session will expire soon due to inactivity.', {
          duration: 10000,
          description: 'Move your mouse or press a key to stay logged in.',
        });
      }, SECURITY_CONFIG.IDLE_THRESHOLD - 30000);

      // Set logout timer
      timerRef.current = setTimeout(() => {
        logout();
        toast.error('Session expired due to inactivity.');
      }, SECURITY_CONFIG.IDLE_THRESHOLD);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    const handleActivity = () => {
      resetTimer();
    };

    if (isAuthenticated) {
      events.forEach((event) => window.addEventListener(event, handleActivity));
      resetTimer();
    }

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [isAuthenticated, resetTimer]);
};
