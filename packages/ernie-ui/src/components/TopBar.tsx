import type { ReactNode } from 'react';
import { Button } from './Button';

export interface TopBarProps {
  /** Called when the user taps Back. Omit only on the very first screen. */
  onBack?: () => void;
  /** Label for the back button. Default "Go back". */
  backLabel?: string;
  /** Called when the user taps the home button, which returns to the start screen. */
  onHome?: () => void;
  /** Label for the home button. Default "Start". */
  homeLabel?: string;
  /** Short title shown in the bar. Prefer putting the main title in Screen instead. */
  title?: ReactNode;
}

/**
 * Bar at the top of every screen with a large "Go back" and "Start" button in
 * the same place every time. Older users fear dead ends; this bar is the promise
 * that there is always a way out. Screen renders it for you.
 */
export function TopBar({ onBack, backLabel = 'Go back', onHome, homeLabel = 'Start', title }: TopBarProps) {
  return (
    <header className="ernie-topbar">
      {onBack ? <Button variant="secondary" onClick={onBack} icon="←">{backLabel}</Button> : null}
      {title ? <h2 className="ernie-topbar__title">{title}</h2> : null}
      <span className="ernie-topbar__spacer" />
      {onHome ? <Button variant="secondary" onClick={onHome} icon="⌂">{homeLabel}</Button> : null}
    </header>
  );
}
