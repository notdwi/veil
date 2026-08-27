import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

/** Syntax palette: keys read as bone, values carry the state accents. */
export const veilHighlight = HighlightStyle.define([
  { tag: t.propertyName, color: '#f2efe6', fontWeight: '600' },
  { tag: t.string, color: '#24e3b0' },
  { tag: t.number, color: '#ffc12e' },
  { tag: [t.bool, t.null], color: '#ff3d9a', fontWeight: '600' },
  { tag: [t.punctuation, t.separator, t.bracket], color: '#5c584f' },
  { tag: t.comment, color: '#5c584f', fontStyle: 'italic' },
  { tag: t.invalid, color: '#ff2233', textDecoration: 'underline wavy' },
])

export const veilEditorTheme = EditorView.theme(
  {
    '&': { color: '#cfcabd', backgroundColor: 'transparent' },
    '.cm-line': { padding: '0 14px' },
  },
  { dark: true },
)

export const veilTheme = [veilEditorTheme, syntaxHighlighting(veilHighlight)]
