import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { isSameDay } from "date-fns";
import { DateRange, DefinedRange } from "../types";

type DefinedRangesProps = {
  // eslint-disable-next-line no-unused-vars
  setRange: (range: DateRange) => void;
  selectedRange: DateRange;
  ranges: DefinedRange[];
};

const isSameRange = (first: DateRange, second: DateRange) => {
  const { startDate: fStart, endDate: fEnd } = first;
  const { startDate: sStart, endDate: sEnd } = second;
  if (fStart && sStart && fEnd && sEnd) {
    return isSameDay(fStart, sStart) && isSameDay(fEnd, sEnd);
  }
  return false;
};

const DefinedRanges: React.FunctionComponent<DefinedRangesProps> = ({
  ranges,
  setRange,
  selectedRange,
}: DefinedRangesProps) => {
  return (
    <List>
      {ranges.map((range, idx) => {
        const _isActived = range.type === "date" ? isSameRange(range, selectedRange) : range.activie || false;

        return (
          <ListItem
            button
            key={idx}
            onClick={() => {
              setRange(range);
              if (range.onClick) range.onClick();
            }}
            sx={[
              _isActived && {
                backgroundColor: (theme) => theme.palette.primary.dark,
                color: "primary.contrastText",
                "&:hover": {
                  color: "inherit",
                },
              },
            ]}
          >
            <ListItemText
              primaryTypographyProps={{
                variant: "body2",
                sx: {
                  fontWeight: _isActived ? "bold" : "normal",
                },
              }}
            >
              {range.label}
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
};

export default DefinedRanges;
