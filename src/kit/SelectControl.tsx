import { Children, isValidElement, type ReactNode } from 'react';
import { ListBox, Select } from '@heroui/react';

/** Option children describe choices; HeroUI renders the trigger, listbox and keyboard behavior. */
export function SelectControl({ value, onValueChange, children, 'aria-label': label, isRequired = false }: {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  'aria-label': string;
  isRequired?: boolean;
}) {
  const options = Children.toArray(children).flatMap(child => {
    if (!isValidElement<{ value: string; children: ReactNode; disabled?: boolean }>(child)) return [];
    return [{ key: child.props.value || '__empty__', text: Children.toArray(child.props.children).join(''), disabled: child.props.disabled }];
  });
  return <Select className="standard-select-control" aria-label={label} isRequired={isRequired}
    value={value || '__empty__'} onChange={key => onValueChange(key === '__empty__' ? '' : String(key))}>
    <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
    <Select.Popover><ListBox>{options.map(option =>
      <ListBox.Item key={option.key} id={option.key} textValue={option.text} isDisabled={option.disabled}>
        {option.text}<ListBox.ItemIndicator />
      </ListBox.Item>
    )}</ListBox></Select.Popover>
  </Select>;
}
