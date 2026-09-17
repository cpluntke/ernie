import { Card, Switch, Text } from 'ernie-ui';

export const WithTitle = () => (
  <div style={{ width: 520 }}>
    <Card title="Reminders">
      <Switch label="Remind me to call every Sunday?" checked />
    </Card>
  </div>
);
export const Plain = () => (
  <div style={{ width: 520 }}>
    <Card><Text>Your last call with Anna was yesterday at 4 pm.</Text></Card>
  </div>
);
