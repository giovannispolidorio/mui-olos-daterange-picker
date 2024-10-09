import {FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent} from '@mui/material';
import React from 'react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import {getMonth, getYear, setMonth, setYear} from 'date-fns';

interface HeaderProps {
  date: Date;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Date) => void;
  nextDisabled: boolean;
  prevDisabled: boolean;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onHeaderChange?: () => void;
  locale?: Locale;
}

const generateYears = (relativeTo: Date, count: number) => {
  const half = Math.floor(count / 2);
  return Array(count)
    .fill(0)
    .map((_y, i) => relativeTo.getFullYear() - half + i); // TODO: make part of the state
};

const Header: React.FunctionComponent<HeaderProps> = ({
  date,
  setDate,
  nextDisabled,
  prevDisabled,
  onClickNext,
  onClickPrevious,
  locale,
  onHeaderChange,
}: HeaderProps) => {
  const MONTHS = typeof locale !== 'undefined'
    ? [...Array(12).keys()].map(d => locale.localize?.month(d, { width: 'abbreviated', context: 'standalone' }))
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    const newDate = setMonth(date, parseInt(event.target.value as string, 10));
    setDate(newDate); 
    onHeaderChange && onHeaderChange();
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    const newDate = setYear(date, parseInt(event.target.value as string, 10));
    setDate(newDate); 
    onHeaderChange && onHeaderChange();
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item sx={{ padding: '5px' }}>
        <IconButton
          sx={{
            padding: '10px',
            '&:hover': {
              background: 'none',
            },
          }}
          disabled={prevDisabled}
          onClick={onClickPrevious}
          // size="large"
        >
          <ChevronLeft color={prevDisabled ? 'disabled' : 'action'} />
        </IconButton>
      </Grid>
      <Grid item>
        <FormControl variant="standard">
          <Select
            value={getMonth(date)}
            onChange={handleMonthChange} 
            MenuProps={{ disablePortal: true }}
          >
            {MONTHS.map((month, idx) => (
              <MenuItem key={month} value={idx}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl variant="standard">
          <Select
            value={getYear(date)}
            onChange={handleYearChange} 
            MenuProps={{ disablePortal: true }}
          >
            {generateYears(date, 30).map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* <Typography>{format(date, "MMMM YYYY")}</Typography> */}
      </Grid>
      <Grid item sx={{ padding: '5px' }}>
        <IconButton
          sx={{
            padding: '10px',
            '&:hover': {
              background: 'none',
            },
          }}
          disabled={nextDisabled}
          onClick={onClickNext}
          // size="large"
        >
          <ChevronRight color={nextDisabled ? 'disabled' : 'action'} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Header;
