// Authentication state management with Zustand

import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { AuthState, User } from "@/types"
import { AuthManager } from "@/lib/auth"

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      checkAuth: () => {
        const user = AuthManager.getCurrentUser()
        set({
          user,
          isAuthenticated: user !== null,
        })
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Mock authentication - replace with actual API call
          // const response = await api.post('/auth/login', { email, password });

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock user data
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name: email.split("@")[0],
            createdAt: new Date().toISOString(),
          }

          const mockToken = "mock_jwt_token_" + Math.random().toString(36)

          AuthManager.saveAuth(mockUser, mockToken)

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Login failed",
            isLoading: false,
          })
          throw error
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // Mock authentication - replace with actual API call
          // const response = await api.post('/auth/signup', { name, email, password });

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock user data
          const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            name,
            createdAt: new Date().toISOString(),
          }

          const mockToken = "mock_jwt_token_" + Math.random().toString(36)

          AuthManager.saveAuth(mockUser, mockToken)

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Signup failed",
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        AuthManager.clearAuth()
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        })
      },
    }),
    { name: "AuthStore" },
  ),
)
