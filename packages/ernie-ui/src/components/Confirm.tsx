import type { ReactNode } from 'react';
import { useId } from 'react';
import { Button } from './Button';

export interface ConfirmProps {
  /** Show the dialog. */
  open: boolean;
  /** Question in plain words: "Delete this message?" */
  title: string;
  /** What will happen, in one or two sentences. Say whether it can be undone. */
  children?: ReactNode;
  /** Label naming the action: "Yes, delete it". */
  confirmLabel: string;
  /** Default "No, go back". */
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Style the confirm button as destructive. */
  danger?: boolean;
  /** Render in place instead of over the whole screen (for previews and embedded use). */
  inline?: boolean;
}

/**
 * Yes/No confirmation for anything hard to reverse. Both buttons are large,
 * the cancel button is listed first as the safe default, and the copy says in
 * plain words what will happen. Never use a browser confirm() dialog.
 */
export function Confirm({ open, title, children, confirmLabel, cancelLabel = 'No, go back', onConfirm, onCancel, danger, inline }: ConfirmProps) {
  const id = useId();
  if (!open) return null;
  return (
    <div className={`ernie ernie-confirm${inline ? ' ernie-confirm--inline' : ''}`}>
      <div className="ernie-confirm__panel" role="dialog" aria-modal={!inline} aria-labelledby={`${id}-t`}>
        <h2 className="ernie-confirm__title" id={`${id}-t`}>{title}</h2>
        {typeof children === 'string' ? <p className="ernie-text">{children}</p> : children}
        <div className="ernie-confirm__actions">
          <Button variant="secondary" onClick={onCancel} fullWidth>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} fullWidth>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
