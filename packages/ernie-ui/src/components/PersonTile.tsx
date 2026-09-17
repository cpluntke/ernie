import { Button } from './Button';

export interface PersonTileProps {
  /** First name is enough: "Anna". */
  name: string;
  /** Relationship, shown under the name: "Your daughter". */
  relation?: string;
  /** Photo URL. Initials are shown when absent. */
  photoUrl?: string;
  /** Label for the action button, naming the person: "Call Anna". */
  actionLabel: string;
  onAction?: () => void;
  /** Optional decorative icon for the action button. */
  actionIcon?: string;
}

/**
 * A person as a large card: photo or initials, name, relationship, and one
 * big action button that names them ("Call Anna"). Social connection is the
 * strongest motivation for this audience; make people the biggest thing on
 * the screen.
 */
export function PersonTile({ name, relation, photoUrl, actionLabel, onAction, actionIcon }: PersonTileProps) {
  const initials = name.split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="ernie-person">
      <span className="ernie-person__avatar" aria-hidden="true">
        {photoUrl ? <img src={photoUrl} alt="" /> : initials}
      </span>
      <div className="ernie-person__text">
        <p className="ernie-person__name">{name}</p>
        {relation ? <p className="ernie-person__relation">{relation}</p> : null}
      </div>
      <Button onClick={onAction} icon={actionIcon}>{actionLabel}</Button>
    </div>
  );
}
