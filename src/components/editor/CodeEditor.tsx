import { useMemo } from 'react'
import CodeMirror, { type ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { EditorView } from '@codemirror/view'
import { search } from '@codemirror/search'
import { cn } from '@/lib/cn'
import { veilTheme } from './theme'

interface CodeEditorProps {
  value: string
  onChange?(value: string): void
  language?: 'json' | 'text'
  readOnly?: boolean
  placeholder?: string
  className?: string
  height?: string
}

const BASIC: ReactCodeMirrorProps['basicSetup'] = {
  lineNumbers: true,
  foldGutter: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: false,
  searchKeymap: true,
  highlightSelectionMatches: false,
}

export function CodeEditor({
  value,
  onChange,
  language = 'json',
  readOnly = false,
  placeholder,
  className,
  height = '100%',
}: CodeEditorProps) {
  const extensions = useMemo(() => {
    const base = [EditorView.lineWrapping, search({ top: false })]
    return language === 'json' ? [...base, json()] : base
  }, [language])

  return (
    <div className={cn('veil-editor h-full min-h-0', className)}>
      <CodeMirror
        value={value}
        height={height}
        theme={veilTheme}
        extensions={extensions}
        basicSetup={BASIC}
        readOnly={readOnly}
        editable={!readOnly}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  )
}
