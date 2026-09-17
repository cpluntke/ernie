export interface StepsProps {
  /** Short step names in order: ["Choose a person", "Write message", "Send"]. Two to five steps. */
  steps: string[];
  /** Zero-based index of the current step. */
  current: number;
}

/**
 * Progress for a short linear flow: "Step 2 of 3: Write message" in words,
 * plus a segmented bar. Tells the user where they are so nothing has to be
 * remembered from the previous screen.
 */
export function Steps({ steps, current }: StepsProps) {
  const idx = Math.max(0, Math.min(current, steps.length - 1));
  return (
    <div className="ernie-steps">
      <p className="ernie-steps__label">Step {idx + 1} of {steps.length}: {steps[idx]}</p>
      <div className="ernie-steps__track" aria-hidden="true">
        {steps.map((s, i) => <span key={s} className={`ernie-steps__seg${i <= idx ? ' ernie-steps__seg--done' : ''}`} />)}
      </div>
    </div>
  );
}
