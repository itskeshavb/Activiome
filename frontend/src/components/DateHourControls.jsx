import DatePickerButton from './DatePickerButton'
import HourNav from './HourNav'

export default function DateHourControls({ date, hour, onDateChange, onHourChange }) {
  return (
    <div className="bg-[#0a1525] border-b border-white/[0.06] px-6 py-4 flex flex-col gap-4">
      <DatePickerButton date={date} onDateChange={onDateChange} />
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Hour
        </span>
        <HourNav selectedHour={hour} onHourChange={onHourChange} />
      </div>
    </div>
  )
}
