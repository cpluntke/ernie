import { Notice } from 'ernie-ui';

export const Success = () => <div style={{ width: 520 }}><Notice kind="success">Your message was sent to Anna.</Notice></div>;
export const ErrorWithRetry = () => (
  <div style={{ width: 520 }}>
    <Notice kind="error" actionLabel="Try again" onAction={() => {}}>The call did not connect. Check the phone is not on silent, then try again.</Notice>
  </div>
);
export const Warning = () => <div style={{ width: 520 }}><Notice kind="warning">The battery is low. Plug the phone in soon.</Notice></div>;
export const InfoWithUndo = () => (
  <div style={{ width: 520 }}>
    <Notice kind="info" actionLabel="Undo" onAction={() => {}}>Ben was removed from your people.</Notice>
  </div>
);
