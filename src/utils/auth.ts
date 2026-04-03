const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function getUser(): Record<string, unknown> | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
}

export function setUser(user: Record<string, unknown>): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeUser(): void {
  localStorage.removeItem(USER_KEY)
}

export function clearAuth(): void {
  removeToken()
  removeUser()
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
