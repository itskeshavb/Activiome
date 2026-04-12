import { useState } from 'react'
import { CalendarIcon, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function DatePickerButton({ date, onDateChange }) {
  const [open, setOpen] = useState(false)

  function handleSelect(newDate) {
    if (newDate) {
      onDateChange(newDate)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-cyan-400 transition-colors group">
          <CalendarIcon size={15} className="text-muted-foreground group-hover:text-cyan-400 transition-colors" />
          {formatDate(date)}
          <ChevronDown size={13} className="text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
