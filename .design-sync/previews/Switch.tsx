import { Switch } from 'ernie-ui';

export const Yes = () => <div style={{ width: 420 }}><Switch label="Remind me to call every Sunday?" checked /></div>;
export const No = () => <div style={{ width: 420 }}><Switch label="Remind me to call every Sunday?" checked={false} /></div>;
export const CustomLabels = () => <div style={{ width: 420 }}><Switch label="How loud should the ring be?" checked onLabel="Loud" offLabel="Quiet" /></div>;
