import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  initializeGoogleIntegrations,
  trackPageView
} from '../integrations/google';

export const GoogleIntegrationRuntime = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    initializeGoogleIntegrations();
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) {
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
  }, [isAdminRoute, location.pathname, location.search, location.hash]);

  return null;
};
