function ChecklistHeader() {
  return (
    <header className="mb-6 px-1 text-center sm:mb-8">
      <p className="mb-3 text-[0.7rem] font-semibold tracking-[0.24em] text-[#9a7058] uppercase min-[380px]:text-xs min-[380px]:tracking-[0.3em]">
        Pack with ease
      </p>
      <h1 className="font-serif text-[clamp(2.15rem,11vw,3rem)] leading-[1.05] font-semibold tracking-tight text-[#3b271d]">
        Travel Checklist
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7a6153] min-[380px]:mt-4 sm:text-base">
        A calm little place for everything you need before you go.
      </p>
    </header>
  )
}

export default ChecklistHeader
