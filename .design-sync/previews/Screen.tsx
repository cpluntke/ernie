import { Screen, Button, Text, PersonTile, Steps } from 'ernie-ui';

export const ChoosePerson = () => (
  <Screen title="Who do you want to call?" onBack={() => {}} onHome={() => {}}
    actions={<Button size="huge" fullWidth onClick={() => {}}>Call Anna</Button>}>
    <Steps steps={['Choose a person', 'Check the number', 'Call']} current={0} />
    <Text size="large">Tap the person you want to call.</Text>
    <PersonTile name="Anna" relation="Your daughter" actionLabel="Call Anna" actionIcon="☎" onAction={() => {}} />
    <PersonTile name="Ben Okafor" relation="Your neighbour" actionLabel="Call Ben" actionIcon="☎" onAction={() => {}} />
  </Screen>
);

export const FirstScreen = () => (
  <Screen title="Good morning, Margaret" actions={<Button size="huge" fullWidth onClick={() => {}}>Call someone</Button>}>
    <Text size="large">Tap the big button to call one of your people.</Text>
  </Screen>
);
