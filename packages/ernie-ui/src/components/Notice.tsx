import type { ReactNode } from 'react';
import { Button } from './Button';

export interface NoticeProps {
  /** success = "Done", error = "Problem", warning = "Careful", info = "Note". Each has an icon AND a word, never colour alone. */
  kind?: 'success' | 'error' | 'warning' | 'info';
  /** Bold first line. Defaults to the kind's word. */
  title?: string;
  /** Plain-language body. For errors, say how to fix it. */
  children?: ReactNode;
  /** Optional action, e.g. "Undo" or "Try again". Renders a secondary Button. Notices never disappear on their own. */
  actionLabel?: string;
  onAction?: () => void;
}

const DEFAULTS: Record<NonNullable<NoticeProps['kind']>, { icon: string; word: string }> = {
  success: { icon: '✓', word: 'Done' },
  error: { icon: '!', word: 'Problem' },
  warning: { icon: '!', word: 'Careful' },
  info: { icon: 'i', word: 'Note' },
};

/**
 * Persistent status message with an icon, a word, and plain text. Use it for
 * confirmations ("Done. Your message was sent.") and errors ("Problem. The
 * phone number needs an area code."). It stays until the user moves on; add
 * an Undo action for anything reversible.
 */
export function Notice({ kind = 'info', title, children, actionLabel, onAction }: NoticeProps) {
  const d = DEFAULTS[kind];
  return (
    <div className={`ernie-notice ernie-notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      <span className="ernie-notice__icon" aria-hidden="true">{d.icon}</span>
      <div className="ernie-notice__body">
        <p className="ernie-notice__title">{title ?? d.word}</p>
        {children ? <div>{typeof children === 'string' ? <p className="ernie-text">{children}</p> : children}</div> : null}
        {actionLabel ? <div className="ernie-notice__action"><Button variant="secondary" onClick={onAction}>{actionLabel}</Button></div> : null}
      </div>
    </div>
  );
}
