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
    <li className="group flex min-w-0 items-center gap-2.5 rounded-2xl border border-[#eadbd0] bg-[#fcf7f2] px-3 py-3.5 transition hover:border-[#d6bdac] hover:bg-[#faf1e9] min-[380px]:gap-3 min-[380px]:px-4">
      <input
        className="h-5 w-5 shrink-0 cursor-pointer rounded border-[#b99884] accent-[#704b38] focus:ring-2 focus:ring-[#b98f76] focus:ring-offset-2 focus:ring-offset-[#fcf7f2]"
        type="checkbox"
        aria-label={`Mark ${item} complete`}
        checked={completed}
        onChange={(event) => onToggle(event.target.checked)}
      />
      <span
        className={`min-w-0 flex-1 break-words text-sm min-[380px]:text-base ${
          completed ? 'text-[#a38b7c]' : 'text-[#4b3327]'
        }`}
      >
        {item}
      </span>
      <button
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[#9b7b68] transition hover:bg-[#ead8ca] hover:text-[#694531] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b6048]"
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
