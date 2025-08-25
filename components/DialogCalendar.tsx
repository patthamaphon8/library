"use client";

import * as React from "react";
// import { ChevronDownIcon } from "lucide-react";

// import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import dayjs from "dayjs";

interface PopoverCalendarProps {
  // open: boolean;
  // onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  onChange?: (date?: Date) => void;
  // disabled?: boolean;
}

function PopoverCalendar({
  // open,
  // onOpenChange,
  children,
  onChange,
  // disabled,
}: PopoverCalendarProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const handleOnChangeDate = (date?: Date) => {
    setDate(date);
    handleOnOpenChange(false);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        {children}
        {/* <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleOnChangeDate}
        />
      </PopoverContent>
    </Popover>
  );
}

export default PopoverCalendar;
