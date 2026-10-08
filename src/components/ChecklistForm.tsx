type ChecklistFormProps = {
  item: string
  onItemChange: (item: string) => void
  onAdd: () => void
}

function ChecklistForm({
  item,
  onItemChange,
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
