import { ITEM_CATEGORIES, type ItemCategory } from '../api/checklistApi'

type ChecklistFormProps = {
  item: string
  category: ItemCategory
  onItemChange: (item: string) => void
  onCategoryChange: (category: ItemCategory) => void
  onAdd: () => void
}

function ChecklistForm({
  item,
  category,
  onItemChange,
  onCategoryChange,
  onAdd,
}: ChecklistFormProps) {
  return (
    <div className="checklist-form">
      <input
        className="clay-input checklist-input"
        aria-label="Checklist item"
        placeholder="What do you need to pack?"
        value={item}
        onChange={(event) => onItemChange(event.target.value)}
      />
      <select
        className="clay-input category-select"
        aria-label="Item category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value as ItemCategory)}
      >
        {ITEM_CATEGORIES.map((categoryName) => (
          <option key={categoryName} value={categoryName}>
            {categoryName}
          </option>
        ))}
      </select>
      <button
        className="clay-button"
        type="button"
        onClick={onAdd}
      >
        Add item
      </button>
    </div>
  )
}

export default ChecklistForm
