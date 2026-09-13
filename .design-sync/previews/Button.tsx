import { Button } from 'ernie-ui';

export const Primary = () => <Button onClick={() => {}}>Call Anna</Button>;
export const Secondary = () => <Button variant="secondary" icon="←" onClick={() => {}}>Go back</Button>;
export const Danger = () => <Button variant="danger" onClick={() => {}}>Delete this message</Button>;
export const HugeFullWidth = () => <div style={{ width: 360 }}><Button size="huge" fullWidth onClick={() => {}}>Call Anna</Button></div>;
export const Disabled = () => <Button disabled>Send message</Button>;
