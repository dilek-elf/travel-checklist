import { useState } from 'react'
import type { Trip } from '../api/checklistApi'

type TripManagerProps = {
  trips: Trip[]
  selectedTripId: number | null
  disabled: boolean
  onSelect: (tripId: number) => void
  onCreate: (name: string, destination: string) => Promise<boolean>
}

function TripManager({
  trips,
  selectedTripId,
  disabled,
  onSelect,
  onCreate,
}: TripManagerProps) {
  const [name, setName] = useState('')
  const [destination, setDestination] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async () => {
    if (!name.trim() || !destination.trim()) return

    const wasCreated = await onCreate(name.trim(), destination.trim())
    if (wasCreated) {
      setName('')
      setDestination('')
      setIsCreating(false)
    }
  }

  return (
    <section className="trip-panel" aria-label="Trips">
      <div className="trip-heading-row">
        <div>
          <p className="eyebrow">Current journey</p>
          <label className="sr-only" htmlFor="trip-select">
            Choose a trip
          </label>
        </div>
        <button
          className="text-button"
          type="button"
          disabled={disabled}
          onClick={() => setIsCreating((current) => !current)}
        >
          {isCreating ? 'Cancel' : '+ New trip'}
        </button>
      </div>

      <div className="trip-select-wrap">
        <select
          id="trip-select"
          className="trip-select"
          value={selectedTripId ?? ''}
          disabled={disabled || trips.length === 0}
          onChange={(event) => onSelect(Number(event.target.value))}
        >
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name} — {trip.destination}
            </option>
          ))}
        </select>
      </div>

      {isCreating && (
        <div className="new-trip-form">
          <input
            className="clay-input"
            aria-label="Trip name"
            placeholder="Trip name"
            value={name}
            disabled={disabled}
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="clay-input"
            aria-label="Destination"
            placeholder="Destination"
            value={destination}
            disabled={disabled}
            onChange={(event) => setDestination(event.target.value)}
          />
          <button
            className="clay-button clay-button-small"
            type="button"
            disabled={disabled || !name.trim() || !destination.trim()}
            onClick={handleCreate}
          >
            Create trip
          </button>
        </div>
      )}
    </section>
  )
}

export default TripManager
