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
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
      <input
        className="w-full min-w-0 flex-1 rounded-2xl border border-[#d8c0af] bg-[#fcf7f2] px-4 py-3.5 text-[#3f2b20] outline-none transition placeholder:text-sm placeholder:text-[#ad9383] focus:border-[#8b6048] focus:ring-4 focus:ring-[#c9a995]/25 min-[380px]:px-5 min-[380px]:placeholder:text-base"
        aria-label="Checklist item"
        placeholder="What do you need to pack?"
        value={item}
        onChange={(event) => onItemChange(event.target.value)}
      />
      <button
        className="w-full rounded-2xl bg-[#6f4935] px-6 py-3.5 font-semibold text-[#fffaf5] shadow-sm transition hover:bg-[#593827] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4935] active:translate-y-px sm:w-auto"
        type="button"
        onClick={onAdd}
      >
        Add item
      </button>
    </div>
  )
}

export default ChecklistForm
