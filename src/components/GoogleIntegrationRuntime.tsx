import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  initializeGoogleIntegrations,
  trackPageView
} from '../integrations/google';

export const GoogleIntegrationRuntime = () => {
  const location = useLocation();

  useEffect(() => {
    initializeGoogleIntegrations();
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      trackPageView({
        path: `${location.pathname}${location.search}${location.hash}`,
        title: document.title,
        location: window.location.href
      });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [location.pathname, location.search, location.hash]);

  return null;
};
