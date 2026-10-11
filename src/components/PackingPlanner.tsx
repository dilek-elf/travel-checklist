import { useState } from 'react'
import {
  ACCOMMODATIONS, ACTIVITIES, LUGGAGE_OPTIONS, PERSONAL_NEEDS, PET_TYPES,
  SEASONS, TRANSPORT_OPTIONS, TRAVEL_GROUPS, TRAVEL_SCOPES, TRIP_TYPES,
  type Accommodation, type Activity, type Luggage, type PersonalNeed,
  type PetType, type Season, type Transport, type TravelGroup,
  type TravelScope, type Trip, type TripPreferences, type TripType,
} from '../api/checklistApi'

type GenerationResult = { added: number; updated: number }
type Props = { trip: Trip; disabled: boolean; onGenerate: (preferences: TripPreferences) => Promise<GenerationResult | null> }

function dateValue(value: string | null) { return value?.slice(0, 10) ?? '' }

function daysBetween(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return null
  const start = Date.parse(`${startDate}T00:00:00Z`)
  const end = Date.parse(`${endDate}T00:00:00Z`)
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null
  return Math.min(60, Math.floor((end - start) / 86_400_000) + 1)
}

function PackingPlanner({ trip, disabled, onGenerate }: Props) {
  const [preferences, setPreferences] = useState<TripPreferences>({
    tripType: trip.tripType, season: trip.season, durationDays: trip.durationDays,
    travelGroup: trip.travelGroup, hasPet: trip.hasPet, petType: trip.petType,
    transport: trip.transport, startDate: dateValue(trip.startDate), endDate: dateValue(trip.endDate),
    travelScope: trip.travelScope, accommodation: trip.accommodation, adultCount: trip.adultCount,
    babyCount: trip.babyCount, toddlerCount: trip.toddlerCount, childCount: trip.childCount,
    teenCount: trip.teenCount, activities: trip.activities, luggage: trip.luggage,
    hasLaundry: trip.hasLaundry, personalNeeds: trip.personalNeeds,
  })
  const [message, setMessage] = useState('')
  const change = <Key extends keyof TripPreferences>(key: Key, value: TripPreferences[Key]) => setPreferences((current) => ({ ...current, [key]: value }))

  const changeDate = (key: 'startDate' | 'endDate', value: string) => setPreferences((current) => {
    const next = { ...current, [key]: value || null }
    const duration = daysBetween(next.startDate, next.endDate)
    return duration ? { ...next, durationDays: duration } : next
  })

  const toggleListValue = (key: 'activities' | 'personalNeeds', value: string) => setPreferences((current) => {
    const values = current[key] as string[]
    return { ...current, [key]: values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value] }
  })

  const changeTravelGroup = (travelGroup: TravelGroup) => setPreferences((current) => ({
    ...current, travelGroup,
    adultCount: travelGroup === 'Solo' ? 1 : travelGroup === 'Couple' ? 2 : Math.max(2, current.adultCount),
  }))

  const generate = async () => {
    setMessage('')
    const result = await onGenerate(preferences)
    if (!result) return
    const parts = []
    if (result.added) parts.push(`${result.added} items added`)
    if (result.updated) parts.push(`${result.updated} quantities updated`)
    setMessage(parts.length ? `${parts.join(' and ')}.` : 'Your checklist is already up to date.')
  }

  const showCounts = ['Family', 'Friends/group'].includes(preferences.travelGroup)
  return (
    <section className="packing-planner" aria-labelledby="packing-planner-title">
      <div className="planner-heading"><div><p className="eyebrow">Plan your packing list</p><h2 id="packing-planner-title">Tell us about your trip</h2></div><span>{preferences.durationDays} days</span></div>

      <div className="planner-section"><h3>Trip basics</h3><div className="planner-grid">
        <SelectField label="Trip type" value={preferences.tripType} options={TRIP_TYPES} disabled={disabled} onChange={(value) => change('tripType', value as TripType)} />
        <SelectField label="Season" value={preferences.season} options={SEASONS} disabled={disabled} onChange={(value) => change('season', value as Season)} />
        <label>Start date<input className="clay-input" type="date" value={preferences.startDate ?? ''} disabled={disabled} onChange={(event) => changeDate('startDate', event.target.value)} /></label>
        <label>End date<input className="clay-input" type="date" min={preferences.startDate ?? undefined} value={preferences.endDate ?? ''} disabled={disabled} onChange={(event) => changeDate('endDate', event.target.value)} /></label>
        <label>Duration (days)<input className="clay-input" type="number" min="1" max="60" value={preferences.durationDays} disabled={disabled} onChange={(event) => change('durationDays', Math.min(60, Math.max(1, Number(event.target.value))))} /></label>
        <SelectField label="Travel area" value={preferences.travelScope} options={TRAVEL_SCOPES} disabled={disabled} onChange={(value) => change('travelScope', value as TravelScope)} />
        <SelectField label="Transport" value={preferences.transport} options={TRANSPORT_OPTIONS} disabled={disabled} onChange={(value) => change('transport', value as Transport)} />
        <SelectField label="Accommodation" value={preferences.accommodation} options={ACCOMMODATIONS} disabled={disabled} onChange={(value) => change('accommodation', value as Accommodation)} />
        <SelectField label="Luggage" value={preferences.luggage} options={LUGGAGE_OPTIONS} disabled={disabled} onChange={(value) => change('luggage', value as Luggage)} />
      </div></div>

      <div className="planner-section"><h3>Who is travelling?</h3><div className="planner-grid">
        <SelectField label="Travel party" value={preferences.travelGroup} options={TRAVEL_GROUPS} disabled={disabled} onChange={(value) => changeTravelGroup(value as TravelGroup)} />
        <label className="check-option"><input type="checkbox" checked={preferences.hasPet} disabled={disabled} onChange={(event) => setPreferences((current) => ({ ...current, hasPet: event.target.checked, petType: event.target.checked ? current.petType ?? 'Dog' : null }))} />Travelling with a pet</label>
        {preferences.hasPet && <SelectField label="Pet type" value={preferences.petType ?? 'Dog'} options={PET_TYPES} disabled={disabled} onChange={(value) => change('petType', value as PetType)} />}
      </div>
      {showCounts && <div className="traveller-counts">{([
        ['Adults', 'adultCount'], ['Babies', 'babyCount'], ['Toddlers', 'toddlerCount'], ['Children', 'childCount'], ['Teenagers', 'teenCount'],
      ] as const).map(([label, key]) => <label key={key}>{label}<input className="clay-input" type="number" min="0" max="20" value={preferences[key]} disabled={disabled} onChange={(event) => change(key, Math.min(20, Math.max(0, Number(event.target.value))))} /></label>)}</div>}
      </div>

      <OptionSection title="Planned activities" options={ACTIVITIES} selected={preferences.activities} disabled={disabled} onToggle={(value) => toggleListValue('activities', value as Activity)} />
      <OptionSection title="Personal packing needs" options={PERSONAL_NEEDS} selected={preferences.personalNeeds} disabled={disabled} onToggle={(value) => toggleListValue('personalNeeds', value as PersonalNeed)} />
      <label className="check-option laundry-option"><input type="checkbox" checked={preferences.hasLaundry} disabled={disabled} onChange={(event) => change('hasLaundry', event.target.checked)} />Laundry available during the trip</label>
      <button className="clay-button generate-button" type="button" disabled={disabled} onClick={() => void generate()}>{disabled ? 'Preparing your list...' : 'Generate my checklist'}</button>
      {message && <p className="generator-message" role="status">{message}</p>}
    </section>
  )
}

type SelectProps = { label: string; value: string; options: readonly string[]; disabled: boolean; onChange: (value: string) => void }
function SelectField({ label, value, options, disabled, onChange }: SelectProps) {
  return <label>{label}<select className="clay-input" value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>
}

type OptionProps = { title: string; options: readonly string[]; selected: readonly string[]; disabled: boolean; onToggle: (value: string) => void }
function OptionSection({ title, options, selected, disabled, onToggle }: OptionProps) {
  return <div className="planner-section"><h3>{title}</h3><div className="option-grid">{options.map((option) => <label className="check-option" key={option}><input type="checkbox" checked={selected.includes(option)} disabled={disabled} onChange={() => onToggle(option)} />{option}</label>)}</div></div>
}

export default PackingPlanner
