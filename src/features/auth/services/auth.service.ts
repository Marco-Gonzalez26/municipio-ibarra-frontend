import { api } from '@/lib/https'
import type { LoginCredentials, LoginResponse } from '../types/auth.type'

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<LoginResponse>('/loginvinculacion', { body: credentials }),
}
