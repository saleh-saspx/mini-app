const TOKEN_KEY = 'miniapp_token';
const USERNAME_KEY = 'miniapp_username';

export const storage = {
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
  getUsername() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USERNAME_KEY);
  },
  setUsername(username: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERNAME_KEY, username);
  },
  clearUsername() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USERNAME_KEY);
  }
};
