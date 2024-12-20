import * as React from "react";
import { addMonths, addYears, isAfter, isBefore, isSameDay, isSameMonth, isWithinInterval, max, min, subMonths} from "date-fns";
import { DateRange, DefinedRange, NavigationAction } from "../types";
import { getValidatedMonths, parseOptionalDate } from "../utils";
import { getDefaultRanges } from "../defaults";
import Menu from "./Menu";
import { MARKERS } from "./Markers";

interface DateRangePickerProps {
  open: boolean;
  initialDateRange?: DateRange;
  definedRanges?: DefinedRange[];
  minDate?: Date | string;
  maxDate?: Date | string;
  // eslint-disable-next-line no-unused-vars
  onChange: (dateRange: DateRange) => void;
  // eslint-disable-next-line no-unused-vars
  onCalendarChange?: (newDate?: Date) => void;
  onHeaderCalendarChange?: () => void;
  locale?: Locale;
}

const DateRangePicker: React.FunctionComponent<DateRangePickerProps> = (props: DateRangePickerProps) => {
  const today = new Date();

  const {
    open,
    onChange,
    initialDateRange,
    minDate,
    maxDate,
    definedRanges = getDefaultRanges(new Date(), props.locale),
    locale,
    onCalendarChange,
    onHeaderCalendarChange,
  } = props;

  const minDateValid = parseOptionalDate(minDate, addYears(today, -10));
  const maxDateValid = parseOptionalDate(maxDate, addYears(today, 10));
  const [intialFirstMonth, initialSecondMonth] = getValidatedMonths(initialDateRange || {}, minDateValid, maxDateValid);

  const [dateRange, setDateRange] = React.useState<DateRange>({ ...initialDateRange });
  const [hoverDay, setHoverDay] = React.useState<Date>();
  const [firstMonth, setFirstMonth] = React.useState<Date>(intialFirstMonth || today);
  const [secondMonth, setSecondMonth] = React.useState<Date>(initialSecondMonth || addMonths(firstMonth, 1));

  const { startDate, endDate } = dateRange;

  // handlers
  const setFirstMonthValidated = (date: Date) => {
    if (isBefore(date, secondMonth)) {
      setFirstMonth(date);
    }
  };

  const setSecondMonthValidated = (date: Date) => {
    if (isAfter(date, firstMonth)) {
      setSecondMonth(date);
    }
  };

  const setDateRangeValidated = (range: DateRange) => {
    let { startDate: newStart, endDate: newEnd } = range;

    if (newStart && newEnd) {
      range.startDate = newStart = max([newStart, minDateValid]);
      range.endDate = newEnd = min([newEnd, maxDateValid]);

      setDateRange(range);
      onChange(range);

      setFirstMonth(newStart);
      setSecondMonth(isSameMonth(newStart, newEnd) ? addMonths(newStart, 1) : newEnd);
    } else {
      // const emptyRange = {};

      // setDateRange(emptyRange);
      // onChange(emptyRange);

      setFirstMonth(subMonths(today, 1));
      setSecondMonth(today);
    }
  };

  const onDayClick = (day: Date) => {
    if (startDate && !endDate && !isBefore(day, startDate)) {
      const newRange = { startDate, endDate: day };
      onChange(newRange);
      setDateRange(newRange);
    } else {
      setDateRange({ startDate: day, endDate: undefined });
    }
    setHoverDay(day);

    if (onCalendarChange) onCalendarChange(day);
  };

  const onMonthNavigate = (marker: symbol, action: NavigationAction) => {
    if (marker === MARKERS.FIRST_MONTH) {
      const firstNew = addMonths(firstMonth, action);
      if (isBefore(firstNew, secondMonth)) setFirstMonth(firstNew);
    } else {
      const secondNew = addMonths(secondMonth, action);
      if (isBefore(firstMonth, secondNew)) setSecondMonth(secondNew);
    }

    if (onCalendarChange) onCalendarChange(action === NavigationAction.Previous ? firstMonth : secondMonth);
  };

  const onHeaderChange = () => {
    if (onHeaderCalendarChange) onHeaderCalendarChange();
  };

  const onDayHover = (date: Date) => {
    if (startDate && !endDate) {
      if (!hoverDay || !isSameDay(date, hoverDay)) {
        setHoverDay(date);
      }
    }
  };

  // helpers
  const inHoverRange = (day: Date) =>
    (startDate &&
      !endDate &&
      hoverDay &&
      isAfter(hoverDay, startDate) &&
      isWithinInterval(day, { start: startDate, end: hoverDay })) as boolean;

  const helpers = {
    inHoverRange,
  };

  const handlers = {
    onDayClick,
    onDayHover,
    onMonthNavigate,
    onHeaderChange,
  };

  return open ? (
    <>
      <Menu
        dateRange={dateRange}
        minDate={minDateValid}
        maxDate={maxDateValid}
        ranges={definedRanges}
        firstMonth={firstMonth}
        secondMonth={secondMonth}
        setFirstMonth={setFirstMonthValidated}
        setSecondMonth={setSecondMonthValidated}
        setDateRange={setDateRangeValidated}
        helpers={helpers}
        handlers={handlers}
        locale={locale}
      />
    </>
  ) : null;
};

export default DateRangePicker;
