import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LANGUAGES, type LanguageCode } from '@/lib/prefs'

interface LanguagePickerProps {
  value: LanguageCode
  onChange(language: LanguageCode): void
}

export function LanguagePicker({ value, onChange }: LanguagePickerProps) {
  return (
    <div className="flex flex-col">
      {LANGUAGES.map((language) => {
        const active = language.code === value
        return (
          <button
            key={language.code}
            onClick={() => onChange(language.code)}
            className={cn(
              'group relative flex items-center gap-3 py-[7px] pr-3 pl-3',
              'transition-transform duration-(--t-tick) ease-(--ease-snap)',
              active ? 'translate-x-[3px]' : 'hover:translate-x-[2px]',
            )}
          >
            {active && (
              <span aria-hidden className="skew-bar absolute inset-y-0 left-0 right-2 -z-10 bg-ink-4" />
            )}
            <span
              aria-hidden
              className={cn('h-[13px] w-[3px] shrink-0 skew-bar', active ? 'bg-crimson' : 'bg-hairline')}
            />
            <span className={cn('text-[12px]', active ? 'font-semibold text-bone' : 'text-bone-2')}>
              {language.native}
            </span>
            <span className="type-label text-[8.5px] text-bone-4">{language.code}</span>
            {active && <Check size={12} strokeWidth={2.6} className="ml-auto text-crimson" />}
          </button>
        )
      })}
    </div>
  )
}
