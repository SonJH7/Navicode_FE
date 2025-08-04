import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { loginApi, registerApi } from '../api/auth';

interface User {
  username: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string; user: User | null }
  | { type: 'SIGN_IN'; token: string; user: User }
  | { type: 'SIGN_OUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        token: action.token,
        user: action.user,
        loading: false,
      };
    case 'SIGN_IN':
      return { ...state, token: action.token, user: action.user };
    case 'SIGN_OUT':
      return { ...state, token: null, user: null };
    default:
      return state;
  }
}

const initialState: AuthState = { token: null, user: null, loading: true };

const AuthContext = createContext<{
  state: AuthState;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (username: string, password: string, name: string) => Promise<void>;
}>({
  state: initialState,
  signIn: async () => {},
  signOut: () => {},
  signUp: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'RESTORE_TOKEN', token: null, user: null });
  }, []);

  const signIn = async (username: string, password: string) => {
    const { token } = await loginApi(username, password);
    dispatch({ type: 'SIGN_IN', token, user: { username } });
  };

  const signOut = () => {
    dispatch({ type: 'SIGN_OUT' });
  };

  const signUp = async (username: string, password: string) => {
    await registerApi(username, password);
    const { token } = await loginApi(username, password);
    dispatch({ type: 'SIGN_IN', token, user: { username } });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
