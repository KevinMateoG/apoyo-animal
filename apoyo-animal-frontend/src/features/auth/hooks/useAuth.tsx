"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  setUnauthorizedHandler,
  tokenStorage,
  userStorage,
} from "@/src/features/common/http";
import type { LoginRequest, RegisterRequest, User } from "../domain/auth";
import * as authService from "../services/auth.service";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (request: LoginRequest) => Promise<User>;
  register: (request: RegisterRequest) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = tokenStorage.get();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const freshUser = await authService.getCurrentUser();
    setUser(freshUser);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(async () => {
        const token = tokenStorage.get();
        if (!token) {
          if (active) {
            setUser(null);
            setIsLoading(false);
          }
          return;
        }
        const cached = userStorage.get<User>();
        if (cached && active) {
          setUser(cached);
        }
        const freshUser = await authService.getCurrentUser();
        if (active) {
          setUser(freshUser);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      router.push("/login");
    });

    return () => setUnauthorizedHandler(null);
  }, [router]);

  const handleLogin = useCallback(async (request: LoginRequest) => {
    const response = await authService.login(request);
    setUser(response.user);
    return response.user;
  }, []);

  const handleRegister = useCallback(async (request: RegisterRequest) => {
    const response = await authService.register(request);
    setUser(response.user);
    return response.user;
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      handleLogin,
      handleRegister,
      handleLogout,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider");
  }
  return context;
}

