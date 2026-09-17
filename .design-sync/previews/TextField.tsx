import { TextField } from 'ernie-ui';

export const WithHint = () => (
  <div style={{ width: 420 }}>
    <TextField label="Anna's phone number" hint="Just the numbers. Spaces are fine." inputMode="tel" defaultValue="" />
  </div>
);
export const Filled = () => (
  <div style={{ width: 420 }}>
    <TextField label="Your first name" defaultValue="Margaret" autoComplete="given-name" />
  </div>
);
export const WithError = () => (
  <div style={{ width: 420 }}>
    <TextField label="Anna's phone number" inputMode="tel" defaultValue="555 0123"
      error="Please add the area code, so the number has 10 digits." />
  </div>
);
