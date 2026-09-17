import { PersonTile } from 'ernie-ui';

export const WithRelation = () => <div style={{ width: 560 }}><PersonTile name="Anna" relation="Your daughter" actionLabel="Call Anna" actionIcon="☎" onAction={() => {}} /></div>;
export const Initials = () => <div style={{ width: 560 }}><PersonTile name="Ben Okafor" relation="Your neighbour" actionLabel="Message Ben" onAction={() => {}} /></div>;
export const NoRelation = () => <div style={{ width: 560 }}><PersonTile name="Dr Patel" actionLabel="Call Dr Patel" actionIcon="☎" onAction={() => {}} /></div>;
