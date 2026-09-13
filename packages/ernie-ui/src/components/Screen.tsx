import type { ReactNode } from 'react';
import { TopBar } from './TopBar';

export interface ScreenProps {
  /** The one thing this screen is for, as a plain sentence: "Who do you want to call?" */
  title: ReactNode;
  /** Screen content. Keep to one task; fewer than five tappable things. */
  children?: ReactNode;
  /** The primary action (usually one Button, sometimes plus a secondary). Rendered in a sticky footer. */
  actions?: ReactNode;
  /** Back handler. Omit only on the first screen. */
  onBack?: () => void;
  /** Home handler, returns to the start screen. */
  onHome?: () => void;
  backLabel?: string;
  homeLabel?: string;
}

/**
 * Page layout for one task: a TopBar with Back and Start, a large title, a
 * narrow readable body, and a sticky footer holding the primary action.
 * Every screen in the app should be a Screen.
 */
export function Screen({ title, children, actions, onBack, onHome, backLabel, homeLabel }: ScreenProps) {
  return (
    <div className="ernie ernie-screen">
      {(onBack || onHome) ? <TopBar onBack={onBack} onHome={onHome} backLabel={backLabel} homeLabel={homeLabel} /> : null}
      <main className="ernie-screen__body">
        <h1 className="ernie-screen__title">{title}</h1>
        {children}
      </main>
      {actions ? (
        <footer className="ernie-screen__actions">
          <div className="ernie-screen__actions-inner">{actions}</div>
        </footer>
      ) : null}
    </div>
  );
}
