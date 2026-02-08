import { create } from 'zustand';

interface AuthState {
  token: string | null;
  login: (token: string, remember: boolean) => void;
  logout: () => void;
  isAuth: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  token:
    localStorage.getItem('token') ||
    sessionStorage.getItem('token'),
  isAuth: !!(
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  ),
  login: (token, remember) => {
    if (remember) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }

    set({
      token,
      isAuth: true,
    });
  },  

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    set({
      token: null,
      isAuth: false,
    });
  },  
}));
