import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Screen, Text, TextField, ChoiceList, PersonTile, Notice, Steps, Switch, Card, Confirm } from '../src';

function App() {
  const [who, setWho] = useState('anna');
  const [remind, setRemind] = useState(true);
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState(false);
  return (
    <Screen
      title="Who do you want to call?"
      onBack={() => history.back()}
      onHome={() => location.assign('/')}
      actions={<Button size="huge" fullWidth onClick={() => setConfirm(true)}>Call Anna</Button>}
    >
      <Steps steps={['Choose a person', 'Check the number', 'Call']} current={0} />
      <Text size="large">Tap the person you want to call. You can change your mind on the next screen.</Text>
      <PersonTile name="Anna" relation="Your daughter" actionLabel="Call Anna" actionIcon="☎" />
      <PersonTile name="Ben Okafor" relation="Your neighbour" actionLabel="Call Ben" actionIcon="☎" />
      <Notice kind="success">Your last call with Anna was yesterday at 4 pm.</Notice>
      <Notice kind="error" title="Problem" actionLabel="Try again">The call did not connect. Check the phone is not on silent, then try again.</Notice>
      <Card title="Reminders">
        <Switch label="Remind me to call every Sunday?" checked={remind} onChange={setRemind} />
        <ChoiceList label="How should we remind you?" value={who} onChange={setWho} options={[
          { value: 'anna', label: 'A message on this screen' },
          { value: 'ring', label: 'A ring, like a phone call', description: 'Loud, with a flashing screen' },
        ]} />
        <TextField label="Anna's phone number" hint="Just the numbers. Spaces are fine." value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" error={phone && phone.replace(/\D/g, '').length < 10 ? 'Please add the area code, so the number has 10 digits.' : undefined} />
      </Card>
      <Confirm open={confirm} title="Call Anna now?" confirmLabel="Yes, call Anna" onCancel={() => setConfirm(false)} onConfirm={() => setConfirm(false)}>Her phone will ring. You can hang up at any time.</Confirm>
    </Screen>
  );
}
createRoot(document.getElementById('root')!).render(<App />);
