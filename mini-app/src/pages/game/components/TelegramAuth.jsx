import { useEffect, useState } from 'react';

export default function TelegramAuth({ onAuth }) {
  const [telegramUser, setTelegramUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegramAuth = () => {
      // Check if we're running inside Telegram
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Expand to full screen
        tg.ready();
        tg.expand();
        
        // Enable closing confirmation
        tg.enableClosingConfirmation();
        
        // Setup back button
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
          tg.close();
        });
        
        // Get user data
        const user = tg.initDataUnsafe?.user;
        
        if (user) {
          const userData = {
            id: user.id,
            username: user.username || user.first_name,
            first_name: user.first_name,
            last_name: user.last_name,
            photo_url: user.photo_url,
            auth_date: tg.initDataUnsafe?.auth_date,
            hash: tg.initDataUnsafe?.hash,
            is_telegram: true
          };
          
          setTelegramUser(userData);
          onAuth?.(userData);
          
          // Apply theme colors
          document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
          document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
        } else {
          // Not a Telegram user - use demo mode
          setTelegramUser({ is_demo: true });
          onAuth?.({ is_demo: true });
        }
      } else {
        // Running outside Telegram - demo mode
        setTelegramUser({ is_demo: true });
        onAuth?.({ is_demo: true });
      }
    };

    initTelegramAuth();
  }, [onAuth]);

  // Signal theme changes
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      const onThemeChange = () => {
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
      };
      
      tg.onEvent('themeChanged', onThemeChange);
      
      return () => {
        tg.offEvent('themeChanged', onThemeChange);
      };
    }
  }, []);

  return null; // Silent component - just handles auth
}

// Hook for Telegram WebApp data
export function useTelegram() {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webapp = window.Telegram.WebApp;
      setTg(webapp);
      setUser(webapp.initDataUnsafe?.user || null);
    }
  }, []);

  const showPopup = async (options) => {
    if (tg) {
      return new Promise((resolve) => {
        tg.showConfirm(options.message, (confirmed) => resolve(confirmed));
      });
    }
    return window.confirm(options.message);
  };

  const showAlert = async (message) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      window.alert(message);
    }
  };

  const hapticFeedback = (type = 'light') => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred(type);
    }
  };

  return {
    tg,
    user,
    showPopup,
    showAlert,
    hapticFeedback,
    isTelegram: !!window.Telegram?.WebApp
  };
}
