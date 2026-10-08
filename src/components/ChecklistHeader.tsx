import heroImage from '../assets/mediterranean-hero.jpg'

type ChecklistHeaderProps = {
  compact?: boolean
}

function ChecklistHeader({ compact = false }: ChecklistHeaderProps) {
  return (
    <header className={`hero-panel ${compact ? 'hero-panel-compact' : ''}`}>
      <img
        className="hero-photo"
        src={heroImage}
        alt="A Mediterranean coast with travel essentials ready to pack"
      />
      <div className="hero-shade" />
      <div className="hero-copy">
        <p className="eyebrow">Plan less. Experience more.</p>
        <h1>Travel Checklist</h1>
        <p>
          Everything you need for the journey, remembered in one calm place.
        </p>
      </div>
    </header>
  )
}

export default ChecklistHeader
