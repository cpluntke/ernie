import { Confirm } from 'ernie-ui';

export const CallNow = () => (
  <div style={{ width: 600 }}>
    <Confirm open inline title="Call Anna now?" confirmLabel="Yes, call Anna" onCancel={() => {}} onConfirm={() => {}}>
      Her phone will ring. You can hang up at any time.
    </Confirm>
  </div>
);
export const DeleteDanger = () => (
  <div style={{ width: 600 }}>
    <Confirm open inline danger title="Delete this message?" confirmLabel="Yes, delete it" onCancel={() => {}} onConfirm={() => {}}>
      The message will be gone for good. You cannot undo this.
    </Confirm>
  </div>
);
