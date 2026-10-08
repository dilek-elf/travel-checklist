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
import ProgressCard from './components/ProgressCard'
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
    <main className="app-shell" id="top">
      <div className="page-wrap">
        <nav className="site-nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Travel Checklist home">
            <span className="brand-mark">✦</span>
            <span>Travel Checklist</span>
          </a>
          <span className="nav-motto">Pack lightly. Travel fully.</span>
          {isAuthenticated && (
            <button className="logout-button" type="button" onClick={logOut}>
              Log out
            </button>
          )}
        </nav>

        <ChecklistHeader compact={isAuthenticated} />

        {!isAuthenticated ? (
          <div className="auth-wrap">
            <AuthForm
              error={error}
              onLogin={(email, password) =>
                authenticate(login, email, password)
              }
              onRegister={(email, password) =>
                authenticate(register, email, password)
              }
            />
          </div>
        ) : (
          <div className="workspace-grid">
            <section className="clay-card checklist-card" aria-label="Travel checklist">
              <TripManager
                trips={trips}
                selectedTripId={tripId}
                disabled={isLoading}
                onSelect={selectTrip}
                onCreate={addTrip}
              />

              <div className="section-divider" />

              <div className="list-heading">
                <div>
                  <p className="eyebrow">The essentials</p>
                  <h2>What do you need to pack?</h2>
                </div>
                <span>{items.length} items</span>
              </div>

              <ChecklistForm item={item} onItemChange={setItem} onAdd={addItem} />

              {error && <p className="error-message" role="alert">{error}</p>}

              <div className="list-area">
                {isLoading ? (
                  <p className="loading-message">Preparing your suitcase...</p>
                ) : items.length === 0 ? (
                  <EmptyChecklist />
                ) : (
                  <ul className="checklist-list">
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
              </div>
            </section>

            <ProgressCard completed={completedItems} total={items.length} />
          </div>
        )}

        <footer>
          <span>Plan it. Pack it. Go.</span>
          <span>Take only what you need. Leave room for memories.</span>
        </footer>
      </div>
    </main>
  )
}

export default App
