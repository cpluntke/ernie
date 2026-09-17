import { Steps } from 'ernie-ui';

const steps = ['Choose a person', 'Write message', 'Send'];
export const First = () => <div style={{ width: 480 }}><Steps steps={steps} current={0} /></div>;
export const Middle = () => <div style={{ width: 480 }}><Steps steps={steps} current={1} /></div>;
export const Last = () => <div style={{ width: 480 }}><Steps steps={steps} current={2} /></div>;
