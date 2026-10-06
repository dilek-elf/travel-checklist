const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const TOKEN_KEY = 'travel-checklist-token'

export type User = {
  id: number
  email: string
}

export type AuthSession = {
  token: string
  user: User
}

export type Trip = {
  id: number
  name: string
  destination: string
}

export type ChecklistItemData = {
  id: number
  text: string
  isPacked: boolean
  tripId: number
}

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(error?.message ?? 'The checklist could not connect to the server.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function register(email: string, password: string) {
  await apiRequest<User>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  return login(email, password)
}

export async function login(email: string, password: string) {
  const session = await apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  localStorage.setItem(TOKEN_KEY, session.token)
  return session
}

export function hasStoredToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

type TripListResponse = {
  data: Trip[]
}

export async function getTrips() {
  const response = await apiRequest<TripListResponse>('/trips')
  return response.data
}

export function createTrip(name: string, destination: string) {
  return apiRequest<Trip>('/trips', {
    method: 'POST',
    body: JSON.stringify({ name, destination }),
  })
}

export function getItems(tripId: number) {
  return apiRequest<ChecklistItemData[]>(`/trips/${tripId}/items`)
}

export function createItem(tripId: number, text: string) {
  return apiRequest<ChecklistItemData>(`/trips/${tripId}/items`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export function updateItem(id: number, isPacked: boolean) {
  return apiRequest<ChecklistItemData>(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ isPacked }),
  })
}

export function deleteItem(id: number) {
  return apiRequest<void>(`/items/${id}`, { method: 'DELETE' })
}
