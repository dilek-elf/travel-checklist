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
  resetPassword,
  updateItem,
  updateTrip,
  type ChecklistItemData,
  type ItemCategory,
  type Trip,
  type TripPreferences,
  type AuthSession,
} from './api/checklistApi'
import AuthForm from './components/AuthForm'
import ChecklistForm from './components/ChecklistForm'
import ChecklistHeader from './components/ChecklistHeader'
import ChecklistItem from './components/ChecklistItem'
import EmptyChecklist from './components/EmptyChecklist'
import ProgressCard from './components/ProgressCard'
import PackingPlanner from './components/PackingPlanner'
import TripManager from './components/TripManager'
import { generatePackingList } from './packingTemplates'

async function loadChecklist() {
  let trips = await getTrips()
  const trip = trips[0] ?? (await createTrip('My Trip', 'Next adventure'))
  if (trips.length === 0) trips = [trip]
  const items = await getItems(trip.id)

  return { trips, tripId: trip.id, items }
}

function App() {
  const [filter, setFilter] = useState<'all' | 'unpacked' | 'packed'>('all')
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredToken)
  const [item, setItem] = useState('')
  const [category, setCategory] = useState<ItemCategory>('Other')
  const [trips, setTrips] = useState<Trip[]>([])
  const [tripId, setTripId] = useState<number | null>(null)
  const [items, setItems] = useState<ChecklistItemData[]>([])
  const [isLoading, setIsLoading] = useState(isAuthenticated)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCustomItem, setShowCustomItem] = useState(false)
  const [error, setError] = useState('')
  const [recoveryCode, setRecoveryCode] = useState('')

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
      .catch((loadError) => {
        if (isCurrent) {
          if (
            loadError instanceof Error &&
            loadError.message.includes('invalid or expired')
          ) {
            logout()
            setIsAuthenticated(false)
            setError('Your session expired. Please log in again.')
          } else {
            setError('Could not load your checklist. Is the backend running?')
          }
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
    action: (email: string, password: string) => Promise<AuthSession>,
    email: string,
    password: string,
  ) => {
    try {
      setError('')
      const session = await action(email, password)
      if (session.recoveryCode) setRecoveryCode(session.recoveryCode)
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

  const recoverAccount = async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    try {
      setError('')
      const result = await resetPassword(email, code, newPassword)
      setRecoveryCode(result.recoveryCode)
      return true
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : 'Could not reset the password.',
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
      setShowCustomItem(false)
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
      const newItem = await createItem(tripId, text, category)
      setItems((items) => [...items, newItem])
      setItem('')
    } catch {
      setError('Could not add the item. Please try again.')
    }
  }

  const toggleItem = async (id: number, checked: boolean) => {
    try {
      setError('')
      const updatedItem = await updateItem(id, { isPacked: checked })
      setItems((items) =>
        items.map((item) => (item.id === id ? updatedItem : item)),
      )
    } catch {
      setError('Could not update the item. Please try again.')
    }
  }

  const editItem = async (id: number, text: string) => {
    try {
      setError('')
      const updatedItem = await updateItem(id, { text })
      setItems((items) =>
        items.map((item) => (item.id === id ? updatedItem : item)),
      )
      return true
    } catch {
      setError('Could not edit the item. Please try again.')
      return false
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

  const generateItems = async (preferences: TripPreferences) => {
    if (tripId === null) return null

    try {
      setError('')
      setIsGenerating(true)

      const savedTrip = await updateTrip(tripId, preferences)
      setTrips((trips) =>
        trips.map((trip) => (trip.id === tripId ? savedTrip : trip)),
      )

      const itemKey = (text: string) =>
        text.trim().toLowerCase().replace(/\s*×\s*\d+$/, '')
      const existingItems = new Map(
        items.map((currentItem) => [itemKey(currentItem.text), currentItem]),
      )
      const suggestions = generatePackingList(preferences)
      const newSuggestions = suggestions.filter(
        (suggestion) => !existingItems.has(itemKey(suggestion.text)),
      )
      const changedSuggestions = suggestions.flatMap((suggestion) => {
        const existing = existingItems.get(itemKey(suggestion.text))
        return existing &&
          (existing.text !== suggestion.text || existing.category !== suggestion.category)
          ? [{ existing, suggestion }]
          : []
      })
      const createdItems = await Promise.all(
        newSuggestions.map((suggestion) =>
          createItem(tripId, suggestion.text, suggestion.category),
        ),
      )
      const updatedItems = await Promise.all(
        changedSuggestions.map(({ existing, suggestion }) =>
          updateItem(existing.id, {
            text: suggestion.text,
            category: suggestion.category,
          }),
        ),
      )

      setItems((currentItems) => [
        ...currentItems.map(
          (currentItem) =>
            updatedItems.find((updated) => updated.id === currentItem.id) ?? currentItem,
        ),
        ...createdItems,
      ])
      setFilter('all')
      return { added: createdItems.length, updated: updatedItems.length }
    } catch {
      setError('Could not generate the checklist. Please try again.')
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const completedItems = items.filter((item) => item.isPacked).length
  const selectedTrip = trips.find((trip) => trip.id === tripId) ?? null
  const visibleItems = items.filter((item) => {
    if (filter === 'packed') return item.isPacked
    if (filter === 'unpacked') return !item.isPacked
    return true
  })
  const groupedItems = visibleItems.reduce<
    Partial<Record<ItemCategory, ChecklistItemData[]>>
  >((groups, currentItem) => {
    const category = currentItem.category ?? 'Other'
    groups[category] = [...(groups[category] ?? []), currentItem]
    return groups
  }, {})

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

        {recoveryCode && (
          <section className="recovery-code-notice" aria-label="Recovery code">
            <div>
              <strong>Save your recovery code</strong>
              <p>You need this code if you forget your password. It is shown only now.</p>
            </div>
            <code>{recoveryCode}</code>
            <button type="button" onClick={() => setRecoveryCode('')}>I saved it</button>
          </section>
        )}

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
              onResetPassword={recoverAccount}
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

              {selectedTrip && (
                <PackingPlanner
                  key={selectedTrip.id}
                  trip={selectedTrip}
                  disabled={isLoading || isGenerating}
                  onGenerate={generateItems}
                />
              )}

              <div className="section-divider" />

              <div className="list-heading">
                <div>
                  <p className="eyebrow">Your essentials</p>
                  <h2>Your packing checklist</h2>
                </div>
                <span>{items.length} items</span>
              </div>

              <button
                className="custom-item-toggle"
                type="button"
                aria-expanded={showCustomItem}
                onClick={() => setShowCustomItem((current) => !current)}
              >
                {showCustomItem ? 'Hide custom item form' : '+ Add your own item'}
              </button>

              {showCustomItem && (
                <ChecklistForm
                  item={item}
                  category={category}
                  onItemChange={setItem}
                  onCategoryChange={setCategory}
                  onAdd={addItem}
                />
              )}

              <div className="checklist-filters" aria-label="Filter checklist items">
                <button
                  className={filter === 'all' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={filter === 'all'}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={filter === 'unpacked' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={filter === 'unpacked'}
                  onClick={() => setFilter('unpacked')}
                >
                  Not packed
                </button>
                <button
                  className={filter === 'packed' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={filter === 'packed'}
                  onClick={() => setFilter('packed')}
                >
                  Packed
                </button>
              </div>

              {error && <p className="error-message" role="alert">{error}</p>}

              <div className="list-area">
                {isLoading ? (
                  <p className="loading-message">Preparing your suitcase...</p>
                ) : items.length === 0 ? (
                  <EmptyChecklist />
                ) : visibleItems.length === 0 ? (
                  <p className="filter-empty-message">
                    No items match this filter.
                  </p>
                ) : (
                  <div className="category-groups">
                    {Object.entries(groupedItems).map(([categoryName, categoryItems]) => (
                      <section className="category-group" key={categoryName}>
                        <h3>{categoryName}</h3>
                        <ul className="checklist-list">
                          {categoryItems?.map((item) => (
                            <ChecklistItem
                              key={item.id}
                              item={item.text}
                              category={item.category ?? 'Other'}
                              completed={item.isPacked}
                              onToggle={(checked) => toggleItem(item.id, checked)}
                              onEdit={(text) => editItem(item.id, text)}
                              onDelete={() => removeItem(item.id)}
                            />
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
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
