export interface ChoiceOption {
  value: string;
  /** Visible label, 24px. */
  label: string;
  /** Optional second line at 20px. */
  description?: string;
}

export interface ChoiceListProps {
  /** Question the options answer: "How do you want to be reminded?" */
  label: string;
  /** Two to five options. More than five means the screen is doing too much. */
  options: ChoiceOption[];
  /** Selected value. */
  value?: string;
  onChange?: (value: string) => void;
  /** 1 column (default) or 2 for short labels. Collapses to 1 on phones. */
  columns?: 1 | 2;
}

/**
 * Pick-one list rendered as large bordered buttons with a check mark, instead
 * of small radio circles. Each option is a full-width 56px+ target. Use it for
 * any choice between two and five things.
 */
export function ChoiceList({ label, options, value, onChange, columns = 1 }: ChoiceListProps) {
  return (
    <fieldset className="ernie-choice">
      <legend className="ernie-choice__legend">{label}</legend>
      <div className={`ernie-choice__options${columns === 2 ? ' ernie-choice__options--2' : ''}`} role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={checked}
              className="ernie-choice__option"
              onClick={() => onChange?.(o.value)}
            >
              <span className="ernie-choice__mark" aria-hidden="true">{checked ? '✓' : ''}</span>
              <span className="ernie-choice__text">
                <span>{o.label}</span>
                {o.description ? <span className="ernie-choice__desc">{o.description}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
