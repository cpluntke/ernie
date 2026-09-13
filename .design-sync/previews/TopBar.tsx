import { TopBar } from 'ernie-ui';

export const BackAndStart = () => <div style={{ width: 600 }}><TopBar onBack={() => {}} onHome={() => {}} /></div>;
export const WithTitle = () => <div style={{ width: 600 }}><TopBar onBack={() => {}} onHome={() => {}} title="Your people" /></div>;
export const BackOnly = () => <div style={{ width: 600 }}><TopBar onBack={() => {}} backLabel="Back to people" /></div>;
