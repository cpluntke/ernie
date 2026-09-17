import type { ReactNode } from 'react';

export interface TextProps {
  /** normal = 20px, large = 24px for the one sentence that matters most. */
  size?: 'normal' | 'large';
  children: ReactNode;
}

/** Body paragraph at 20px, line height 1.5, capped at about 65 characters per line. One idea per paragraph. */
export function Text({ size = 'normal', children }: TextProps) {
  return <p className={`ernie-text${size === 'large' ? ' ernie-text--large' : ''}`}>{children}</p>;
}
