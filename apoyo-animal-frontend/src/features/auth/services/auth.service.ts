import { http, tokenStorage, userStorage } from "@/src/features/common/http";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "../domain/auth";

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await http<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: request,
    skipAuthRedirect: true,
  });

  if (response.token) {
    tokenStorage.set(response.token);
  }
  userStorage.set(response.user);

  return response;
}

export async function register(
  request: RegisterRequest,
): Promise<AuthResponse> {
  const response = await http<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: request,
    skipAuthRedirect: true,
  });

  if (response.token) {
    tokenStorage.set(response.token);
  }
  userStorage.set(response.user);

  return response;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = tokenStorage.get();
  if (!token) {
    return null;
  }

  try {
    const response = await http<{ data: User }>("/api/users/me", {
      method: "GET",
      skipAuthRedirect: true,
    });
    userStorage.set(response.data);
    return response.data;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

export function logout(): void {
  tokenStorage.clear();
}
