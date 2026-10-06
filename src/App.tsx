import { useEffect, useState } from 'react'
import {
  createItem,
  createTrip,
  deleteItem,
  getItems,
  getTrips,
  hasStoredToken,
  login,
  logout,
  register,
  updateItem,
  type ChecklistItemData,
  type Trip,
} from './api/checklistApi'
import AuthForm from './components/AuthForm'
import ChecklistForm from './components/ChecklistForm'
import ChecklistHeader from './components/ChecklistHeader'
import ChecklistItem from './components/ChecklistItem'
import EmptyChecklist from './components/EmptyChecklist'
import TripManager from './components/TripManager'

async function loadChecklist() {
  let trips = await getTrips()
  const trip = trips[0] ?? (await createTrip('My Trip', 'Next adventure'))
  if (trips.length === 0) trips = [trip]
  const items = await getItems(trip.id)

  return { trips, tripId: trip.id, items }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredToken)
  const [item, setItem] = useState('')
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripId, setTripId] = useState<number | null>(null)
  const [items, setItems] = useState<ChecklistItemData[]>([])
  const [isLoading, setIsLoading] = useState(isAuthenticated)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return

    let isCurrent = true

    loadChecklist()
      .then((checklist) => {
        if (!isCurrent) return

        setTrips(checklist.trips)
        setTripId(checklist.tripId)
        setItems(checklist.items)
      })
      .catch(() => {
        if (isCurrent) {
          setError('Could not load your checklist. Is the backend running?')
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [isAuthenticated])

  const authenticate = async (
    action: (email: string, password: string) => Promise<unknown>,
    email: string,
    password: string,
  ) => {
    try {
      setError('')
      await action(email, password)
      setIsLoading(true)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Could not access the account.',
      )
      return false
    }
  }

  const logOut = () => {
    logout()
    setIsAuthenticated(false)
    setTrips([])
    setTripId(null)
    setItems([])
    setItem('')
    setIsLoading(false)
    setError('')
  }

  const selectTrip = async (selectedTripId: number) => {
    try {
      setError('')
      setIsLoading(true)
      const selectedItems = await getItems(selectedTripId)
      setTripId(selectedTripId)
      setItems(selectedItems)
    } catch {
      setError('Could not load this trip. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const addTrip = async (name: string, destination: string) => {
    try {
      setError('')
      const newTrip = await createTrip(name, destination)
      setTrips((trips) => [newTrip, ...trips])
      setTripId(newTrip.id)
      setItems([])
      return true
    } catch {
      setError('Could not create the trip. Please try again.')
      return false
    }
  }

  const addItem = async () => {
    const text = item.trim()
    if (!text || tripId === null) return

    try {
      setError('')
      const newItem = await createItem(tripId, text)
      setItems((items) => [...items, newItem])
      setItem('')
    } catch {
      setError('Could not add the item. Please try again.')
    }
  }

  const toggleItem = async (id: number, checked: boolean) => {
    try {
      setError('')
      const updatedItem = await updateItem(id, checked)
      setItems((items) =>
        items.map((item) => (item.id === id ? updatedItem : item)),
      )
    } catch {
      setError('Could not update the item. Please try again.')
    }
  }

  const removeItem = async (id: number) => {
    try {
      setError('')
      await deleteItem(id)
      setItems((items) => items.filter((item) => item.id !== id))
    } catch {
      setError('Could not delete the item. Please try again.')
    }
  }

  const completedItems = items.filter((item) => item.isPacked).length

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-3 py-6 text-[#3f2b20] min-[380px]:px-4 min-[380px]:py-8 sm:px-6 sm:py-16">
      <div className="mx-auto min-w-0 max-w-2xl">
        <ChecklistHeader />

        {!isAuthenticated ? (
          <AuthForm
            error={error}
            onLogin={(email, password) =>
              authenticate(login, email, password)
            }
            onRegister={(email, password) =>
              authenticate(register, email, password)
            }
          />
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                className="rounded-xl border border-[#b98f76] px-4 py-2 text-sm font-semibold text-[#6f4935] transition hover:bg-[#f3e4d8]"
                type="button"
                onClick={logOut}
              >
                Log out
              </button>
            </div>

            <TripManager
          trips={trips}
          selectedTripId={tripId}
          disabled={isLoading}
          onSelect={selectTrip}
          onCreate={addTrip}
            />

            <section
          className="min-w-0 rounded-3xl border border-[#e4d2c3] bg-[#fffaf5]/95 p-4 shadow-[0_18px_45px_rgba(88,57,40,0.1)] min-[380px]:p-5 sm:rounded-[2rem] sm:p-8 sm:shadow-[0_24px_60px_rgba(88,57,40,0.12)]"
          aria-label="Travel checklist"
        >
          <ChecklistForm
            item={item}
            onItemChange={setItem}
            onAdd={addItem}
          />

          <div className="my-6 h-px bg-[#eadbd0]" />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#493126] min-[380px]:text-xl">
              Your essentials
            </h2>
            <span className="shrink-0 rounded-full bg-[#efe1d5] px-3 py-1 text-xs font-semibold whitespace-nowrap text-[#76513e]">
              {completedItems} of {items.length} packed
            </span>
          </div>

          {error && (
            <p className="mb-4 text-sm text-[#8a3f32]" role="alert">
              {error}
            </p>
          )}

          {isLoading ? (
            <p className="py-6 text-center text-sm text-[#9b8171]">
              Loading your checklist...
            </p>
          ) : items.length === 0 ? (
            <EmptyChecklist />
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item.text}
                  completed={item.isPacked}
                  onToggle={(checked) => toggleItem(item.id, checked)}
                  onDelete={() => removeItem(item.id)}
                />
              ))}
            </ul>
          )}
            </section>
          </>
        )}

        <p className="mt-6 text-center text-xs tracking-wide text-[#9b8171]">
          Take only what you need. Leave room for memories.
        </p>
      </div>
    </main>
  )
}

export default App
