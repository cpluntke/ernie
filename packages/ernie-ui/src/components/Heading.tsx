import type { ReactNode } from 'react';

export interface HeadingProps {
  /** 1 = 32px screen title (Screen renders one for you), 2 = 24px section title. */
  level?: 1 | 2;
  children: ReactNode;
}

/** Section heading at 24px or 32px. Use level 2 inside a Screen; Screen already provides the level 1 title. */
export function Heading({ level = 2, children }: HeadingProps) {
  const cls = `ernie-heading ernie-heading--${level}`;
  return level === 1 ? <h1 className={cls}>{children}</h1> : <h2 className={cls}>{children}</h2>;
}
