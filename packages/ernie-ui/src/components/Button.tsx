import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visible label. Say what will happen: "Call Anna", "Send message", "Go back". Required; never icon-only. */
  children: ReactNode;
  /** primary = the one main action on the screen; secondary = everything else; danger = destructive, always pair with Confirm. */
  variant?: 'primary' | 'secondary' | 'danger';
  /** huge = 80px tall with 32px text, for the single most important action on a screen. */
  size?: 'large' | 'huge';
  /** Stretch to the container width. Default on phones for primary actions. */
  fullWidth?: boolean;
  /** Optional decorative icon shown before the label. Never a substitute for the label. */
  icon?: ReactNode;
}

/**
 * Large, high-contrast button with a mandatory text label. Minimum 56px tall,
 * 24px text, 3px border so it reads as tappable. Use one primary button per
 * screen; put it in Screen's actions slot.
 */
export function Button({ children, variant = 'primary', size = 'large', fullWidth, icon, className, type = 'button', ...rest }: ButtonProps) {
  const cls = ['ernie-button', `ernie-button--${variant}`, size === 'huge' && 'ernie-button--huge', fullWidth && 'ernie-button--full', className]
    .filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} {...rest}>
      {icon ? <span className="ernie-button__icon" aria-hidden="true">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
