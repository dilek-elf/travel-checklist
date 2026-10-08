type ChecklistItemProps = {
  item: string
  completed: boolean
  onToggle: (checked: boolean) => void
  onDelete: () => void
}

function ChecklistItem({
  item,
  completed,
  onToggle,
  onDelete,
}: ChecklistItemProps) {
  return (
    <li className={`checklist-item ${completed ? 'is-packed' : ''}`}>
      <label className="clay-checkbox">
        <input
          type="checkbox"
          aria-label={`Mark ${item} complete`}
          checked={completed}
          onChange={(event) => onToggle(event.target.checked)}
        />
        <span aria-hidden="true">✓</span>
      </label>
      <span className="item-token" aria-hidden="true">✦</span>
      <span
        className="item-text"
      >
        {item}
      </span>
      <button
        className="delete-button"
        type="button"
        aria-label={`Delete ${item}`}
        onClick={onDelete}
      >
        ×
      </button>
    </li>
  )
}

export default ChecklistItem
