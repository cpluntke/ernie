import type { ReactNode } from 'react';
import { Heading } from './Heading';

export interface CardProps {
  /** Optional 24px title. */
  title?: string;
  children?: ReactNode;
}

/** Bordered container that groups related content. Use sparingly; most screens need no cards at all. */
export function Card({ title, children }: CardProps) {
  return (
    <section className="ernie-card">
      {title ? <Heading level={2}>{title}</Heading> : null}
      {children}
    </section>
  );
}
