import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  initializeGoogleIntegrations,
  trackEvent,
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

  useEffect(() => {
    if (isAdminRoute || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();
    const hasCtaClass = (element: Element) =>
      element.classList.contains('apple-button') || element.getAttribute('data-cta') === 'true';

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const clickable = target.closest('a, button');
      if (!clickable) return;

      const elementText = normalizeText(clickable.textContent || '').slice(0, 140);
      const textLower = elementText.toLowerCase();

      if (clickable instanceof HTMLAnchorElement) {
        const href = clickable.getAttribute('href') || '';
        if (!href) return;

        let resolvedUrl: URL;
        try {
          resolvedUrl = new URL(href, window.location.href);
        } catch {
          return;
        }

        const normalizedHref = resolvedUrl.href.toLowerCase();
        const normalizedPath = `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`;

        if (normalizedHref.includes('wa.me/') || normalizedHref.includes('whatsapp')) {
          trackEvent('whatsapp_click', {
            source: 'site-link',
            link_url: resolvedUrl.href,
            link_text: elementText || null,
            page_path: window.location.pathname
          });
          return;
        }

        const isOutboundHttp =
          (resolvedUrl.protocol === 'http:' || resolvedUrl.protocol === 'https:') &&
          resolvedUrl.origin !== window.location.origin;
        if (isOutboundHttp) {
          trackEvent('outbound_link_click', {
            link_url: resolvedUrl.href,
            link_domain: resolvedUrl.hostname,
            link_text: elementText || null,
            page_path: window.location.pathname
          });
          return;
        }

        const isCtaLink = hasCtaClass(clickable);
        const isContactTarget = normalizedPath.startsWith('/contact') || normalizedPath.includes('#quote');
        const isConsultationTarget = normalizedPath.includes('consult') || textLower.includes('consult');

        if (isConsultationTarget && (isCtaLink || textLower.includes('book') || textLower.includes('call'))) {
          trackEvent('consultation_cta_click', {
            cta_text: elementText || null,
            cta_destination: normalizedPath,
            page_path: window.location.pathname
          });
          return;
        }

        if (isContactTarget && (isCtaLink || textLower.includes('contact') || textLower.includes('quote'))) {
          trackEvent('contact_cta_click', {
            cta_text: elementText || null,
            cta_destination: normalizedPath,
            page_path: window.location.pathname
          });
        }

        return;
      }

      if (!(clickable instanceof HTMLButtonElement)) {
        return;
      }

      if (!hasCtaClass(clickable)) {
        return;
      }

      if (textLower.includes('consult')) {
        trackEvent('consultation_cta_click', {
          cta_text: elementText || null,
          page_path: window.location.pathname
        });
        return;
      }

      if (textLower.includes('contact') || textLower.includes('quote')) {
        trackEvent('contact_cta_click', {
          cta_text: elementText || null,
          page_path: window.location.pathname
        });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isAdminRoute]);

  return null;
};
