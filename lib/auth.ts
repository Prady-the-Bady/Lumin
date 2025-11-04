// Authentication utilities and session management

import type { User } from "@/types"

const AUTH_STORAGE_KEY = "lumin_auth_user"
const TOKEN_STORAGE_KEY = "lumin_auth_token"

export class AuthManager {
  // Get current user from localStorage
  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userJson = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!userJson) return null
      return JSON.parse(userJson)
    } catch (error) {
      console.error("[v0] Error reading user from storage:", error)
      return null
    }
  }

  // Get auth token
  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  }

  // Save user and token
  static saveAuth(user: User, token: string): void {
    if (typeof window === "undefined") return

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  }

  // Clear auth data
  static clearAuth(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null
  }
}
