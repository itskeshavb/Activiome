import { cn } from '@/lib/utils'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function HourNav({ selectedHour, onHourChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {HOURS.map(h => (
        <button
          key={h}
          onClick={() => onHourChange(h)}
          className={cn(
            'px-2.5 py-1 rounded-full text-xs font-medium transition-all',
            h === selectedHour
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {String(h).padStart(2, '0')}
        </button>
      ))}
    </div>
  )
}
