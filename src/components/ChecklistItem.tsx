import { useState } from 'react'

type ChecklistItemProps = {
  item: string
  category: string
  completed: boolean
  onToggle: (checked: boolean) => void
  onEdit: (text: string) => Promise<boolean>
  onDelete: () => void
}

function ChecklistItem({
  item,
  category,
  completed,
  onToggle,
  onEdit,
  onDelete,
}: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState(item)

  const saveEdit = async () => {
    const text = editedItem.trim()
    if (!text) return

    const wasSaved = await onEdit(text)
    if (wasSaved) setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditedItem(item)
    setIsEditing(false)
  }

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
      {isEditing ? (
        <form
          className="item-edit-form"
          onSubmit={(event) => {
            event.preventDefault()
            void saveEdit()
          }}
        >
          <input
            aria-label={`Edit ${item}`}
            autoFocus
            maxLength={200}
            value={editedItem}
            onChange={(event) => setEditedItem(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') cancelEdit()
            }}
          />
          <button className="item-action-button save-button" type="submit">
            Save
          </button>
          <button
            className="item-action-button"
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <span className="item-copy">
            <span className="item-text">{item}</span>
            <span className="item-category">{category}</span>
          </span>
          <button
            className="item-action-button"
            type="button"
            aria-label={`Edit ${item}`}
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
          <button
            className="delete-button"
            type="button"
            aria-label={`Delete ${item}`}
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}
    </li>
  )
}

export default ChecklistItem
