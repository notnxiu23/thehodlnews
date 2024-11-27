// Initialize Netlify Identity widget
let netlifyIdentityInitialized = false;

export async function initNetlifyIdentity(): Promise<void> {
  if (netlifyIdentityInitialized) {
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      if (window.netlifyIdentity) {
        window.netlifyIdentity.init({
          APIUrl: `${window.location.origin}/.netlify/identity`,
          locale: 'en'
        });
        netlifyIdentityInitialized = true;
        resolve();
      } else {
        reject(new Error('Netlify Identity not loaded'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function getCurrentUser() {
  if (!window.netlifyIdentity) {
    return null;
  }
  return window.netlifyIdentity.currentUser();
}

export function openNetlifyModal(type: 'login' | 'signup') {
  if (!window.netlifyIdentity) {
    console.error('Netlify Identity not initialized');
    return;
  }
  window.netlifyIdentity.open(type);
}

export function closeNetlifyModal() {
  if (!window.netlifyIdentity) {
    return;
  }
  window.netlifyIdentity.close();
}

export function logout() {
  if (!window.netlifyIdentity) {
    return;
  }
  window.netlifyIdentity.logout();
}

// Type definitions for Netlify Identity
declare global {
  interface Window {
    netlifyIdentity: {
      init: (params?: any) => void;
      open: (type?: 'login' | 'signup') => void;
      close: () => void;
      currentUser: () => any;
      logout: () => void;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
    };
  }
}