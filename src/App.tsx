import { useEffect, useState } from 'react'
import ChecklistForm from './components/ChecklistForm'
import ChecklistHeader from './components/ChecklistHeader'
import ChecklistItem from './components/ChecklistItem'
import EmptyChecklist from './components/EmptyChecklist'

const STORAGE_KEY = 'travel-checklist'

type StoredChecklist = {
  items: string[]
  completedItems: number[]
}

const emptyChecklist: StoredChecklist = {
  items: [],
  completedItems: [],
}

function loadChecklist(): StoredChecklist {
  try {
    const storedChecklist = localStorage.getItem(STORAGE_KEY)
    if (!storedChecklist) return emptyChecklist

    const parsedChecklist = JSON.parse(storedChecklist) as Partial<StoredChecklist>
    const items = Array.isArray(parsedChecklist.items)
      ? parsedChecklist.items.filter((item) => typeof item === 'string')
      : []
    const completedItems = Array.isArray(parsedChecklist.completedItems)
      ? parsedChecklist.completedItems.filter(
          (index) =>
            Number.isInteger(index) && index >= 0 && index < items.length,
        )
      : []

    return {
      items,
      completedItems: [...new Set(completedItems)],
    }
  } catch {
    return emptyChecklist
  }
}

function App() {
  const [storedChecklist] = useState(loadChecklist)
  const [item, setItem] = useState('')
  const [items, setItems] = useState<string[]>(storedChecklist.items)
  const [completedItems, setCompletedItems] = useState<number[]>(
    storedChecklist.completedItems,
  )

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ items, completedItems }),
    )
  }, [items, completedItems])

  const addItem = () => {
    if (!item.trim()) return

    setItems((items) => [...items, item])
    setItem('')
  }

  const toggleItem = (index: number, checked: boolean) => {
    setCompletedItems((completedItems) =>
      checked
        ? [...completedItems, index]
        : completedItems.filter((itemIndex) => itemIndex !== index),
    )
  }

  const deleteItem = (index: number) => {
    setItems((items) => items.filter((_, itemIndex) => itemIndex !== index))
    setCompletedItems((completedItems) =>
      completedItems
        .filter((itemIndex) => itemIndex !== index)
        .map((itemIndex) => (itemIndex > index ? itemIndex - 1 : itemIndex)),
    )
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-3 py-6 text-[#3f2b20] min-[380px]:px-4 min-[380px]:py-8 sm:px-6 sm:py-16">
      <div className="mx-auto min-w-0 max-w-2xl">
        <ChecklistHeader />

        <section
          className="min-w-0 rounded-3xl border border-[#e4d2c3] bg-[#fffaf5]/95 p-4 shadow-[0_18px_45px_rgba(88,57,40,0.1)] min-[380px]:p-5 sm:rounded-[2rem] sm:p-8 sm:shadow-[0_24px_60px_rgba(88,57,40,0.12)]"
          aria-label="Travel checklist"
        >
          <ChecklistForm
            item={item}
            onItemChange={setItem}
            onAdd={addItem}
          />

          <div className="my-6 h-px bg-[#eadbd0]" />

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#493126] min-[380px]:text-xl">
              Your essentials
            </h2>
            <span className="shrink-0 rounded-full bg-[#efe1d5] px-3 py-1 text-xs font-semibold whitespace-nowrap text-[#76513e]">
              {completedItems.length} of {items.length} packed
            </span>
          </div>

          {items.length === 0 ? (
            <EmptyChecklist />
          ) : (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <ChecklistItem
                  key={`${item}-${index}`}
                  item={item}
                  completed={completedItems.includes(index)}
                  onToggle={(checked) => toggleItem(index, checked)}
                  onDelete={() => deleteItem(index)}
                />
              ))}
            </ul>
          )}
        </section>

        <p className="mt-6 text-center text-xs tracking-wide text-[#9b8171]">
          Take only what you need. Leave room for memories.
        </p>
      </div>
    </main>
  )
}

export default App
