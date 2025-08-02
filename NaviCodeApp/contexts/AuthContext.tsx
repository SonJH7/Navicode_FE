import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, registerApi } from '../api/auth';

interface User {
  id: string;
  name: string;
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
    AsyncStorage.getItem('userToken').then(async (token) => {
      if (token) {
        const userInfo = await AsyncStorage.getItem('userInfo');
        const user = userInfo ? JSON.parse(userInfo) : null;
        dispatch({ type: 'RESTORE_TOKEN', token, user });
      } else {
        dispatch({ type: 'RESTORE_TOKEN', token: null, user: null });
      }
    });
  }, []);

  const signIn = async (username: string, password: string) => {
    const { token, user } = await loginApi(username, password);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    dispatch({ type: 'SIGN_IN', token, user });
  };

  const signOut = () => {
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userInfo');
    dispatch({ type: 'SIGN_OUT' });
  };

  const signUp = async (username: string, password: string, name: string) => {
    const { token, user } = await registerApi(username, password, name);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    dispatch({ type: 'SIGN_IN', token, user });
  };

  return (
    <AuthContext.Provider value={{ state, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);