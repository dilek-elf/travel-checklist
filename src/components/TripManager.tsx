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

  const handleCreate = async () => {
    if (!name.trim() || !destination.trim()) return

    const wasCreated = await onCreate(name.trim(), destination.trim())
    if (wasCreated) {
      setName('')
      setDestination('')
    }
  }

  return (
    <section
      className="mb-6 rounded-3xl border border-[#e4d2c3] bg-[#fffaf5]/95 p-4 shadow-[0_18px_45px_rgba(88,57,40,0.08)] min-[380px]:p-5 sm:p-6"
      aria-label="Trips"
    >
      <div className="mb-4">
        <label
          className="mb-2 block text-sm font-semibold text-[#493126]"
          htmlFor="trip-select"
        >
          Choose a trip
        </label>
        <select
          id="trip-select"
          className="w-full rounded-2xl border border-[#d8c0af] bg-[#fcf7f2] px-4 py-3 text-[#3f2b20] outline-none focus:border-[#8b6048] focus:ring-4 focus:ring-[#c9a995]/25 disabled:cursor-not-allowed disabled:opacity-60"
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

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="min-w-0 rounded-2xl border border-[#d8c0af] bg-[#fcf7f2] px-4 py-3 text-[#3f2b20] outline-none placeholder:text-[#ad9383] focus:border-[#8b6048] focus:ring-4 focus:ring-[#c9a995]/25 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Trip name"
          placeholder="Trip name"
          value={name}
          disabled={disabled}
          onChange={(event) => setName(event.target.value)}
        />
        <input
          className="min-w-0 rounded-2xl border border-[#d8c0af] bg-[#fcf7f2] px-4 py-3 text-[#3f2b20] outline-none placeholder:text-[#ad9383] focus:border-[#8b6048] focus:ring-4 focus:ring-[#c9a995]/25 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Destination"
          placeholder="Destination"
          value={destination}
          disabled={disabled}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <button
        className="mt-3 w-full rounded-2xl border border-[#b98f76] px-5 py-3 font-semibold text-[#6f4935] transition hover:bg-[#f3e4d8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b6048] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        type="button"
        disabled={disabled || !name.trim() || !destination.trim()}
        onClick={handleCreate}
      >
        Create trip
      </button>
    </section>
  )
}

export default TripManager
