import { ChoiceList } from 'ernie-ui';

const options = [
  { value: 'screen', label: 'A message on this screen' },
  { value: 'ring', label: 'A ring, like a phone call', description: 'Loud, with a flashing screen' },
  { value: 'none', label: 'Do not remind me' },
];

export const Selected = () => <div style={{ width: 480 }}><ChoiceList label="How should we remind you?" options={options} value="screen" /></div>;
export const NothingChosen = () => <div style={{ width: 480 }}><ChoiceList label="How should we remind you?" options={options} /></div>;
export const TwoColumns = () => (
  <div style={{ width: 480 }}>
    <ChoiceList label="When?" columns={2} value="morning" options={[
      { value: 'morning', label: 'Morning' }, { value: 'evening', label: 'Evening' },
    ]} />
  </div>
);
