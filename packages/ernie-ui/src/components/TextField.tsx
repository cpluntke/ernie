import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  /** Always-visible label above the field. Required; placeholders are not labels. */
  label: string;
  /** Short help shown under the label, e.g. "Just the numbers, spaces are fine." */
  hint?: string;
  /** Plain-language error shown next to the field with how to fix it: "Please add the area code." */
  error?: string;
  id?: string;
}

/**
 * Single-line input with a visible label, optional hint, and an inline error
 * that says what to do. 56px tall, 24px text, 3px border. Accept input
 * flexibly (spaces in phone numbers, any date order) and validate gently.
 */
export function TextField({ label, hint, error, id, ...rest }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? `ernie-field-${autoId}`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  return (
    <div className={`ernie-field${error ? ' ernie-field--error' : ''}`}>
      <label className="ernie-field__label" htmlFor={fieldId}>{label}</label>
      {hint ? <span className="ernie-field__hint" id={hintId}>{hint}</span> : null}
      <input
        className="ernie-field__input"
        id={fieldId}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error ? (
        <span className="ernie-field__error" id={errorId} role="alert">
          <span aria-hidden="true">!</span>
          <span>{error}</span>
        </span>
      ) : null}
    </div>
  );
}
