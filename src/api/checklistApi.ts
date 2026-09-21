const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

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
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error('The checklist could not connect to the server.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getTrips() {
  return apiRequest<Trip[]>('/trips')
}

export function createTrip() {
  return apiRequest<Trip>('/trips', {
    method: 'POST',
    body: JSON.stringify({
      name: 'My Trip',
      destination: 'Next adventure',
    }),
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
