type ProgressCardProps = {
  completed: number
  total: number
}

function ProgressCard({ completed, total }: ProgressCardProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  const remaining = total - completed

  return (
    <aside className="clay-card progress-card" aria-label="Packing progress">
      <div className="progress-card-heading">
        <div>
          <p className="eyebrow">Packing progress</p>
          <p className="progress-number">{percentage}%</p>
          <p className="progress-label">packed and ready</p>
        </div>

        <div
          className="progress-ring"
          style={{ '--progress': `${percentage * 3.6}deg` } as React.CSSProperties}
          aria-label={`${percentage}% packed`}
        >
          <div className="progress-ring-center">
            <span className="mini-case">▣</span>
          </div>
        </div>
      </div>

      <div className="progress-stats">
        <div>
          <span className="stat-dot stat-dot-packed" />
          <span>Packed items</span>
          <strong>{completed}</strong>
        </div>
        <div>
          <span className="stat-dot stat-dot-left" />
          <span>Still to pack</span>
          <strong>{remaining}</strong>
        </div>
        <div className="progress-total">
          <span>Total essentials</span>
          <strong>{total}</strong>
        </div>
      </div>

      <p className="progress-note">
        {total === 0
          ? 'Add your first essential to begin.'
          : remaining === 0
            ? 'All packed. Your adventure is calling!'
            : 'A little progress is still progress.'}
      </p>
    </aside>
  )
}

export default ProgressCard
