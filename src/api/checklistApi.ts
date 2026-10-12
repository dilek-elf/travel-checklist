const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'
const TOKEN_KEY = 'travel-checklist-token'

export type User = {
  id: number
  email: string
}

export type AuthSession = {
  token: string
  user: User
  recoveryCode?: string
}

type RegistrationResponse = User & { recoveryCode: string }
type PasswordResetResponse = { message: string; recoveryCode: string }

export type Trip = {
  id: number
  name: string
  destination: string
  tripType: TripType
  season: Season
  durationDays: number
  travelGroup: TravelGroup
  hasPet: boolean
  petType: PetType | null
  transport: Transport
  startDate: string | null
  endDate: string | null
  travelScope: TravelScope
  accommodation: Accommodation
  adultCount: number
  babyCount: number
  toddlerCount: number
  childCount: number
  teenCount: number
  activities: Activity[]
  luggage: Luggage
  hasLaundry: boolean
  personalNeeds: PersonalNeed[]
}

export const TRIP_TYPES = [
  'Weekend',
  'Business',
  'Family vacation',
  'Spring break',
  'Tech work',
  'Camping',
  'Road trip',
] as const
export const SEASONS = [
  'Spring',
  'Summer',
  'Autumn',
  'Winter',
  'All seasons',
] as const
export const TRAVEL_GROUPS = ['Solo', 'Couple', 'Family', 'Friends/group'] as const
export const TRANSPORT_OPTIONS = [
  'Car',
  'Motorcycle',
  'Camper van/RV',
  'Bus',
  'Train',
  'Plane',
  'Cruise ship',
] as const
export const TRAVEL_SCOPES = ['Domestic', 'International'] as const
export const ACCOMMODATIONS = [
  'Hotel',
  'Holiday apartment',
  'Family/friends',
  'Camping',
  'Camper van',
] as const
export const ACTIVITIES = [
  'Beach/swimming',
  'Hiking',
  'Skiing',
  'Formal event',
  'Sports/gym',
  'Remote work',
  'Photography',
] as const
export const LUGGAGE_OPTIONS = [
  'Backpack only',
  'Carry-on',
  'Checked suitcase',
  'Car luggage',
] as const
export const PERSONAL_NEEDS = [
  'Medication',
  'Accessibility equipment',
  'Glasses/contact lenses',
  'Menstrual products',
  'Pregnancy essentials',
  'Makeup',
  'Shaving/grooming',
  'Haircare',
] as const
export const PET_TYPES = ['Dog', 'Cat', 'Other'] as const

export type TripType = (typeof TRIP_TYPES)[number]
export type Season = (typeof SEASONS)[number]
export type TravelGroup = (typeof TRAVEL_GROUPS)[number]
export type Transport = (typeof TRANSPORT_OPTIONS)[number]
export type TravelScope = (typeof TRAVEL_SCOPES)[number]
export type Accommodation = (typeof ACCOMMODATIONS)[number]
export type Activity = (typeof ACTIVITIES)[number]
export type Luggage = (typeof LUGGAGE_OPTIONS)[number]
export type PersonalNeed = (typeof PERSONAL_NEEDS)[number]
export type PetType = (typeof PET_TYPES)[number]
export type TripPreferences = Pick<
  Trip,
  | 'tripType'
  | 'season'
  | 'durationDays'
  | 'travelGroup'
  | 'hasPet'
  | 'petType'
  | 'transport'
  | 'startDate'
  | 'endDate'
  | 'travelScope'
  | 'accommodation'
  | 'adultCount'
  | 'babyCount'
  | 'toddlerCount'
  | 'childCount'
  | 'teenCount'
  | 'activities'
  | 'luggage'
  | 'hasLaundry'
  | 'personalNeeds'
>

export type ChecklistItemData = {
  id: number
  text: string
  category: ItemCategory
  isPacked: boolean
  tripId: number
}

export const ITEM_CATEGORIES = [
  'Documents',
  'Clothes',
  'Toiletries',
  'Electronics',
  'Health',
  'Travel gear',
  'Pet',
  'Other',
] as const

export type ItemCategory = (typeof ITEM_CATEGORIES)[number]

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
  const registration = await apiRequest<RegistrationResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const session = await login(email, password)
  return { ...session, recoveryCode: registration.recoveryCode }
}

export function resetPassword(
  email: string,
  recoveryCode: string,
  newPassword: string,
) {
  return apiRequest<PasswordResetResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, recoveryCode, newPassword }),
  })
}

export function createNewRecoveryCode() {
  return apiRequest<{ recoveryCode: string }>('/auth/recovery-code', {
    method: 'POST',
  })
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

export function updateTrip(id: number, updates: Partial<TripPreferences>) {
  return apiRequest<Trip>(`/trips/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function getItems(tripId: number) {
  return apiRequest<ChecklistItemData[]>(`/trips/${tripId}/items`)
}

export function createItem(tripId: number, text: string, category: ItemCategory) {
  return apiRequest<ChecklistItemData>(`/trips/${tripId}/items`, {
    method: 'POST',
    body: JSON.stringify({ text, category }),
  })
}

export function updateItem(
  id: number,
  updates: { text?: string; category?: ItemCategory; isPacked?: boolean },
) {
  return apiRequest<ChecklistItemData>(`/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export function deleteItem(id: number) {
  return apiRequest<void>(`/items/${id}`, { method: 'DELETE' })
}
