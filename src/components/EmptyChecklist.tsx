function EmptyChecklist() {
  return (
    <div className="rounded-2xl border border-dashed border-[#d9c3b3] bg-[#fbf4ed] px-4 py-8 text-center min-[380px]:px-6 min-[380px]:py-10">
      <div className="mb-3 text-2xl" aria-hidden="true">
        ✦
      </div>
      <p className="font-medium text-[#604535]">Your list is ready.</p>
      <p className="mt-1 text-sm text-[#927766]">
        Add your first travel essential above.
      </p>
    </div>
  )
}

export default EmptyChecklist
