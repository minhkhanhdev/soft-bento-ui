import { useEffect, useState } from 'react';
import { Calendar, DateField, DatePicker, FieldError, Input, Label, Popover, TextField, Button } from '@heroui/react';
import { parseDate, parseDateTime } from '@internationalized/date';
import { I18nProvider } from 'react-aria-components';
import { CalendarDays } from 'lucide-react';
import { BentoIcon } from '../soft-bento';

export function localDateTimeValue(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function CalendarContents() {
  return <>
    <Calendar.Header>
      <Calendar.YearPickerTrigger><Calendar.YearPickerTriggerHeading /><Calendar.YearPickerTriggerIndicator /></Calendar.YearPickerTrigger>
      <Calendar.NavButton slot="previous" aria-label="Tháng trước" />
      <Calendar.NavButton slot="next" aria-label="Tháng sau" />
    </Calendar.Header>
    <Calendar.Grid>
      <Calendar.GridHeader>{day => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
      <Calendar.GridBody>{date => <Calendar.Cell date={date} />}</Calendar.GridBody>
    </Calendar.Grid>
    <Calendar.YearPickerGrid><Calendar.YearPickerGridBody>{({ year }) => <Calendar.YearPickerCell year={year} />}</Calendar.YearPickerGridBody></Calendar.YearPickerGrid>
  </>;
}

/** Local wall-clock values keep the existing datetime-local contract; no timezone conversion here. */
export function DateTimeControl({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  let parsed;
  try { parsed = value ? parseDateTime(value) : null; } catch { parsed = null; }
  return <I18nProvider locale="vi-VN">
    <DatePicker value={parsed} onChange={date => onChange(date?.toString() ?? '')} granularity="minute" hourCycle={24} isRequired className="standard-date-control">
      <Label>{label}</Label>
      <DateField.Group fullWidth>
        <DateField.Input>{segment => <DateField.Segment segment={segment} />}</DateField.Input>
        <DateField.Suffix><DatePicker.Trigger aria-label="Mở lịch"><DatePicker.TriggerIndicator /></DatePicker.Trigger></DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover><Calendar aria-label={label}><CalendarContents /></Calendar></DatePicker.Popover>
    </DatePicker>
  </I18nProvider>;
}

function parseMonth(text: string) {
  const iso = /^(\d{4})-(\d{2})$/.exec(text);
  const local = /^(\d{2})\/(\d{4})$/.exec(text);
  const year = iso?.[1] ?? local?.[2];
  const month = iso?.[2] ?? local?.[1];
  return year && month && Number(year) >= 1900 && Number(year) <= 2100 && Number(month) >= 1 && Number(month) <= 12 ? `${year}-${month}` : null;
}
const displayMonth = (month: string) => `${month.slice(5, 7)}/${month.slice(0, 4)}`;

/** The selected day chooses a month; summaries still cover that entire calendar month. */
export function MonthControl({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (month: string) => void;
  compact?: boolean;
}) {
  const [raw, setRaw] = useState(() => displayMonth(value));
  const [open, setOpen] = useState(false);
  useEffect(() => { setRaw(displayMonth(value)); }, [value]);
  const invalid = !parseMonth(raw);
  return <div className={`month-control ${compact ? 'month-control-compact' : ''}`.trim()}>
    <TextField isInvalid={invalid} className="finance-period-field">
      <Label className={compact ? 'sr-only' : undefined}>Kỳ thu chi</Label>
      <div className="month-control-row">
        <Input value={raw} placeholder="MM/YYYY" onChange={event => {
          const text = event.target.value;
          setRaw(text);
          const month = parseMonth(text);
          if (month) onChange(month);
        }} />
        <Popover isOpen={open} onOpenChange={setOpen}>
          <Button isIconOnly variant="secondary" aria-label="Chọn tháng thu chi"><BentoIcon icon={CalendarDays} size={18} /></Button>
          <Popover.Content className="standard-calendar-popover"><Popover.Dialog aria-label="Chọn tháng thu chi">
            <p className="calendar-help">Chọn một ngày trong tháng cần xem.</p>
            <I18nProvider locale="vi-VN"><Calendar aria-label="Lịch kỳ thu chi" value={parseDate(`${value}-01`)} minValue={parseDate('1900-01-01')} maxValue={parseDate('2100-12-31')}
              onChange={date => { onChange(date.toString().slice(0, 7)); setRaw(displayMonth(date.toString().slice(0, 7))); setOpen(false); }}>
              <CalendarContents />
            </Calendar></I18nProvider>
          </Popover.Dialog></Popover.Content>
        </Popover>
      </div>
      {invalid && <FieldError>Nhập tháng/năm, ví dụ 11/2026.</FieldError>}
    </TextField>
  </div>;
}
