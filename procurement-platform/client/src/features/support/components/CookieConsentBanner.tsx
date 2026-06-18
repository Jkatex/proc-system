import { useState } from 'react';

export function CookieConsentBanner() {
  const storageKey = 'procurex.cookieConsent.v1';
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(storageKey) !== 'accepted';
  });

  if (!visible) return null;

  return (
    <section className="cookie-consent" aria-label="Cookie notice">
      <p>ProcureX uses local storage and essential cookies to keep sessions, preferences, and demo workflows working.</p>
      <button
        className="btn btn-primary"
        type="button"
        onClick={() => {
          window.localStorage.setItem(storageKey, 'accepted');
          setVisible(false);
        }}
      >
        Accept
      </button>
    </section>
  );
}
