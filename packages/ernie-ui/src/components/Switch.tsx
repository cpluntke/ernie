export interface SwitchProps {
  /** The question, as a sentence: "Remind me every morning?" */
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Default "Yes". */
  onLabel?: string;
  /** Default "No". */
  offLabel?: string;
}

/**
 * Yes / No choice as two large labelled buttons, replacing the small toggle
 * switch. The current answer is filled in; the labels say what each side
 * means so state is never conveyed by position or colour alone.
 */
export function Switch({ label, checked, onChange, onLabel = 'Yes', offLabel = 'No' }: SwitchProps) {
  return (
    <fieldset className="ernie-switch">
      <legend className="ernie-switch__legend">{label}</legend>
      <div className="ernie-switch__options">
        <button type="button" className="ernie-switch__option" aria-pressed={checked} onClick={() => onChange?.(true)}>{onLabel}</button>
        <button type="button" className="ernie-switch__option" aria-pressed={!checked} onClick={() => onChange?.(false)}>{offLabel}</button>
      </div>
    </fieldset>
  );
}
