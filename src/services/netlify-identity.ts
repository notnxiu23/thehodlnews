declare global {
  interface Window {
    netlifyIdentity: {
      on: (event: string, callback: (user: any) => void) => void;
      init: (opts?: { locale: string }) => void;
      open: (tab?: 'login' | 'signup') => void;
      close: () => void;
      currentUser: () => any;
      logout: () => void;
    };
  }
}

export const initNetlifyIdentity = () => {
  const { netlifyIdentity } = window;

  if (!netlifyIdentity) {
    console.error('Netlify Identity not initialized');
    return;
  }

  netlifyIdentity.on('init', user => {
    if (user) {
      console.log('Logged in as:', user.email);
    }
  });

  netlifyIdentity.on('login', user => {
    console.log('Logged in as:', user.email);
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    console.log('Logged out');
  });

  netlifyIdentity.on('error', err => {
    console.error('Authentication error:', err);
  });

  netlifyIdentity.init();
};