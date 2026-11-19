import { Button, Modal, RangeCalendar, Typography } from '@heroui/react';
import { parseDate } from '@internationalized/date';
import { I18nProvider } from 'react-aria-components';

export { PreviewDialog, type DialogState } from '../soft-bento';

/** Parse ISO YYYY-MM-DD safely without throwing on empty or malformed input. */
function safeParseDate(value: string, fallback: string) {
  try {
    return parseDate(value);
  } catch {
    return parseDate(fallback);
  }
}

export function RangeDialog({
  isOpen,
  onOpenChange,
  pendingFrom,
  pendingTo,
  onChange,
  onApply,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pendingFrom: string;
  pendingTo: string;
  onChange: (from: string, to: string) => void;
  onApply: () => void;
}) {
  const isValid =
    !!pendingFrom &&
    !!pendingTo &&
    pendingFrom <= pendingTo &&
    pendingFrom >= '1900-01-01' &&
    pendingTo <= '2100-12-31';

  const parsedStart = safeParseDate(pendingFrom, '2026-11-01');
  const parsedEnd = safeParseDate(pendingTo, '2026-11-10');
  const rangeValue =
    parsedStart.compare(parsedEnd) <= 0
      ? { start: parsedStart, end: parsedEnd }
      : { start: parsedEnd, end: parsedStart };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="preview-dialog range-dialog">
            <Modal.CloseTrigger aria-label="Đóng chọn ngày" />
            <Modal.Header>
              <Modal.Heading>Khoảng báo cáo</Modal.Heading>
              <Typography type="body-xs" color="muted" className="dialog-description">
                Chỉ áp dụng cho chỉ số và biểu đồ.
              </Typography>
            </Modal.Header>
            <Modal.Body>
              <I18nProvider locale="vi-VN">
                <RangeCalendar
                  aria-label="Khoảng ngày báo cáo"
                  firstDayOfWeek="mon"
                  minValue={parseDate('1900-01-01')}
                  maxValue={parseDate('2100-12-31')}
                  value={rangeValue}
                  onChange={value => {
                    if (value?.start && value?.end) {
                      onChange(value.start.toString(), value.end.toString());
                    }
                  }}
                >
                  <RangeCalendar.Header>
                    <RangeCalendar.YearPickerTrigger>
                      <RangeCalendar.YearPickerTriggerHeading />
                      <RangeCalendar.YearPickerTriggerIndicator />
                    </RangeCalendar.YearPickerTrigger>
                    <RangeCalendar.NavButton slot="previous" aria-label="Tháng trước" />
                    <RangeCalendar.NavButton slot="next" aria-label="Tháng sau" />
                  </RangeCalendar.Header>
                  <RangeCalendar.Grid>
                    <RangeCalendar.GridHeader>
                      {day => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                    </RangeCalendar.GridHeader>
                    <RangeCalendar.GridBody>
                      {date => <RangeCalendar.Cell date={date} />}
                    </RangeCalendar.GridBody>
                  </RangeCalendar.Grid>
                  <RangeCalendar.YearPickerGrid>
                    <RangeCalendar.YearPickerGridBody>
                      {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                    </RangeCalendar.YearPickerGridBody>
                  </RangeCalendar.YearPickerGrid>
                </RangeCalendar>
              </I18nProvider>
              <Typography type="body-sm" className="range-summary" aria-live="polite">
                {pendingFrom && pendingTo
                  ? `${pendingFrom.split('-').reverse().join('/')} – ${pendingTo.split('-').reverse().join('/')}`
                  : 'Chưa chọn khoảng ngày'}
              </Typography>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button isDisabled={!isValid} onPress={onApply}>
                Áp dụng
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
